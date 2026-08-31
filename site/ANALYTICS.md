# Engagement analytics

Few-Shot Academy sends privacy-conscious engagement events to its Google Analytics 4 property only
after a visitor selects **Allow analytics**. The site uses Basic Consent Mode: it does not load the
Google tag or transmit data to Google before that choice. GA4 stores and reports consented events.
The D1 database remains limited to aggregate page-view popularity and is not a second event store.

## Privacy boundary

Event properties are restricted by both TypeScript types and a runtime allowlist in
`src/utils/analytics.ts`.

Allowed data:

- Stable curriculum, lesson, lab, career, interview, and blog IDs
- Small controlled categories such as completion method, interview stage, and source surface

Never send:

- Quiz answers or scores
- Prompt, form, or other learner-entered text
- Email addresses or other contact information
- Local progress or quiz-storage contents
- Full URLs, query strings, fragments, or link labels
- A custom user, browser, device, or session identifier

GA4 may still use its own browser/device signals according to the site's analytics configuration
and Google's policies. Few-Shot Academy does not add an identity layer. Clearing browser data or
changing browsers/devices can therefore break continuity, just as it does for local course
progress.

The consent preference is stored in the visitor's browser under
`fewshot-academy:analytics-consent:v1`. Advertising storage, advertising user data, and advertising
personalization remain denied. Do not restore automatic Docusaurus `gtag` configuration because it
would load Google before the consent component can run.

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

For consent verification, start with a clean browser profile and confirm:

1. No request to `googletagmanager.com` or `google-analytics.com` occurs before a choice.
2. **Decline** stores the preference without loading Google or setting `_ga` cookies.
3. **Allow analytics** loads the tag and sends the initial page view.
4. **Privacy settings** in the footer reopens the controls.
5. Withdrawing consent stops future events and removes accessible `_ga` cookies.
