import {useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './contact.module.css';

// Public Turnstile site key -- safe to hardcode, get it from
// Cloudflare dashboard > Turnstile > Add Site once the widget exists.
const TURNSTILE_SITE_KEY = '0x4AAAAAAEK1uD08v_lhnySp';

type FormType = 'contact' | 'feedback';
type Status = 'idle' | 'submitting' | 'success' | 'error';

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
const FEEDBACK_REGIONS = ['North America', 'Europe', 'Asia', 'South America', 'Other'];
const FEEDBACK_SECTIONS = ['Foundations', 'Intermediate', 'Advanced', 'MCP', 'Other'];
const FEEDBACK_RECOMMEND = ['Yes', 'No', 'Maybe'];

export default function Contact(): ReactNode {
  const [formType, setFormType] = useState<FormType>('contact');

  const [category, setCategory] = useState(CONTACT_CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const [background, setBackground] = useState('');
  const [region, setRegion] = useState('');
  const [sections, setSections] = useState<string[]>([]);
  const [otherSectionDetail, setOtherSectionDetail] = useState('');
  const [helpful, setHelpful] = useState('');
  const [recommend, setRecommend] = useState('');
  const [whatCouldBeBetter, setWhatCouldBeBetter] = useState('');
  const [otherTopics, setOtherTopics] = useState('');

  const [website, setWebsite] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | undefined>(undefined);

  // Explicit rendering instead of the auto-render div+script approach --
  // auto-render depends on the script's own DOM scan timing, which is
  // unreliable across React re-renders and client-side route changes.
  useEffect(() => {
    let cancelled = false;
    const interval = setInterval(() => {
      const turnstile = (window as any).turnstile;
      if (!turnstile || !turnstileRef.current || cancelled) return;
      clearInterval(interval);
      turnstileWidgetId.current = turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    }, 100);

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (turnstileWidgetId.current !== undefined && (window as any).turnstile) {
        (window as any).turnstile.remove(turnstileWidgetId.current);
      }
    };
  }, []);

  function toggleSection(section: string) {
    setSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!turnstileToken) {
      setStatus('error');
      setErrorMessage('Please complete the captcha check.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const payload =
      formType === 'contact'
        ? {formType, category, message, email, website, turnstileToken}
        : {
            formType,
            background,
            region,
            sections,
            otherSectionDetail,
            helpful: Number(helpful),
            recommend,
            whatCouldBeBetter,
            otherTopics,
            website,
            turnstileToken,
          };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Something went wrong.');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
      setTurnstileToken('');
      if (turnstileWidgetId.current !== undefined && (window as any).turnstile) {
        (window as any).turnstile.reset(turnstileWidgetId.current);
      }
    }
  }

  if (status === 'success') {
    return (
      <Layout title="Contact us" description="Get in touch with Few-Shot Academy.">
        <main className={styles.main}>
          <h1>Thanks!</h1>
          <p>
            {formType === 'contact'
              ? "We've got your message and will get back to you if you left an email."
              : "Thanks for the feedback — it genuinely shapes what we build next."}
          </p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Contact us" description="Get in touch with Few-Shot Academy.">
      <Head>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer />
      </Head>
      <main className={styles.main}>
        <h1>Contact us</h1>
        <p>Have a question, found a bug, or want to share feedback on the curriculum? Pick one below.</p>

        <div className={styles.typeSwitch} role="radiogroup" aria-label="What is this about">
          <label className={styles.typeOption}>
            <input
              type="radio"
              name="formType"
              value="contact"
              checked={formType === 'contact'}
              onChange={() => setFormType('contact')}
            />
            Contact us
          </label>
          <label className={styles.typeOption}>
            <input
              type="radio"
              name="formType"
              value="feedback"
              checked={formType === 'feedback'}
              onChange={() => setFormType('feedback')}
            />
            Share feedback
          </label>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className={styles.honeypot}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {formType === 'contact' ? (
            <>
              <label className={styles.field}>
                What's this about?
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  {CONTACT_CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                Your message
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} required />
              </label>

              <label className={styles.field}>
                Email (optional — leave blank if you don't need a reply)
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </>
          ) : (
            <>
              <label className={styles.field}>
                What's your background?
                <select value={background} onChange={(e) => setBackground(e.target.value)} required>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {FEEDBACK_BACKGROUNDS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                Roughly where are you? (optional)
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="">Prefer not to say</option>
                  {FEEDBACK_REGIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className={styles.field}>
                <legend>Which section(s) did you complete?</legend>
                {FEEDBACK_SECTIONS.map((option) => (
                  <label key={option} className={styles.checkboxOption}>
                    <input
                      type="checkbox"
                      checked={sections.includes(option)}
                      onChange={() => toggleSection(option)}
                    />
                    {option}
                  </label>
                ))}
              </fieldset>

              {sections.includes('Other') && (
                <label className={styles.field}>
                  What else? (blog post, advanced topics, etc.)
                  <input
                    type="text"
                    value={otherSectionDetail}
                    onChange={(e) => setOtherSectionDetail(e.target.value)}
                  />
                </label>
              )}

              <fieldset className={styles.field}>
                <legend>Was this helpful? (1 = not really, 5 = extremely)</legend>
                <div className={styles.scale}>
                  {['1', '2', '3', '4', '5'].map((option) => (
                    <label key={option} className={styles.scaleOption}>
                      <input
                        type="radio"
                        name="helpful"
                        value={option}
                        checked={helpful === option}
                        onChange={() => setHelpful(option)}
                        required
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className={styles.field}>
                <legend>Would you recommend it?</legend>
                {FEEDBACK_RECOMMEND.map((option) => (
                  <label key={option} className={styles.checkboxOption}>
                    <input
                      type="radio"
                      name="recommend"
                      value={option}
                      checked={recommend === option}
                      onChange={() => setRecommend(option)}
                      required
                    />
                    {option}
                  </label>
                ))}
              </fieldset>

              <label className={styles.field}>
                What could be better? (optional)
                <textarea value={whatCouldBeBetter} onChange={(e) => setWhatCouldBeBetter(e.target.value)} rows={4} />
              </label>

              <label className={styles.field}>
                Any other topic you want us to cover? (optional)
                <textarea value={otherTopics} onChange={(e) => setOtherTopics(e.target.value)} rows={4} />
              </label>
            </>
          )}

          <div className={styles.field}>
            <div ref={turnstileRef} />
          </div>

          {status === 'error' && <p className={styles.error}>{errorMessage}</p>}

          <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Submit'}
          </button>
        </form>
      </main>
    </Layout>
  );
}
