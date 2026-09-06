const SITE_ORIGIN = 'https://fewshotacademy.com';

const RESPONSE_HEADERS = {
  'cache-control': 'no-store',
};

export function normalizePagePath(value) {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > 300 ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('?') ||
    value.includes('#') ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return null;
  }

  try {
    const url = new URL(value, SITE_ORIGIN);
    return url.origin === SITE_ORIGIN ? url.pathname : null;
  } catch {
    return null;
  }
}

export async function onRequestPost(context) {
  const {request, env} = context;
  const requestUrl = new URL(request.url);
  const requestOrigin = request.headers.get('origin');

  if (requestOrigin && requestOrigin !== requestUrl.origin) {
    return new Response(null, {status: 403, headers: RESPONSE_HEADERS});
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return new Response(null, {status: 400, headers: RESPONSE_HEADERS});
  }

  const path = normalizePagePath(input?.path);
  if (!path) {
    return new Response(null, {status: 400, headers: RESPONSE_HEADERS});
  }

  if (!env.ANONYMOUS_PAGE_VIEWS) {
    return new Response(null, {status: 204, headers: RESPONSE_HEADERS});
  }

  const delivery = env.ANONYMOUS_PAGE_VIEWS.send({path}).catch(() => {
    // Analytics must never affect the website response.
  });

  context.waitUntil(delivery);
  return new Response(null, {status: 204, headers: RESPONSE_HEADERS});
}
