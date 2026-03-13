# JabRef Bibliography Templates

This directory contains custom layout templates for exporting BibTeX entries to HTML with proper accessibility features.

## Purpose

These templates are used by JabRef to generate accessible HTML for bibliography entries that appear on the website. The templates include:
- ARIA labels for icon-only links
- Proper semantic HTML structure  
- Screen reader-friendly link descriptions

## Files

- `sccList.begin.layout` - HTML wrapper that starts the bibliography list
- `sccList.end.layout` - HTML wrapper that closes the bibliography list
- `sccList.layout` - Default template for all entry types
- `sccList.article.layout` - Template for journal articles
- `sccList.book.layout` - Template for books
- `sccList.incollection.layout` - Template for book chapters
- `sccList.techreport.layout` - Template for technical reports

## Accessibility Features

All templates include:

1. **Descriptive ARIA labels** on icon links:
   ```html
   <a href="..." aria-label="DOI">
     <i class="ai ai-doi" aria-hidden="true"></i>
   </a>
   ```

2. **Hidden decorative icons** from screen readers:
   ```html
   <i class="..." aria-hidden="true"></i>
   ```

3. **Accessible link types:**
   - DOI links: "DOI" 
   - URL links: "Publisher website" or "Project website"
   - Preprint links: "Preprint PDF"
   - Corrigendum links: "Corrigendum"
   - Code links: "Code repository"

## When to Regenerate

You must regenerate the bibliography HTML after:
- Adding new publications to your BibTeX file
- Modifying these layout templates
- Updating publication metadata (DOI, URLs, etc.)

## How to Regenerate

### Step 1: Export from JabRef

1. Open your BibTeX file in JabRef
2. Select all entries (or specific entries to update)
3. Go to **File → Export...**
4. Choose **Custom export filter**
5. Select the appropriate sccList layout file:
   - For full bibliography: `sccList.layout`
   - For specific types: use the corresponding layout file
6. Save to the appropriate location in `_site/` or as an HTML include

### Step 2: Rebuild Jekyll Site

After exporting new HTML from JabRef:

```bash
# From the website root directory
bundle exec jekyll build
```

This will incorporate the updated bibliography HTML into the site.

### Step 3: Verify Accessibility

After regenerating:
- [ ] Check that icon links have aria-label attributes
- [ ] Verify icons have aria-hidden="true"
- [ ] Test with screen reader to confirm link descriptions
- [ ] Validate HTML structure

## Template Modifications

If you modify these templates:

1. **Always include accessibility attributes:**
   - `aria-label` on icon-only links
   - `aria-hidden="true"` on decorative icons

2. **Test with screen reader:**
   - Generate sample output
   - Verify link announcements are clear
   - Make sure icon fonts don't announce gibberish

3. **Maintain semantic HTML:**
   - Use proper list structure (`<ul>`, `<li>`)
   - Use semantic tags (`<article>`, `<cite>`, etc.)
   - Don't use `<div>` where semantic alternatives exist

4. **Document changes:**
   - Update this README if adding new features
   - Update ACCESSIBILITY.md if changing behavior
   - Note in version control commit messages

## Common Issues

### Issue: Links have no accessible names
**Cause:** Missing `aria-label` attribute  
**Fix:** Add `aria-label="Description"` to the `<a>` tag

### Issue: Screen reader announces icon font characters
**Cause:** Missing `aria-hidden="true"` on icon  
**Fix:** Add `aria-hidden="true"` to the `<i>` tag

### Issue: Changes not reflected on site
**Cause:** Forgot to rebuild Jekyll after export  
**Fix:** Run `bundle exec jekyll build`

### Issue: Old HTML still showing
**Cause:** Jekyll cached previous version  
**Fix:** Run `bundle exec jekyll clean` then rebuild

## Integration with Website

The generated HTML is included in pages using:
```liquid
{% include scc.html %}
```

This include processes the JabRef-generated HTML and applies additional styling/filtering via JavaScript for the Publications page search functionality.

## Version History

- **v1.1** (March 2026) - Added accessibility features
  - Added aria-label to all icon links
  - Added aria-hidden to decorative icons
  - Improved link descriptions for screen readers

- **v1.0** (Original) - Initial templates
  - Basic HTML structure
  - Icon font links for DOI, URL, etc.

## Resources

- [JabRef Custom Export Documentation](https://docs.jabref.org/import-export/export/customexports)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Website Accessibility Documentation](../ACCESSIBILITY.md)

## Questions?

For questions about these templates or bibliography accessibility:
- Review [ACCESSIBILITY.md](../ACCESSIBILITY.md) in the root directory
- Contact lab director: rkamalapurkar@ufl.edu

---

**Last Updated:** March 2026
