# Website Accessibility Testing Checklist

Use this checklist when adding or updating content to ensure continued WCAG 2.1 Level AA compliance.

## Pre-Deployment Checklist

### Images
- [ ] All informative images have descriptive alt text
- [ ] All decorative images have empty alt attributes (`alt=""`)
- [ ] Alt text describes image content, not just "image of..."
- [ ] Complex images (charts, diagrams) have longer descriptions if needed
- [ ] No text content relies solely on images

### Links
- [ ] All links have descriptive text or aria-labels
- [ ] Link text describes destination or purpose
- [ ] No "click here" or "read more" without context
- [ ] Icon-only links have aria-label attributes
- [ ] Decorative icons have aria-hidden="true"
- [ ] All links have visible hover/focus states

### Forms
- [ ] All form inputs have associated labels
- [ ] Labels are either visible or use visually-hidden class
- [ ] Required fields are clearly marked
- [ ] Error messages are clear and specific
- [ ] Form validation provides helpful feedback
- [ ] Tab order through form is logical

### Headings
- [ ] Page has exactly one H1 element
- [ ] Heading hierarchy is logical (H1→H2→H3, no skipping)
- [ ] Headings describe content structure, not just styling
- [ ] Heading levels don't skip (e.g., H2→H4)

### Color and Contrast
- [ ] Text has 4.5:1 contrast ratio minimum (normal text)
- [ ] Large text has 3.1 contrast ratio minimum (18pt+ or 14pt+ bold)
- [ ] UI components have 3:1 contrast ratio minimum
- [ ] Information not conveyed by color alone
- [ ] Focus indicators are clearly visible
- [ ] No semi-transparent text on variable backgrounds

### Keyboard Navigation
- [ ] All interactive elements reachable by Tab key
- [ ] Tab order is logical and follows visual layout
- [ ] Focus indicators visible on all focusable elements
- [ ] Keyboard can activate all interactive elements
- [ ] No keyboard traps (can always tab away)
- [ ] Skip navigation link available if needed

### Responsive Design
- [ ] Content remains accessible at 200% zoom
- [ ] Layout doesn't break at different viewport sizes
- [ ] Text remains readable on mobile devices
- [ ] Touch targets are at least 44x44 pixels
- [ ] Horizontal scrolling not required (except data tables)

### ARIA Usage
- [ ] ARIA used only when necessary
- [ ] aria-label describes purpose clearly
- [ ] aria-hidden used only for decorative elements
- [ ] Landmark roles used appropriately
- [ ] Dynamic content changes announced

## Automated Testing

Run before each deployment:

### Google Lighthouse
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Check "Accessibility" category
4. Run audit on all major pages
5. Target score: 95+ (aim for 100)

**Pages to Test:**
- [ ] Home (index.html)
- [ ] Projects (projects.html)
- [ ] Topics (topics.html)
- [ ] Publications (Publications.html)
- [ ] Sample project detail page
- [ ] Sample topic detail page
- [ ] Sample people detail page

### WAVE or axe DevTools
1. Install browser extension
2. Run on all major pages
3. Fix all errors
4. Review and address warnings
5. Verify alerts are intentional

**Critical Issues (Must Fix):**
- Missing alt text on informative images
- Missing form labels
- Insufficient color contrast
- Missing heading structure
- Broken ARIA implementation

**Warnings (Review):**
- Redundant links
- Suspicious alt text
- Long alt text (consider longdesc)
- Possible heading skip

## Manual Testing

### Screen Reader Test (VoiceOver/NVDA)

**Basic Navigation:**
- [ ] Page title announced correctly
- [ ] Heading navigation works (H key)
- [ ] Headings describe content accurately
- [ ] Landmark navigation works (D key)
- [ ] Links describe destination clearly

**Forms:**
- [ ] Labels announced for all inputs
- [ ] Required fields indicated
- [ ] Error messages announced
- [ ] Validation feedback is clear

