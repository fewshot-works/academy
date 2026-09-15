import type {ReactNode} from 'react';
import {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
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
  const {pathname} = useLocation();
  const [preference, setPreference] = useState<AnalyticsConsent | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

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

  const shouldOpen = hydrated && (settingsOpen || (preference === null && pathname !== '/privacy'));

  // Non-blocking: the bar never traps focus or locks scroll (gh issue #88, item 3), so a
  // first-time visitor can keep reading/browsing before deciding. Auto-focus only when the
  // visitor deliberately reopened it (Privacy settings link/hash), not on its first appearance.
  useEffect(() => {
    if (shouldOpen && settingsOpen) {
      barRef.current?.querySelector<HTMLButtonElement>('[data-initial-focus]')?.focus();
    }
  }, [shouldOpen, settingsOpen]);

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

  if (!shouldOpen) {
    return null;
  }

  return (
    <div
      className={styles.bar}
      ref={barRef}
      role="region"
      aria-labelledby="privacy-choice-title"
      aria-describedby="privacy-choice-description">
      <div className={styles.barContent}>
        <div className={styles.info}>
          <div className={styles.headingRow}>
            <h2 id="privacy-choice-title" className={styles.title}>Optional analytics</h2>
            {settingsOpen && preference !== null && (
              <button className={styles.closeButton} onClick={closeSettings} type="button" aria-label="Close privacy settings">
                Close
              </button>
            )}
          </div>
          <p id="privacy-choice-description" className={styles.text}>
            We count page opens without cookies or visitor identifiers. Allowing optional Google Analytics also
            helps us understand course progress and navigation. We never send quiz answers, scores, or contact
            messages. <Link to="/privacy">Privacy details</Link>.
          </p>
          {settingsOpen && preference !== null && (
            <p className={styles.status}>
              Analytics is currently {preference === 'granted' ? 'allowed' : 'declined'}.
            </p>
          )}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.choiceButton}
            data-initial-focus
            onClick={() => choose('denied')}
            type="button">
            Decline
          </button>
          <button className={styles.choiceButton} onClick={() => choose('granted')} type="button">
            Allow analytics
          </button>
        </div>
      </div>
    </div>
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
