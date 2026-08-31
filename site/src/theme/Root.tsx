import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import EngagementLinkTracker from '@site/src/components/EngagementLinkTracker';
import {
  ANALYTICS_SETTINGS_HASH,
  disableGoogleAnalytics,
  initializeGoogleAnalytics,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  type AnalyticsConsent,
} from '@site/src/utils/analytics';
import styles from './Root.module.css';

function clearSettingsHash() {
  if (window.location.hash === ANALYTICS_SETTINGS_HASH) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
}

function PrivacyConsentBanner() {
  const [preference, setPreference] = useState<AnalyticsConsent | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const savedPreference = readAnalyticsConsent();
    setPreference(savedPreference);
    setHydrated(true);

    if (savedPreference === 'granted') {
      initializeGoogleAnalytics();
    }

    function openSettingsFromHash() {
      if (window.location.hash === ANALYTICS_SETTINGS_HASH) {
        setSettingsOpen(true);
      }
    }

    function openSettingsFromLink(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest('a') : null;
      if (target?.getAttribute('href')?.endsWith(`/privacy${ANALYTICS_SETTINGS_HASH}`)) {
        setSettingsOpen(true);
      }
    }

    openSettingsFromHash();
    window.addEventListener('hashchange', openSettingsFromHash);
    document.addEventListener('click', openSettingsFromLink);
    return () => {
      window.removeEventListener('hashchange', openSettingsFromHash);
      document.removeEventListener('click', openSettingsFromLink);
    };
  }, []);

  if (!hydrated || (preference !== null && !settingsOpen)) {
    return null;
  }

  function choose(nextPreference: AnalyticsConsent) {
    saveAnalyticsConsent(nextPreference);
    setPreference(nextPreference);
    setSettingsOpen(false);

    if (nextPreference === 'granted') {
      initializeGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }
    clearSettingsHash();
  }

  function closeSettings() {
    setSettingsOpen(false);
    clearSettingsHash();
  }

  return (
    <section className={styles.banner} role="region" aria-labelledby="privacy-choice-title">
      <div className={styles.copy}>
        <div className={styles.headingRow}>
          <h2 id="privacy-choice-title" className={styles.title}>Optional analytics</h2>
          {settingsOpen && preference !== null && (
            <button className={styles.closeButton} onClick={closeSettings} type="button" aria-label="Close privacy settings">
              Close
            </button>
          )}
        </div>
        <p className={styles.text}>
          Help us improve the curriculum by allowing Google Analytics. It records page visits and selected course
          interactions. We do not send quiz answers, scores, or contact messages.{' '}
          <Link to="/privacy">Privacy details</Link>.
        </p>
        {settingsOpen && preference !== null && (
          <p className={styles.status}>
            Analytics is currently {preference === 'granted' ? 'allowed' : 'declined'}.
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <button className={styles.choiceButton} onClick={() => choose('denied')} type="button">
          Decline
        </button>
        <button className={styles.choiceButton} onClick={() => choose('granted')} type="button">
          Allow analytics
        </button>
      </div>
    </section>
  );
}

export default function Root({children}: {children: ReactNode}): ReactNode {
  return (
    <>
      <EngagementLinkTracker />
      {children}
      <PrivacyConsentBanner />
    </>
  );
}
