import {useState, type ReactNode} from 'react';
import Giscus from '@giscus/react';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';
import styles from './styles.module.css';

// GitHub Discussions-backed comments (see gh issue #42, moved to a
// comments-only public repo per gh issue #94). Repo/category IDs come from
// https://giscus.app once the giscus GitHub App is installed on
// fewshot-works/public-discuss and Discussions is enabled there.
export default function BlogPostGiscus(): ReactNode {
  const {colorMode} = useColorMode();
  const [loaded, setLoaded] = useState(false);

  return (
    <section className={styles.comments} aria-labelledby="comments-title">
      <h2 id="comments-title">Comments</h2>
      {!loaded ? (
        <div className={styles.loadComments}>
          <p>
            Comments are provided by Giscus and GitHub. Loading them connects your browser to GitHub, and GitHub's
            privacy terms apply.
          </p>
          <div className={styles.actions}>
            <button type="button" onClick={() => setLoaded(true)} className={styles.loadButton}>
              Load GitHub comments
            </button>
            <Link to="/privacy#github-comments">Privacy details</Link>
          </div>
        </div>
      ) : (
        <Giscus
          id="comments"
          repo="fewshot-works/public-discuss"
          repoId="R_kgDOUbNDJA"
          category="General"
          categoryId="DIC_kwDOUbNDJM4DFn_F"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={colorMode === 'dark' ? 'dark' : 'light'}
          lang="en"
          loading="lazy"
        />
      )}
    </section>
  );
}
