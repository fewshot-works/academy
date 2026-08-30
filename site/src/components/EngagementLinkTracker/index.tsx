import type {ReactNode} from 'react';
import {useEffect} from 'react';
import {CURRICULUM_TRACKS} from '@site/src/data/curriculum';
import {classifyEngagementLink} from '@site/src/utils/analyticsLinks';
import {trackEngagementEvent} from '@site/src/utils/analytics';

export default function EngagementLinkTracker(): ReactNode {
  useEffect(() => {
    function trackLinkClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link || !link.closest('main')) {
        return;
      }

      const events = classifyEngagementLink({
        sourcePath: window.location.pathname,
        destinationHref: link.href,
        siteOrigin: window.location.origin,
        curriculumTracks: CURRICULUM_TRACKS,
      });

      for (const engagementEvent of events) {
        trackEngagementEvent(engagementEvent.name, engagementEvent.properties);
      }
    }

    document.addEventListener('click', trackLinkClick, true);
    return () => document.removeEventListener('click', trackLinkClick, true);
  }, []);

  return null;
}
