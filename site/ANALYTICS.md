# Analytics

Few-Shot Academy separates page counts from optional engagement analytics:

- Every route view sends its normalized page path to a first-party Cloudflare Function. The
  function puts only that path on a Cloudflare Queue. A detached queue consumer forwards a
  `page_view` to Google Analytics 4 with one shared client ID. The visitor request and its IP
  address, user agent, referrer, cookies, query string, fragment, and browser/device properties do
  not enter the queue or the Google request. Unknown and 404 paths are not counted.
- After a visitor selects **Allow analytics**, the browser loads the Google tag and sends the
  allowlisted engagement events below. The site uses Basic Consent Mode for these optional events:
  the tag does not load before consent or after a visitor declines.

The D1 database remains limited to aggregate page-view popularity and is not a second event store.

## Privacy boundary

Optional event properties are restricted by both TypeScript types and a runtime allowlist in
`src/utils/analytics.ts`. The page-view producer is separately restricted in
`functions/api/anonymous-page-view.js`; its detached consumer lives in
`../email-worker/src/anonymousAnalytics.js`.

Allowed data:

- Stable curriculum, lesson, lab, career, interview, and blog IDs
- Small controlled categories such as completion method, interview stage, and source surface

Never send:

- Quiz answers or scores
- Prompt, form, or other learner-entered text
- Email addresses or other contact information
- Local progress or quiz-storage contents
- Full URLs, query strings, fragments, or link labels
- A custom visitor, browser, device, or session identifier

GA4 may still use its own browser/device signals according to the site's analytics configuration
and Google's policies after a visitor allows optional analytics. Few-Shot Academy does not add an
identity layer. Clearing browser data or changing browsers/devices can therefore break continuity,
just as it does for local course progress.

The anonymous page-view relay is intentionally unsuitable for users, sessions, acquisition,
location, demographics, or device reports. Its fixed `731415926.271828182` client ID means GA4
cannot distinguish one visitor from another. Use only the `Views` event count, page path, and time
dimensions for this stream of events. Google may derive attributes from Cloudflare's outbound
queue-consumer request; those attributes describe the worker, not the visitor, and should be
ignored.

The consent preference is stored in the visitor's browser under
`fewshot-academy:analytics-consent:v1`. Advertising storage, advertising user data, and advertising
personalization remain denied. Do not restore automatic Docusaurus `gtag` configuration because it
would load Google before the consent component can run.

## One-time page-view relay setup

Deploying the Pages project does not create the queue, add the Google secret, or deploy the
consumer worker. Complete the one-time resource setup and deploy both projects explicitly.

The producer fails closed when its queue binding is absent: the browser receives `204`, but nothing
is queued. The consumer retries delivery failures up to three times. To enable the complete path:

1. Create the queue once from either project directory:

   ```console
   npx wrangler queues create fewshot-anonymous-page-views
   ```

2. In GA4, open **Admin > Data streams**, select the `G-51WGH2MZ08` web stream, open
   **Measurement Protocol API secrets**, and create a secret named `anonymous-page-views`.
3. In that web stream, open **Enhanced measurement > Page views > Show advanced settings** and
   turn off **Page changes based on browser history events**. The code disables tag-load page
   views; this setting prevents consented SPA navigation from creating duplicates.
4. Add `GA4_MEASUREMENT_PROTOCOL_API_SECRET` to `fewshot-email-worker`, not the Pages project:

   ```console
   cd email-worker
   npx wrangler secret put GA4_MEASUREMENT_PROTOCOL_API_SECRET
   ```

5. Deploy `fewshot-email-worker`, then deploy the Pages site so both queue bindings become active.
6. Open a few routes and verify the `page_view` event count after GA4 processes it. Do not
   use Realtime user counts to validate the relay because the payload intentionally has no session.

## Event taxonomy

| Event | Fires when | Properties |
| --- | --- | --- |
| `course_start` | A learner intentionally enters a track's first lesson from the homepage or track overview | `track_id`, `source_surface` |
| `lesson_complete` | A lesson first changes from incomplete to complete | `track_id`, `lesson_id`, `completion_method` |
| `next_lesson_click` | A learner uses the next-lesson paginator from a tracked lesson | `track_id`, `lesson_id`, optional `destination_lesson_id` |
| `quiz_submit` | A learner submits a quiz, not when a stored result is restored | `content_id` |
| `lab_link_click` | A learner follows an official repository lab link from documentation | `content_id`, `lab_id` |
| `continue_learning_click` | A learner uses the homepage resume action | `track_id`, `lesson_id` |
| `career_to_curriculum_click` | A role guide sends a learner to curriculum content | `career_id`, `destination_id` |
| `career_to_interview_click` | A role guide sends a learner to its interview preparation | `career_id`, `destination_id`, `interview_stage` |
| `blog_to_lesson_click` | An individual blog post sends a reader to documentation | `post_id`, `destination_id` |
| `subscribe_click` | Reserved for the future subscription feature | `source_surface` |
| `subscribe_success` | Reserved for a confirmed future subscription | `source_surface` |

