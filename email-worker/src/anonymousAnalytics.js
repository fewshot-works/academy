const SITE_ORIGIN = 'https://fewshotacademy.com';
const GOOGLE_ANALYTICS_ID = 'G-51WGH2MZ08';
const GOOGLE_ANALYTICS_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

export function createAnonymousPageViewPayload(path) {
  return {
    // Measurement Protocol requires a client ID. Every request deliberately
    // shares this constant, so it cannot distinguish visitors or sessions.
    client_id: '731415926.271828182',
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
