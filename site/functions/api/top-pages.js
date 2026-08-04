export async function onRequestGet(context) {
  const {request, env} = context;
  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get('limit'));
  const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : 5;

  const {results} = await env.DB.prepare(
    'SELECT path, count FROM page_views ORDER BY count DESC LIMIT ?1'
  )
    .bind(limit)
    .all();

  return new Response(JSON.stringify(results), {
    headers: {'content-type': 'application/json'},
  });
}
