# Tour and kitchen-fit closing layout regression

The previous Resources edit placed trial terms inside the button row. At desktop widths, the auto-sized right grid column claimed nearly all available space: the tour heading measured 77.9px wide and the kitchen-fit heading 61.2px (0px at 1024). This created vertical word stacks and overlapping actions without necessarily overflowing the page.

The failing browser test was run before the fix. A one-variable browser probe replacing the auto column with bounded fractional columns restored the tour heading to 547.7px. Both pages now use bounded columns and put billing terms below a separate button row. No route, workflow, public copy or billing term changed. Composite was considered but not used: these are two fixed content groups, not a recursive structure.

`node scripts/verify-resource-closings.mjs` passes against localhost:4321 at 1440, 1280, 1024, 768 and 390px. It checks heading width, heading/button overlap and document overflow, saves closing-section screenshots, and verifies the exact recipe-costing deep link plus Next/Previous navigation. The corrected desktop, tablet and mobile screenshots were inspected. The layout detector reports no findings.

Prevention: first-viewport screenshots and whole-page overflow checks were insufficient. This regression test explicitly measures the closing sections, where readable text can collapse without creating horizontal overflow. The previous Resources report’s broad visual-completion claim missed this defect; this follow-up supersedes it for these two sections.
