import type {ClientModule} from '@docusaurus/types';
import {trackAnonymousPageView} from '@site/src/utils/analytics';

let previousPathname: string | undefined;

function isNotFoundPage(): boolean {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  return canonical ? new URL(canonical).pathname === '/404.html' : false;
}

const clientModule: ClientModule = {
  onRouteDidUpdate({location}) {
    if (location.pathname !== previousPathname) {
      previousPathname = location.pathname;
      const pathname = location.pathname;

      // Wait for React Helmet to update the canonical URL. Unknown URLs can
      // contain arbitrary text, so never put a 404 path on the analytics queue.
      setTimeout(() => {
        if (window.location.pathname === pathname && !isNotFoundPage()) {
          trackAnonymousPageView(pathname);
        }
      });
    }
  },
};

export default clientModule;
