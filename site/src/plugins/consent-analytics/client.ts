import type {ClientModule} from '@docusaurus/types';
import {trackAnalyticsPageView} from '@site/src/utils/analytics';

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (previousLocation && location.pathname !== previousLocation.pathname) {
      // Helmet updates the document title on the next tick.
      setTimeout(() => trackAnalyticsPageView(location.pathname));
    }
  },
};

export default clientModule;
