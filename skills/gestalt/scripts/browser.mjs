// Minimal Chrome DevTools Protocol client. It uses only Node built-ins (the
// global WebSocket needs Node 22+), so the detector ships with no dependencies.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CANDIDATES = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  ],
  win32: [
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${process.env['PROGRAMFILES(X86)']}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ],
  linux: ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge'],
};

export function findBrowser() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  for (const candidate of CANDIDATES[process.platform] || CANDIDATES.linux) {
    if (candidate.includes('/') || candidate.includes('\\')) {
      if (existsSync(candidate)) return candidate;
    } else if (spawnSync('which', [candidate]).status === 0) {
      return candidate;
    }
  }
  return null;
}

export async function launch() {
  const executable = findBrowser();
  if (!executable) throw new Error('No Chrome, Edge or Chromium found. Install one, or set CHROME_PATH.');
  if (typeof WebSocket === 'undefined') throw new Error('Node 22 or newer is required (global WebSocket).');
  const profile = mkdtempSync(join(tmpdir(), 'gestalt-'));
  const child = spawn(executable, [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars=false', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  const wsUrl = await new Promise((resolve, reject) => {
    let log = '';
    const timer = setTimeout(() => reject(new Error(`Browser did not start. ${log.slice(-300)}`)), 20000);
    child.stderr.on('data', (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    child.on('exit', () => { clearTimeout(timer); reject(new Error(`Browser exited early. ${log.slice(-300)}`)); });
  });

  const socket = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', () => reject(new Error('Could not connect to the browser.')), { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  const waiters = [];
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    } else if (message.method) {
      for (let i = waiters.length - 1; i >= 0; i -= 1) {
        const w = waiters[i];
        if (w.method === message.method && w.sessionId === message.sessionId) {
          waiters.splice(i, 1);
          w.resolve(message.params);
        }
      }
    }
  });

  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = nextId;
    nextId += 1;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, sessionId }));
  });
  const once = (method, sessionId, timeoutMs) => new Promise((resolve) => {
    const waiter = { method, sessionId, resolve };
    waiters.push(waiter);
    setTimeout(() => {
      const index = waiters.indexOf(waiter);
      if (index >= 0) { waiters.splice(index, 1); resolve(null); }
    }, timeoutMs);
  });

  return {
    async newPage() {
      const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
      const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
      const page = {
        send: (method, params) => send(method, params, sessionId),
        async setup({ width, height, dark, reducedMotion }) {
          await page.send('Page.enable');
          await page.send('Runtime.enable');
          await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
          await page.send('Emulation.setEmulatedMedia', {
            features: [
              { name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' },
              { name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' },
            ],
          });
        },
        init: (source) => page.send('Page.addScriptToEvaluateOnNewDocument', { source }),
        async goto(url, timeoutMs = 30000) {
          const loaded = once('Page.loadEventFired', sessionId, timeoutMs);
          const result = await page.send('Page.navigate', { url });
          if (result.errorText) throw new Error(`${url}: ${result.errorText}`);
          await loaded;
        },
        async evaluate(expression) {
          const { result, exceptionDetails } = await page.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
          if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
          return result.value;
        },
        async pressTab() {
          const key = { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 };
          await page.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...key });
          await page.send('Input.dispatchKeyEvent', { type: 'keyUp', ...key });
        },
        async screenshot(clip) {
          const { data } = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...clip, scale: 1 } });
          return Buffer.from(data, 'base64');
        },
        close: () => send('Target.closeTarget', { targetId }),
      };
      return page;
    },
    async close() {
      try { await send('Browser.close'); } catch { /* the browser may already be gone */ }
      socket.close();
      child.kill();
      await new Promise((resolve) => setTimeout(resolve, 150));
      rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
    },
  };
}
