const SITE_ORIGIN = 'https://fewshotacademy.com';
const GOOGLE_ANALYTICS_ID = 'G-51WGH2MZ08';
const GOOGLE_ANALYTICS_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

export function createAnonymousPageViewPayload(path) {
  return {
    // A fresh random client ID per page view (gh issue #88, item 4). It is
    // generated here, never stored, and never derived from the visitor's IP,
    // UA, or any cookie, so it stays non-persistent and non-identifying.
    // Unlike the old shared constant, GA4 no longer collapses all traffic
    // into a single synthetic user, but since each page view gets its own
    // ID, GA4's "users"/"sessions" metrics still don't reflect real visitor
    // continuity; only the Views/page-path/time dimensions are meaningful.
    client_id: crypto.randomUUID(),
    consent: {
      ad_user_data: 'DENIED',
      ad_personalization: 'DENIED',
    },
    events: [
      {
        name: 'page_view',
        params: {
          page_location: `${SITE_ORIGIN}${path}`,
        },
      },
    ],
  };
}

export async function deliverAnonymousPageView(path, apiSecret, fetchImpl = fetch) {
  const endpoint = new URL(GOOGLE_ANALYTICS_ENDPOINT);
  endpoint.searchParams.set('measurement_id', GOOGLE_ANALYTICS_ID);
  endpoint.searchParams.set('api_secret', apiSecret);

  return fetchImpl(endpoint, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(createAnonymousPageViewPayload(path)),
  });
}
