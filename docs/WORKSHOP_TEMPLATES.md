# Featured workshop templates

Open the course editor for a live workshop and choose **تصميم الورشة المميزة**. The template is available for draft workshops too; enable **ورشة مميزة** in course data to use it publicly. Recorded courses and ordinary workshops keep their course-details page.

The editor customizes the nine approved sections: introduction, client work, transformation, roadmap, reviews, instructor, guarantee, FAQ and closing call to action. Edit text and highlighted text parts, image/video URLs and image descriptions, links, captions, repeated records and accessible player labels. Sections can be hidden/reordered (the introduction stays present). Repeated items can be added, removed and moved; nested media/settings groups are collapsed to keep the form manageable. Show/hide the countdown strip and prototype signup toast independently. Prototype viewer/signup values are explicitly labelled as demo values in the editor.

The same shared, login-aware Ta3llam navbar appears on featured workshops; it is outside editable template content. The approved theme, responsive section styles, structural section IDs, icon geometry and reveal policy stay centrally controlled. This editor changes content/composition rather than accepting arbitrary HTML, scripts, CSS or new animation dependencies.

**حفظ التصميم** stores a per-workshop document; changes do not modify other workshops. Initial defaults derive from the workshop's own title, description, intro and curriculum, with the existing seven-day content retained as the approved starting template. Once saved, content is a snapshot: later course-data edits do not overwrite the custom template. Prices/payment eligibility continue to come from course/commerce records, not marketing text. Links are editable; administrators should keep purchase actions pointed at the appropriate checkout. **استعادة التصميم الافتراضي** resets the editor locally after confirmation; it takes effect only after saving.

## Persistence and access

`workshop_templates` has a course FK, JSON document, optimistic revision and update timestamp. Admin APIs authenticate and authorize each request, enforce same-origin mutations, and reject stale revisions. RLS permits published featured content reads, keeps drafts private, and restricts writes to current admins for live workshops. The table cascades with course deletion. Document validation rejects unsafe URLs, injected section attributes, arbitrary shapes, invalid timing values and excessive depth/size/items. Template requests alone have a bounded 128 KiB body cap; documents have a 96 KiB limit, leaving serialization headroom. Existing API limits remain in place.

Drive hero/reel links use a dedicated public marketing-media route that resolves only stored, validated clip identifiers for published featured workshops; it accepts no arbitrary upstream URL. YouTube and existing direct/local sources continue through the shared custom player. This does not expose private lesson endpoints or download/rehost videos.

## Verification

Run `BACKEND_SUITE=workshop-template npm run backend:test` with isolated local Supabase and the browser runtime libraries. It checks guest/student rejection, cross-origin denial, persisted edits, optimistic conflicts, published section visibility/order, unsafe input rejection, RLS draft protection, real browser saves/reloads, single shared navbar and 320/390/768/1440px editor layouts. Run `BACKEND_SUITE=course-details npm run backend:test` for existing details/featured-selection regressions, plus security unit tests, lint, architecture and production build. Screenshots in `docs/evidence/workshop-template` use reduced motion so all content is visible in full-page captures.