**Bibliography/Publications:**
- [ ] Icon links have descriptive labels
- [ ] Search form is accessible
- [ ] Filter controls work with keyboard
- [ ] Results update announced

### Keyboard Navigation Test

**Navigation:**
- [ ] Tab through header (SCC Home link → hamburger)
- [ ] Tab through navigation menu
- [ ] Tab through main content
- [ ] Tab through footer links
- [ ] Tab through form controls (Publications page)

**Interactive Elements:**
- [ ] Hamburger menu opens/closes with Enter/Space
- [ ] Links activate with Enter
- [ ] Buttons activate with Enter/Space
- [ ] Form controls work with arrow keys

**Visual Indicators:**
- [ ] Focus visible on all elements
- [ ] Focus indicator contrasts with background
- [ ] Focus order matches visual order

### Visual/Zoom Test

**200% Zoom:**
- [ ] All text remains readable
- [ ] No content cut off
- [ ] No horizontal scrolling (except tables)
- [ ] Layout adapts appropriately

**Mobile/Responsive:**
- [ ] Content accessible at 320px width
- [ ] Touch targets large enough (44x44px)
- [ ] Navigation menu accessible
- [ ] Text remains readable

### Color Blindness Test

Use browser extension to simulate:
- [ ] Protanopia (red-blind)
- [ ] Deuteranopia (green-blind)
- [ ] Tritanopia (blue-blind)
- [ ] Achromatopsia (total color blindness)

**Verify:**
- [ ] Important information not color-only
- [ ] Links distinguishable without color
- [ ] Form errors not indicated by color alone

## Quick Reference: Common Issues

### ❌ Bad Examples

```html
<!-- Missing alt text -->
<img src="photo.jpg">

<!-- Icon link without label -->
<a href="..."><i class="fa-link"></i></a>

<!-- Generic link text -->
<a href="...">Click here</a>

<!-- Missing form label -->
<input type="text" placeholder="Name">

<!-- Poor contrast -->
<div style="color: #777; background: #fff;">Text</div>

<!-- Skipped heading -->
<h1>Title</h1>
<h3>Subtitle</h3>
```

### ✅ Good Examples

```html
<!-- Descriptive alt text -->
<img src="photo.jpg" alt="Team at AGU conference 2024">

<!-- Icon link with label -->
<a href="..." aria-label="Download PDF">
  <i class="fa-download" aria-hidden="true"></i>
</a>

<!-- Descriptive link text -->
<a href="paper.pdf">Download research paper (PDF, 2.3MB)</a>

<!-- Proper form label -->
<label for="name">Name</label>
<input type="text" id="name">

<!-- Good contrast -->
<div style="color: #000; background: #fff;">Text</div>

<!-- Proper heading hierarchy -->
<h1>Title</h1>
<h2>Subtitle</h2>
```

## Testing Tools Quick Links

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- [Accessible Color Palette Builder](https://toolness.github.io/accessible-color-matrix/)

## When to Re-test

Full accessibility testing required when:
- [ ] Adding new pages or sections
- [ ] Modifying navigation structure
- [ ] Changing color schemes or themes
- [ ] Adding interactive features (forms, menus, etc.)
- [ ] Updating CSS that affects layout or colors
- [ ] Adding third-party components or widgets

Quick spot-check required when:
- [ ] Adding images
- [ ] Adding links
- [ ] Adding text content
- [ ] Updating bibliography entries

## Questions or Issues?

If you encounter accessibility issues or have questions:
1. Review [ACCESSIBILITY.md](ACCESSIBILITY.md) for implementation details
2. Check [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
3. Contact lab director for guidance

## Notes

- This checklist is based on WCAG 2.1 Level AA standards
- Automated tools catch ~30-40% of issues; manual testing essential
- When in doubt, test with actual assistive technology
- Accessibility is ongoing, not one-time effort
- Small improvements matter - fix what you can

---

**Last Updated:** March 2026  
**Version:** 1.0
