import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';
import styles from './Root.module.css';

const STORAGE_KEY = 'zta-disclaimer-dismissed';

function DisclaimerBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  }

  return (
    <div className={styles.banner} role="note">
      <p className={styles.text}>
        zero-to-agent is a free, open-source course, not professional advice.
        Some labs use a paid API (OpenAI or Anthropic) that bills you
        directly, at your own risk — this project never sees your key or
        your money. Content is provided as-is, with no guarantee of
        accuracy.
      </p>
      <button className={styles.button} onClick={dismiss} type="button">
        Got it
      </button>
    </div>
  );
}

export default function Root({children}: {children: ReactNode}): ReactNode {
  return (
    <>
      {children}
      <DisclaimerBanner />
    </>
  );
}
