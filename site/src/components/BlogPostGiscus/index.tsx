import type {ReactNode} from 'react';
import Giscus from '@giscus/react';
import {useColorMode} from '@docusaurus/theme-common';

// GitHub Discussions-backed comments (see gh issue #42). Repo/category IDs
// come from https://giscus.app once the giscus GitHub App is installed on
// fewshot-works/academy and Discussions is enabled.
export default function BlogPostGiscus(): ReactNode {
  const {colorMode} = useColorMode();

  return (
    <Giscus
      id="comments"
      repo="fewshot-works/academy"
      repoId="R_kgDOTi8uVA"
      category="Announcements"
      categoryId="DIC_kwDOTi8uVM4DCxo0"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={colorMode === 'dark' ? 'dark' : 'light'}
      lang="en"
      loading="lazy"
    />
  );
}