`subscribe_click` and `subscribe_success` have a contract but no current emitter. Do not fire a
success event until a subscription provider confirms acceptance.

## One-time GA4 setup

Custom events are sent immediately through `gtag`. They can be inspected in Realtime and, when
debug mode is enabled, DebugView. To use the properties in standard reports and explorations,
register these as **event-scoped custom dimensions** in **Admin > Data display > Custom
definitions**:

- `track_id`
- `source_surface`
- `lesson_id`
- `completion_method`
- `destination_lesson_id`
- `content_id`
- `lab_id`
- `career_id`
- `destination_id`
- `interview_stage`
- `post_id`

Use the event parameter name exactly as written. Register each parameter once for the property,
not separately per event. Google says new custom dimensions can take 24–48 hours to become
available in reports, so register them before evaluating a release.

Official references:

- [Measurement Protocol reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference)
- [GA4 page-view controls](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Cloudflare Queue bindings for Pages Functions](https://developers.cloudflare.com/pages/functions/bindings/#queue-producers)
- [Set up GA4 events](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 custom dimensions and metrics](https://support.google.com/analytics/answer/14240153)
- [GA4 retention overview](https://support.google.com/analytics/answer/11004084)

## Reporting definitions

Use **users**, not raw event totals, when duplicate clicks would distort the result.

### 7-day and 28-day retention

Use **Reports > Life cycle > Retention** and read the cohort retention values at day 7 and day
28. Also compare New users and Returning users over matching 7-day and 28-day date ranges. These
are GA4 browser/device-based measures, not signed-in learner retention.

### Curriculum progression

Create a funnel exploration with:

1. `course_start`
2. `lesson_complete`
3. Additional `lesson_complete` events as needed for milestone lessons

Break down by `track_id`. Use `lesson_id` and `next_lesson_click` in a free-form exploration to
locate chapters with unusually high exits.

### Quiz and lab engagement

- Quiz participation: users with `quiz_submit`, broken down by `content_id`
- Lab intent: users with `lab_link_click`, broken down by `content_id` and `lab_id`
- Quiz-to-lab relationship: a funnel from `quiz_submit` to `lab_link_click`, or the reverse when
  the lesson presents the lab first

These events measure interaction, not whether a learner successfully ran a lab.

### Cross-surface conversion

- Career guide to curriculum: users with `career_to_curriculum_click`, by `career_id`
- Career guide to interview prep: users with `career_to_interview_click`, by `career_id` and
  `interview_stage`
- Blog to curriculum: users with `blog_to_lesson_click`, by `post_id` and `destination_id`
- Resume usage: users with `continue_learning_click`, followed by `lesson_complete`

## Local verification

GA4 is allowed to be unavailable during local development. Engagement events also require a saved
`granted` preference. In browser developer tools, grant analytics through the banner, then install
a temporary stub before clicking a tracked control:

```js
window.capturedEvents = [];
window.gtag = (...args) => window.capturedEvents.push(args);
```

Inspect `window.capturedEvents` after the interaction. Each intended interaction should add one
event with only the documented properties. Reloading a page or restoring a saved quiz must not
create an engagement event.

For page-view and consent verification, start with a clean browser profile and confirm:

1. The choice opens as a modal and keyboard focus cannot leave it until **Decline** or
   **Allow analytics** is selected.
2. A route view sends `POST /api/anonymous-page-view` with only a `path` field. It does not load a
   Google script in the browser. The Pages Function queues only that path; only the detached queue
   consumer contacts Google.
3. **Decline** stores the preference without loading Google or setting `_ga` cookies. Anonymous
   route counts continue through the first-party endpoint.
4. **Allow analytics** loads the tag for allowlisted engagement events. The tag configuration has
   automatic page views and Google signals disabled; it also replaces page location with the site
   origin and drops the referrer. This prevents duplicate page tracking and keeps query strings and
   traffic sources out of optional event requests.
5. **Privacy settings** in the footer reopens the modal. Withdrawing consent stops future optional
   events and removes accessible `_ga` cookies.
