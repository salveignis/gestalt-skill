# Empirical HCI and web-usability evidence on Gestalt principles in user interfaces

**Evidence-access labels used throughout.** [FULL] = I read the page or paper text. [ABS] = abstract or search-result excerpt of the primary source only. [SEC] = a secondary source describing the study. Many ACM and journal PDFs could not be read in this session (paywalls, 403 errors, unreadable PDF extraction), so most academic items are [ABS] or [SEC]. Era/platform tags: DESKTOP-OLD (pre-2010 or character/early GUI), DESKTOP-WEB, MOBILE, LAB (not a UI).

**Corrections to the brief's attributions.**
- "Psychologically-inspired perceptual grouping for GUI" (Xie et al.) was published at ESEC/FSE 2022, not UIST 2022. Source: [arXiv record](https://arxiv.org/abs/2206.10352v2).
- I found no paper by "Harrison, Chang & Baudisch". These look like separate works: Chang & Ungar 1993, and Baudisch et al. 2006 (Phosphor). A Harrison paper may exist, but I did not find one on grouping or common fate.

## Experiments on grouping in web and GUI layouts

### Takeaway
The best quantitative evidence is old, and it concerns search time on static desktop or character displays: group count and group size predict search time (Tullis), good grouping and alignment go with faster search and higher preference (Parush), and visual cues help when they match semantic structure (Halverson & Hornof). I found no isolated, modern effect size for a single Gestalt principle in a real web or mobile task, and few standardised effect sizes appear anywhere in what I could read.

### Cited Findings

**Tullis 1984 (DESKTOP-OLD; alphanumeric displays) [ABS]**
- Rice University dissertation. Four format characteristics: overall density, local density, grouping, layout complexity. Two experiments used 520 computer-generated displays. Regression R² = .508 for search time and R² = .805 for subjective ratings. An a priori test on 150 new displays gave r = .800 between predicted and actual search time — [Tullis abstract](https://core.ac.uk/display/4438915). The page returned 403 on direct fetch, so these values come from a search excerpt. Participant N was not seen.
- The strongest search-time predictors were the number of groups and the average visual angle of groups. Local density mattered more for subjective ratings — [Tullis abstract](https://core.ac.uk/display/4438915).
- A secondary critique notes that the displays were plain characters with no video enhancements or line-drawing, and that a single regression score is neither diagnostic nor prescriptive — [Perlman, axiomatic model](https://garyperlman.com/papers/axiomatic.htm).
- Tullis (1983) treats grouping as a kind of density, defined by the number of perceptual groups formed by display elements. This is reported via a thesis — [Virginia Tech thesis](https://vtechworks.lib.vt.edu/handle/10919/91136).
- The model was applied to highlighted and non-highlighted tabular displays — [HFES 1987 abstract](https://garyperlman.com/hfeshci/Abstracts/87_1221-1225.html). I did not see the numeric comparison.

**Parush, Nadir & Shtub 1998 (DESKTOP-OLD; GUI screens) [ABS/SEC]**
- Model with four factors: element size, local density, alignment, grouping. It outputs a complexity score. Well-designed screens gave shorter search times and higher preference, and model predictions correlated significantly with search time — [abstract](https://data.zhenzhi.com/details/1/887603301); [dblp](https://dblp.org/rec/journals/ijhci/ParushNS98).
- N = 75. Good grouping and alignment were linked to shorter search and higher preference. No times or statistics are given in this summary — [Human Factors International newsletter](https://www.humanfactors.com/newsletters/web_page_design.asp).
- **Conflict:** the secondary summary says local density had "little or no effect"; the abstract says poor alignment combined with poor local density had the strongest adverse effect on search time. Likely reading: an interaction rather than a main effect, but I could not check it in the full text.
- Related but unread: a cross-language web-page study of visual layout factors — [abstract listing](https://data.zhenzhi.com/details/1/877590263).

**Hornof, and Halverson & Hornof (DESKTOP-OLD; word layouts and menus, eye tracking) [ABS]**
- In hierarchical layouts, labelled layouts were faster, and unlabelled layouts showed a larger number-of-groups effect on search time — [search excerpts, Hornof paper](https://escholarship.org/content/qt0ds0j4kg/qt0ds0j4kg.pdf?t=os5kyy). Search times were not extracted because the PDF was unreadable. The excerpt-to-URL mapping is not fully verified.
- Thirty-six participants searched word menus for known items. In semantically organised menus, visual cues marking the boundaries of large semantic groups gave the fastest search. Grouping unrelated items was predicted to hurt, because cues imply structure that is not there — [Halverson author listing](https://scite.ai/authors/tim-halverson-g1QXPA?page=4). Effect sizes not seen.
- "Local Density Guides Visual Search: Sparse Groups are First and Faster" used sparse, dense and mixed-density layouts. The title itself states the direction — [record](https://katalog.lib.cas.cz/KNAV/EdsRecord/edsair,edsair.doi...........007195586cb5c234ada4e3aa472c0762); [ICCM 2004 paper](https://iccm-conference.neocities.org/2004/proceedings/papers/Halverson.pdf). Numbers not seen.

**Treisman-style and psychophysical search (LAB, not UI)**
- Speeded judgments of proximity groups were on average faster and more accurate than judgments of similarity groups — [PMC11093805](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11093805/) [ABS].
- Search needing similarity grouping was consistent with serial processing, and became parallel when items touched — [Yu et al. 2018](https://visualcognition.psych.northwestern.edu/publications/YuSearchCognition2018.pdf) [SEC via search].
- Search for items of a target colour proceeds by examining same-coloured groups in sequence (Bundesen & Pedersen 1983) — [Color segregation and visual search](https://typeset.io/pdf/color-segregation-and-visual-search-52rl6lm61x.pdf) [ABS].
- Mean response time rose with the number of groups (4, 8, 16, 32) — [IEICE](https://global.ieice.org/en_transactions/fundamentals/10.1587/e76-a_2_225/_p) [ABS].
- Palmer & Rock proposed uniform connectedness as prior to classical grouping — [Han, Humphreys & Chen 1999](https://link.springer.com/content/pdf/10.3758/BF03200760.pdf) [ABS].
- **Contested:** Han et al. found proximity grouping can be as fast as uniform connectedness in a letter-discrimination task, with uniform connectedness faster only as the number of global objects grew — [Han et al.](https://link.springer.com/article/10.1360/03yc9013) [ABS]. Another study found that proximity alone had a similar grouping effect to competing conjoined principles, including common region — [UNED record](https://portalcientifico.uned.es/documentos/5f88eb2129995259ef2987ff) [ABS]. So the "cards beat whitespace" ordering often taught in UI guidance is not settled even in the lab.

**Chang, Dooley & Tuovinen (instructional multimedia; DESKTOP-OLD) [ABS]**
- Eleven Gestalt laws were distilled from the literature and applied to redesign the WoundCare nursing application. Three user groups compared old and new designs. 85% of evaluators rated positively both the new design and the value of the rules — [CRPIT abstract](https://crpit.scem.westernsydney.edu.au/abstracts/CRPITV8Chang.html); [journal version abstract](https://oro.open.ac.uk/11374). This is subjective preference for a whole redesign. It cannot attribute any effect to a single law, and I saw no objective learning measure.

**Grobelny and colleagues (DESKTOP-OLD) [ABS]**
- Grobelny, Karwowski & Drury 2005: an additive model (index of difficulty, array mode, log2 number of icons) explained 95% of variance in mean icon-acquisition time across four experiments — [journal record](https://researchconnect.suny.edu/en/publications/usability-of-graphical-icons-in-the-design-of-human-computer-inte/). This is a Fitts' law and icon study. The sources do not mention Gestalt, so it should not be cited as Gestalt evidence.
- Later control-panel work (grid-based algorithms; background colour and layout) was found only as titles — [dblp](https://dblp.dagstuhl.de/pid/12/7897.html). No Gestalt-specific result confirmed.

**Moore & Fitz 1993 [ABS]**
- Presents six principles (figure-ground, symmetry, closure, proximity, good continuation, similarity) as an analytic vocabulary for document design, applied to a poorly designed instruction set. Pedagogical and analytic; I saw no experiment — [Scilit](https://scilit.com/publications/489630be059db8c3b15f4c0b51471069). **Citation conflict:** another index gives a different journal and pages — [ACNP index](https://acnpsearch.tweb-dev.unibo.it/singlejournalindex/33080985).

**Recent models (2026 preprints) [ABS]**
- Sourulahti & Jokinen: a computational-rationality model, validated against two human studies, reports that semantic grouping improves search when aligned with spatial grouping. N not shown on the abstract page — [arXiv 2606.26725](https://arxiv.org/abs/2606.26725).
- Wang et al.: layouts generated by answer set programming with objectives including grouping and whitespace were rated above random and heuristic designs in two user studies. Grouping was not tested on its own in what the abstract shows — [arXiv 2609.03918](https://arxiv.org/abs/2609.03918).

### Inferences
- Across Tullis, Hornof and Parush, the replicated direction is that structure helps search. The moderators are group count and size (Tullis), labels (Hornof), and semantic match (Halverson & Hornof; Sourulahti & Jokinen).
- "Grouping" in these studies is usually bundled with density, alignment and labels. Claims such as "proximity reduces search time by X%" have no support in what I could read.
- Semantic match looks like the most decision-relevant moderator: spatial grouping that disagrees with meaning is predicted to cost time. That prediction comes partly from models and a small number of experiments, and I did not see an effect size.
- The results are from static displays with word or character targets and known-item search. Transfer to modern, image-rich, scrolling, responsive mobile pages is an assumption, not a finding.

### Gaps
- **No direct evidence found:** Bonsiepen (1968) and Grahame (1983). Searches returned nothing, so I cannot state their measures. I could not identify which Grahame work the brief means.
- Exact Hornof search times and the Tullis participant N, equations and any group-size guideline. A commonly repeated "5 degree" group-size rule could not be confirmed.
- No controlled mobile app experiment manipulating proximity versus similarity with gaze and task time was found. Blog claims of this kind were unsourced — [Gestalt mobile search result example](https://fullclarity.co.uk/insights/gestalt-principles-in-ui/).
- No experiment comparing cards with whitespace in a web search task was found.
- Comprehension as an outcome: I found no web layout study isolating grouping and measuring comprehension. Chang et al. is the closest, and it reports perceived value.

## Computational models of perceived UI layout

### Takeaway
Metrics explain roughly a third to a half of variance in aesthetic or complexity ratings, but those metrics are mostly about colour, clutter, contours and symmetry rather than grouping. Grouping-specific algorithms are scored against view hierarchies or designer layers, or with small preference studies, so "perceptually correct grouping" has barely been validated against human grouping judgments.

### Cited Findings

**Grouping algorithms**
- **Koch & Oulasvirta 2016 (CHI EA, pp. 1423–1429) [ABS]:** Gestalt laws act as parsing heuristics, with parameters chosen to settle conflicts between competing readings, producing a hierarchical grouping. A short preliminary study — [Unpaywall/ACM record](https://unpaywall.org/10.1145%2F2851581.2892537); [researchr](https://researchr.org/publication/KochO16). Validation N and accuracy not seen. A later paper describes it as four Gestalt-based rules on web page DOM elements, and criticises hand-defined objective functions as hard to extend — [arXiv 2201.05194](https://ar5iv.labs.arxiv.org/html/2201.05194) [FULL, via ar5iv].
- **Xie et al. 2022 (ESEC/FSE; MOBILE: Android, plus design prototypes) [FULL]:** unsupervised grouping using connectedness, similarity, proximity and continuity, on 1,091 Rico screenshots from 772 apps and 20 Figma prototypes.
  - F1 at edit distance ≤1: 0.672 with metadata widgets; 0.593 with detected widgets; 0.783 on Figma prototypes.
  - The Screen Recognition baseline scored 0.123, 0.092 and 0.232 respectively.
  - On detected widgets, F1 varied from 0.475 at distance 0 to 0.709 at distance 4.
  - No human-perception study. Ground truth came from view hierarchies, with screens manually filtered, or from designer layers.
  - Reported failures: over- and under-segmentation, occlusion, modals, no semantic grouping.
  - Source: [ar5iv 2206.10352](https://ar5iv.labs.arxiv.org/html/2206.10352).
- **Reverse-Engineering Information Presentations (2022; slides, not web) [FULL, via ar5iv]:** a Transformer reached 86.32% pairwise relatedness accuracy, against 85.72% without spatial attention and 77.49% for the neural baseline.
  - Corpus of 23,072 slides; 1,008 labelled slides, 519,415 pairs.
  - In a preference study (N = 20, 500 comparisons), 39% preferred automatic results, 42.4% designer results and 18.6% rated them the same (t(19) = 0.45, p = .66).
  - Ignores content, and is not a complete perceptual model.
  - Source: [arXiv 2201.05194](https://ar5iv.labs.arxiv.org/html/2201.05194).

**Metric toolkits and clutter**
- **AIM (Oulasvirta et al. 2018, UIST adjunct) [ABS]:** service and codebase pooling empirically validated models of perception and attention; 17 metrics from clutter to visual learnability — [Aalto record](https://aaltodoc.aalto.fi/items/a5da620f-fcbc-4e88-b0f4-e4143fc7147f); [PDF](https://acris.aalto.fi/ws/portalfiles/portal/30261274/ELEC_oulasvirta_et_al_2018_002_.pdf). Whether a dedicated grouping metric exists was not confirmed.
- **Rosenholtz, Li & Nakano 2007 [ABS]:** Feature Congestion and Subband Entropy clutter measures correlate well with search performance in complex imagery — [MIT DSpace](https://dspace.mit.edu/handle/1721.1/37593); [PubMed](https://pubmed.ncbi.nlm.nih.gov/18217832). A later study found Feature Congestion no better than edge density at predicting clutter's effect on search — [Yu et al. JoV 2014](https://www3.cs.stonybrook.edu/~cvl/content/papers/2014/Yu_JoV2014.pdf). A 2011 study reports it predicting perceived clutter on a UI — [GI record](https://dl.gi.de/handle/20.500.12116/7917).

**Aesthetics metrics and first impressions**
- **Miniukovich & De Angeli 2015 (CHI) [ABS/SEC]:** eight metrics including grid quality and white space. Models explained up to 49% of variance in webpage aesthetics (N = 62) and up to 32% in iPhone app aesthetics if genre is considered (N = 53) — [Trento record](https://iris.unitn.it/handle/11572/101632); [thesis](https://iris.unitn.it/retrieve/4428babf-9533-4673-b270-55d7adbd29f9/aesthetics_thesis_v1.2.12_final_1.pdf). The excerpt does not make clear whether N counts stimuli or participants, and no grid-quality coefficient was seen. An earlier complexity paper reported up to 51% of aesthetics and 50% of complexity ratings — [Quantification of Interface Visual Complexity](https://www.academia.edu/11396872/Quantification_of_Interface_Visual_Complexity).
- **Reinecke & Gajos [ABS]:**
  - 2014: about 2.4 million ratings from almost 40,000 participants on 430 websites, with demographic differences in preferred colourfulness and complexity — [project page](https://eecs.harvard.edu/~kgajos/papers/2014/reinecke14visual.shtml).
  - 2013: 548 volunteers and 450 sites; the models explained about half of variance in 500 ms appeal ratings — [project page](https://www.eecs.harvard.edu/~kgajos/papers/2013/reinecke13predicting.shtml).
  - These measure appeal from screenshots, and do not measure grouping.
- **Lindgaard et al. 2006 [SEC]:** appeal can be assessed within 50 ms; results at 50 ms and 500 ms were consistent between participants, and more consistent at the longer exposure — [Website Optimization summary](https://old.websiteoptimization.com/speed/tweak/blink). Tractinsky et al. 2006 report consistency when averaged but considerable individual differences — [BGU record](https://www.bgu.ac.il/researcher/noam-tractinsky/publications/349269701/).
- **Tuch et al. 2012 [ABS/SEC]:** 119 screenshots, between-subject exposure of 50, 500 and 1000 ms. Low complexity and high prototypicality were most appealing. A second experiment used 17, 33 and 50 ms, with prototypicality less pronounced at the shortest exposures. Sources: [Google Research page](https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/); [Google blog](https://research.google/blog/users-love-simple-and-familiar-designs-why-websites-need-to-make-a-great-first-impression/?m=1).
- **Ngo, Teo & Byrne 2003 [ABS]:** 14 aesthetic measures including balance, symmetry, unity, density, cohesion and regularity — [record](https://shdl.mmu.edu.my/2562). A citing paper reports a strong correlation with perceived aesthetics, but I saw no value — [Ngo & Byrne 2001](https://eudml.org/doc/207518).
- Wang, Miniukovich & Ren 2025 report that their interpretable metric correlates more strongly with aesthetic impressions than past metrics — [BIT record](https://econpapers.repec.org/RePEc:taf:tbitxx:v:44:y:2025:i:3:p:508-522). Values not seen.

**Vision models and Gestalt**
- Athreya & Malladi 2026 (preprint) [FULL, HTML]: 45 models across Closure and Similarity.
  - Open VLM agreement on silhouettes was 0.405–0.762. Closed-model highs were B = 0.865 (GPT-5.4-Pro) and κ = 0.589 (Claude-Opus-4.6), the latter above the 0.489 human ceiling.
  - On mark-colour odd-one-out, most open VLMs sat near the 0.35 guessing floor.
  - UI layouts were not covered; proximity is named only as future work. Human data are reused from published work (for example, 10 observers on silhouettes; 20 crowdworkers on mark colour).
  - Source: [arXiv 2608.10195](https://arxiv.org/html/2608.10195).
- ELVIS is a procedural benchmark covering proximity, similarity, closure, symmetry and continuity — [GitHub mirror listing](https://gh.r-mj.com/ml-research/ELVIS) [ABS].
- An earlier study found deep networks only weakly sensitive to proximity and insensitive to orientation and linearity — [arXiv 2203.07302](https://arxiv.org/abs/2203.07302v2) [ABS].

### Inferences
- The variance explained by the metrics (about 32–51%) describes screenshot appeal or complexity. It is not evidence that grouping causes better task performance.
- The mobile result (32% for iPhone, with genre) is lower than the web result (49%) in the same paper, suggesting desktop-web metrics may not transfer cleanly. This rests on one study.
- Xie et al.'s F1 values measure agreement with engineering or designer structure, and implementation hierarchies need not match perception. A tool that reports "correct grouping" from these methods is not validated for human perception.
- A vision LLM that passes a closure or similarity test has not thereby shown it can judge UI grouping, since no benchmark I found tests UI layouts with human ground truth.

### Gaps
- Koch & Oulasvirta's validation data. The full text was not accessed.
- Whether AIM has a grouping metric. Its full text and code docs were not readable in this session.
- **No direct evidence found:** Purchase's interface-aesthetic work, the Rosenholtz, Twarog & Schinkel-Bielefeld grouping model or DesignEye, a "UI Grouping" paper, UIED primary results beyond those in Xie (enhanced UIED F1 0.626 versus original 0.524 — [ar5iv](https://ar5iv.labs.arxiv.org/html/2206.10352)), and work by "Zhou" with Oulasvirta.
- No validated dataset of human-labelled perceptual groups on web or mobile UIs was found.

## Applied industry evidence

### Takeaway
Industry guidance is mostly qualitative observation, useful for finding failure patterns but not for estimating effects. Among the sources checked, only form-label placement has a line of comparison studies, and it is small, conflicting and mostly old; the commonly repeated top-aligned advice is well supported on narrow mobile screens, and much less clearly on desktop.

### Cited Findings

**Proximity, common region, cards**
- NN/g's proximity article [FULL] reports no measured data, N or experiment. Evidence is site examples and a passing reference to its mobile-usability studies. It observes that stacking on small screens can separate related links, in one example — [NN/g proximity](https://www.nngroup.com/articles/gestalt-proximity/).
- Cards and common region: I found practitioner blogs only, and no measured NN/g result. Palmer's border-overrides-proximity claim is a lab demonstration, relayed by a blog — [UX Tigers](https://www.uxtigers.com/post/gestalt-principles) [SEC].

**Form labels**
- **Penzo 2006 [FULL]:** eye tracking with experts and novices on 4-field forms. N is not reported, and no statistics are given. Saccades were about 500 ms for left-aligned labels, 170–240 ms for right-aligned, about 50 ms for labels above, and about 80 ms for bold labels above. Right alignment "nearly halved" fixations and completion time versus left. The author calls it a starting point, and commenters flag differing label text and possible order effects as confounds. Source: [UXmatters](https://www.uxmatters.com/MT/archives/000107.php).
- **Das, McEwan & Douglas 2008 [ABS]:** eleven subjects: five were faster with right-aligned and five with top-aligned labels. The abstract recommends right-aligned labels, contradicting Wroblewski, at least for forms with multiple differently aligned sections — [Napier repository](https://napier-repository.worktribe.com/OutputFile/232504). Later practitioner summaries say no difference between top and right — [cxpartners](https://www.cxpartners.co.uk/our-thinking/web_forms_design_guidelines_an_eyetracking_study/).
- **Conflict:** secondary sources describe Penzo inconsistently, including one saying left alignment scanned better — [SAP blog](https://blogs.sap.com/t5/crm-and-cx-blogs-by-sap/form-design/ba-p/13449657). The primary article above favours labels above in simple forms. Caroline Jarrett, in a follow-up reproduced in the article's comments, argues the results do not generalise to complex forms, translation or mobile use — [UXmatters](https://www.uxmatters.com/MT/archives/000107.php).
- **Baymard 2013 (MOBILE, old devices) [FULL]:** a study of 18 mobile e-commerce sites with more than 1,000 fields completed; participant N and statistics not stated. Labels above in portrait, with a landscape exception, because left labels leave too little field width. The page shows no revision date, and the device figures are from the iPhone 4S era — [Baymard](https://baymard.com/blog/mobile-form-usability-label-position).
- **Inline labels:** Baymard says inline labels showed major usability problems in every test it ran, with users deleting input to see the label again. Allowed only for single or short forms. Floating labels were then "yet to be extensively tested" — [Baymard](https://baymard.com/blog/mobile-forms-avoid-inline-labels) [ABS].
- **Floating labels:** a Material study is cited, and the article's author reports negative usability findings. Neither is a primary study with numbers that I could verify — [Smashing](https://smashingmagazine.com/2021/02/material-design-text-fields) [SEC].

**False floors and closure (illusion of completeness)**
- NN/g 2016 [FULL]: 8 users on one site, 6 of 8 not realising the page scrolled, plus annotated examples. Recommends letting content peek above the fold, avoiding large gaps and strong horizontal lines at the fold, and edge bleed in carousels. Horizontal scrolling is described as not expected on desktop — [NN/g illusion](https://www.nngroup.com/articles/illusion-of-completeness/).
- NN/g scroll fading [FULL]: qualitative testing with N not stated. Fade-in on already complete-looking pages led many users to assume nothing was below, more severely on mobile where whitespace separated content — [NN/g scroll fading](https://www.nngroup.com/articles/scroll-fading-101/).
- Tognazzini coined the term in 1998 — [NN/g illusion](https://www.nngroup.com/articles/illusion-of-completeness/).

**Scanning patterns and banner blindness**
- F-pattern: NN/g reports an early-2000s study with more than 45 people and a later one with 47 people. It occurs with unformatted text and when the user is seeking efficiency and not committed to reading every word. Headings and visual grouping are the recommended way to prevent it — [NN/g 2017](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) [FULL]. A blog's figure of 232 users could not be confirmed — [blog](https://sheranjaddoo.blogspot.com/2020/11/f-shaped-pattern-of-reading-on-web.html).
- Layer-cake: a scanning pattern in which the eyes hit headings and subheadings and skip body text, appearing as horizontal lines on heatmaps. No separate measured effect was reported in this article — [NN/g 2017](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/).
- Banner blindness: two desktop tasks with 26 participants each. One participant's 148 fixations included 132 in content and only 1 in the right rail. Ad-like placement, treatment and proximity to ads all signal an ad, and large non-ad graphics are skipped on mobile. A single glance can lead users to avoid a whole area — [NN/g 2018](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/) [FULL]. Benway & Lane 1998 coined the term; this is secondary only — [ClickZ](https://clickz.com/research-internet-users-plagued-by-banner-blindness/58428/).

### Inferences
- Banner blindness can be read as a Gestalt failure: similarity to ads and proximity to ads affect what gets ignored. That is my reading of NN/g's traits; the article does not measure it as a Gestalt effect.
- False floors are best framed as a failure of continuation cues, with observational support from small samples. There is no comparison of cue types that I could find.
- For a skill or guideline, top-aligned labels on mobile is the defensible rule. On desktop, the evidence does not support an absolute rule.

### Gaps
- **No direct evidence found:** CXL's false-floor numbers. No CXL source appeared in search, so I cannot report any.
- Baymard's horizontal-scroll guideline content is paywalled; the page shows placeholders — [Baymard guideline](https://baymard.com/guidelines/1096-tall-horizontal-scroll-areas-on-mobile). Whether clipped items improve horizontal discovery, and by how much, is unverified.
- NN/g's common-region and cards articles were not retrieved. Bargas-Avila's form work was not found.
- Conversion or A/B evidence isolating a Gestalt manipulation was not found.

## Accessibility evidence: screen reader, low vision, zoom, dyslexia, ADHD, older adults, contrast, motion

### Takeaway
I found no study that directly tests whether visual grouping cues are mirrored for assistive-technology users. Adjacent evidence strongly suggests they are not automatically mirrored: screen reader users navigate by headings, and magnifier users lose spatial context. Evidence for cognitive and age groups is thin or from non-UI tasks. For common fate in UIs and for vestibular harm from web motion, I found no direct empirical evidence.

### Cited Findings

**Screen readers**
- WebAIM Survey 10 (December 2023 to January 2024, 1,539 respondents): 71.6% use headings to find information on long pages; others use Find (13.6%), read through (6.4%) or links (4.8%) — [University of Rochester summary](https://www.rochester.edu/digital-accessibility/?p=7992) [SEC]. Landmark and region navigation use was 31.8%, up from 25.6% in 2021 — [WebAIM](https://webaim.org/blog/screen-reader-user-survey-10-results/) [ABS]. Earlier drop: 43.8% in 2014 to 30.5% in survey 7 — [WebAIM survey 7](https://webaim.org/blog/survey7results/) [ABS].
- This is a self-selected survey, and a W3C-list participant argues respondents are not representative — [W3C list](https://lists.w3.org/Archives/Public/w3c-wai-ig/2012AprJun/0175.html). One practitioner email reports complaints of "noise" from over-marked landmarks — [WebAIM list](https://webaim.org/discussion/mail_message?id=38110). Anecdotal.

**Low vision and magnification**
- Szpiro et al. 2016: 11 low-vision participants needed repeated gestures to see content comfortably, and existing tools gave inadequate support — [record](https://cris.iucc.ac.il/en/publications/how-people-with-low-vision-access-computing-devices-understanding/) [ABS]. A summary reports context loss and missed items from small fields of view — [review page](https://a11y-paradise.onrender.com/reviews/69c7015207b42bad6a267c56) [SEC].
- SpaceX Mag 2023: magnifiers enlarge whitespace along with content, forcing panning and mental reconstruction of context. Compacting space saved time on overview and target-acquisition tasks in an 11-user study — [Penn State record](https://pure.psu.edu/en/publications/spacex-mag-an-automatic-scalable-and-rapid-space-compactor-for-op/) [ABS]. Theofanos et al. are reported as finding that magnification can make users miss information and context — [2024 paper](https://pages.cs.wisc.edu/~yeaseulkim/assets/papers/2024_low-vision.pdf) [SEC].

**Dyslexia, ADHD**
- Rello et al.: 22 dyslexic users with eye tracking and interviews, producing web text layout guidelines. Results were not extracted, and the focus is text rather than grouping — [PDF](https://moodle2.units.it/pluginfile.php/33208/mod_resource/content/1/rello1.pdf) [ABS].
- A York thesis tested menus with eye tracking: fragmented menus drew fewer fixations, unified menus were rated easier to use and remember, and participants with dyslexia performed poorly on text and navigation tasks — [record](https://core.ac.uk/works/8606741) [ABS].
- Eye tracking on code layout reports no sign that dyslexic programmers are disproportionately hurt by crowding — [Ulster paper](https://core.ac.uk/download/392356169.pdf) [ABS]. This is code rather than web.
- **ADHD and grouping in UIs:** no direct evidence found.

**Older adults (largely LAB)**
- A 1999 recall study: controlling for visual short-term memory, older adults were more sensitive to proximity and similarity grouping than younger adults — [Scilit](https://scilit.net/publications/3d301d6e639cc09bbbae638a9a4480dc) [ABS].
- A 2009 study: older adults were slower overall, and cues helped younger adults more — [Acta Psychologica Sinica](https://journal.psych.ac.cn/acps/EN/abstract/abstract1871.shtml) [ABS].
- A 2022 haptic search study: older adults gained more from similarity grouping, while proximity worked in the opposite direction, which the authors attribute to spatial position effects. It is touch-based, so it does not translate directly — [Utrecht](https://dspace.library.uu.nl/bitstream/1874/424010/1/The_Influence_of_Aging_on_Perceptual_Grouping_in_Haptic_Search.pdf) [ABS].

**Motion and common fate**
- Chang & Ungar 1993 argue static interfaces are ill suited to conveying change, and apply cartoon animation in the Self UI — [PDF](https://courses.ischool.berkeley.edu/i247/s08/readings/Chang_AnimationInUI_UIST93.pdf) [ABS]. It is design-led, and I saw no controlled measurement.
- Bederson & Boltman 1999: animated viewpoint changes improved reconstruction of the information space, with no task-time penalty — [UMD record](https://drum.lib.umd.edu/handle/1903/984) [ABS]. N not retrieved. This concerns mental maps, not grouping.
- Baudisch et al. 2006 Phosphor: two user studies report "significant performance benefits" for afterglow — [Microsoft Research](https://www.microsoft.com/en-us/research/?p=145436) [ABS]. No numbers. It is explicitly an alternative to waiting through animation.
- Heer & Robertson 2007: two controlled experiments found animated chart transitions can significantly improve graphical perception. Summaries list a preference for staged over simple animation, and animation over static — [paper](https://homes.cs.washington.edu/~jheer/files/2007-AnimatedTrans-InfoVis.pdf); [lecture slides](https://courses.cs.washington.edu/courses/cse442/18au/lectures/CSE442-Animation.pdf) [ABS/SEC]. It concerns charts, not page UI.

**Vestibular**
- Guidance names parallax, fast or continuous animation and autoplay as problematic — [University of Michigan](https://teamdynamix.umich.edu/TDClient/30/Portal/KB/Article/14019/Accommodating-Vertigo-and-Vestibular-Disorders) — and recommends reduced-motion options. This is guidance, not measurement.
- Prevalence figures conflict: 35% of US adults over 40 — [A11y Project](https://a11yproject.com/posts/understanding-vestibular-disorders/); other web figures have no clear origin. Treat them as unverified.

### Inferences
- Visual proximity carries no information in the accessibility tree by default, so the headings data suggest semantic structure has to carry grouping for screen reader users. This is inferred from behaviour and web technology. No grouping-parity experiment was found.
- At high zoom, whitespace-based grouping costs panning. Enlarged whitespace and small viewports could weaken proximity and common-region cues, and SpaceX Mag points that way in one small study. Reflow effects on grouping were not tested in what I found.
- Older-adult results run in mixed directions, so "grouping helps older users more" should stay a hypothesis for UIs.
- Common-fate claims in UI guidance appear to be extrapolated from perception science, plus transition and mental-map studies that do not measure grouping as such.

### Gaps
- **No direct evidence found:** whether visual groups match DOM or ARIA groups at scale; WCAG 1.3.1 failure rates for grouping; low-contrast effects on UI grouping (common-region cards with faint borders are an obvious but untested case); ADHD; common fate as a UI grouping cue; vestibular outcomes from web motion or parallax; effects of `prefers-reduced-motion` on symptoms.
- Reflow and 200–400% zoom effects on grouping perception.
- Numeric results from Tang et al. 2024 (20 low-vision participants, magnification modes) were not retrieved.

## What is robust, weak and unstudied

### Takeaway
The direction "organised displays search faster and look better" is reasonably robust for static desktop displays, but with sparse published magnitudes that I could verify. Principle-specific rankings, mobile transfer, accessibility parity and motion grouping remain weak or unstudied.

### Cited Findings
- **More robust:** group count and size predict search on character displays, with out-of-sample r = .800 — [Tullis](https://core.ac.uk/display/4438915); grouping and alignment relate to search and preference on GUIs, N = 75 — [HFI](https://www.humanfactors.com/newsletters/web_page_design.asp); visual cues aligned with semantic structure gave the fastest menu search, N = 36 — [Halverson listing](https://scite.ai/authors/tim-halverson-g1QXPA?page=4); clutter tracks search in imagery, albeit with competition from simpler measures — [Rosenholtz](https://pubmed.ncbi.nlm.nih.gov/18217832), [Yu et al.](https://www3.cs.stonybrook.edu/~cvl/content/papers/2014/Yu_JoV2014.pdf); rapid appeal judgments relate to complexity and prototypicality — [Tuch](https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/), [Reinecke](https://eecs.harvard.edu/~kgajos/papers/2014/reinecke14visual.shtml).
- **Moderate or conditional:** labels above fields on mobile portrait — [Baymard](https://baymard.com/blog/mobile-form-usability-label-position), qualitative and dated; large whitespace or hard lines acting as false floors, observed but small-sample — [NN/g](https://www.nngroup.com/articles/illusion-of-completeness/).
- **Weak or contested:** top versus right label alignment on desktop, N = 11 split evenly — [Das et al.](https://napier-repository.worktribe.com/OutputFile/232504), and an unreported N with no statistics — [Penzo](https://www.uxmatters.com/MT/archives/000107.php); common region or uniform connectedness over proximity — [Han et al.](https://link.springer.com/article/10.1360/03yc9013); grouping algorithm accuracy as a proxy for perception — [Xie](https://ar5iv.labs.arxiv.org/html/2206.10352).

### Inferences
**Unstudied, as far as these searches reached** (absence of hits is not proof of absence; ACM DL could not be searched directly):
- Isolated single-principle effects on modern web tasks, and cards versus whitespace.
- Controlled grouping experiments on mobile.
- Human-labelled perceptual ground truth for UI grouping.
- Grouping parity across screen reader, zoom and visual use.
- Low contrast and grouping; ADHD and grouping.
- Common fate in UI; vestibular outcomes.
- Vision LLM evaluation on UI grouping.

**Age of evidence:** core performance evidence is 1984–2008 desktop or character-based. Mobile evidence comes from one 2013 qualitative form study, a few NN/g observations, a single aesthetics dataset, and Android screenshots used for algorithm scoring.

### Gaps
- Most academic numbers here need checking against full text before quotation, particularly Tullis, Parush, Hornof and Miniukovich.
- No standardised effect sizes (d, η²) were seen for any grouping manipulation. I do not report any, and this is a limit of access as well as possibly of the literature.
