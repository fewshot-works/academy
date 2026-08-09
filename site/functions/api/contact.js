const CONTACT_CATEGORIES = [
  'General question',
  'Content correction',
  'Bug report',
  'Collaboration',
  'Something else',
];
const FEEDBACK_BACKGROUNDS = [
  'Student',
  'Career changer',
  'Software engineer',
  'Data scientist',
  'ML practitioner',
  'Product',
  'Other',
];
const FEEDBACK_SECTIONS = ['Foundations', 'Intermediate', 'Advanced', 'MCP', 'Other'];
const FEEDBACK_RECOMMEND = ['Yes', 'No', 'Maybe'];

async function verifyTurnstile(token, ip, secret) {
  if (!token || !secret) return false;

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const result = await response.json();
  if (result.success !== true) {
    console.error('Turnstile verification failed', JSON.stringify(result));
  }
  return result.success === true;
}

async function sendNotification(env, subject, lines) {
  try {
    await env.EMAIL_WORKER.sendNotification(subject, lines);
  } catch (err) {
    // Local dev (`wrangler pages dev`) can't reach the deployed email worker --
    // don't let that fail the whole request, the D1 row is already saved by this point.
    console.error('Failed to send notification email', err);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {'content-type': 'application/json'},
  });
}

export async function onRequestPost(context) {
  const {request, env} = context;
  const data = await request.json();

  // Honeypot: real visitors never see or fill this field, bots fill everything.
  if (data.website) {
    return jsonResponse({ok: true});
  }

  const ip = request.headers.get('cf-connecting-ip') || '';
  const captchaOk = await verifyTurnstile(data.turnstileToken, ip, env.TURNSTILE_SECRET_KEY);
  if (!captchaOk) {
    return jsonResponse({ok: false, error: 'Captcha check failed, please retry.'}, 400);
  }

  const now = new Date().toISOString();

  if (data.formType === 'contact') {
    const message = (data.message || '').trim().slice(0, 2000);
    if (!CONTACT_CATEGORIES.includes(data.category) || !message) {
      return jsonResponse({ok: false, error: 'Missing required fields.'}, 400);
    }
    const email = (data.email || '').trim().slice(0, 200);

    await env.DB.prepare(
      `INSERT INTO contact_submissions (category, message, email, created_at) VALUES (?1, ?2, ?3, ?4)`
    )
      .bind(data.category, message, email || null, now)
      .run();

    await sendNotification(env, `New contact form submission: ${data.category}`, [
      `Category: ${data.category}`,
      `Reply-to email: ${email || '(not provided)'}`,
      '',
      message,
    ]);
  } else if (data.formType === 'feedback') {
    const sections = Array.isArray(data.sections)
      ? data.sections.filter((section) => FEEDBACK_SECTIONS.includes(section))
      : [];
    const helpful = Number(data.helpful);

    if (
      !FEEDBACK_BACKGROUNDS.includes(data.background) ||
      sections.length === 0 ||
      !Number.isInteger(helpful) ||
      helpful < 1 ||
      helpful > 5 ||
      !FEEDBACK_RECOMMEND.includes(data.recommend)
    ) {
      return jsonResponse({ok: false, error: 'Missing required fields.'}, 400);
    }

    const region = (data.region || '').trim().slice(0, 100);
    const whatCouldBeBetter = (data.whatCouldBeBetter || '').trim().slice(0, 2000);
    const otherTopics = (data.otherTopics || '').trim().slice(0, 2000);
    const otherSectionDetail = (data.otherSectionDetail || '').trim().slice(0, 200);

    await env.DB.prepare(
      `INSERT INTO feedback_submissions
         (background, region, sections, other_section_detail, helpful, recommend, what_could_be_better, other_topics, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
    )
      .bind(
        data.background,
        region || null,
        sections.join(', '),
        otherSectionDetail || null,
        helpful,
        data.recommend,
        whatCouldBeBetter || null,
        otherTopics || null,
        now
      )
      .run();

    await sendNotification(env, 'New feedback submission', [
      `Background: ${data.background}`,
      `Region: ${region || '(not provided)'}`,
      `Sections completed: ${sections.join(', ')}`,
      `Other section detail: ${otherSectionDetail || '(not provided)'}`,
      `Helpful (1-5): ${helpful}`,
      `Would recommend: ${data.recommend}`,
      `What could be better: ${whatCouldBeBetter || '(not provided)'}`,
      `Other topics: ${otherTopics || '(not provided)'}`,
    ]);
  } else {
    return jsonResponse({ok: false, error: 'Unknown form type.'}, 400);
  }

  return jsonResponse({ok: true});
}
