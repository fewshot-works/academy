const TRACKED_PREFIXES = ['/docs/', '/career-tracks/'];

const BOT_USER_AGENT_PATTERN = /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor/i;

export async function onRequest(context) {
  const {request, next, env} = context;
  const url = new URL(request.url);

  const isTracked = TRACKED_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
  const userAgent = request.headers.get('user-agent') || '';

  if (request.method === 'GET' && isTracked && !BOT_USER_AGENT_PATTERN.test(userAgent)) {
    await env.DB.prepare(
      `INSERT INTO page_views (path, count, last_viewed_at)
       VALUES (?1, 1, ?2)
       ON CONFLICT(path) DO UPDATE SET count = count + 1, last_viewed_at = ?2`
    )
      .bind(url.pathname, new Date().toISOString())
      .run();
  }

  return next();
}
