import { analyticsCode, isProduction } from 'src/constants';

/* tslint:disable */
const gaInit = (i: any, s: any, o: any, g: any, r: any, a: any, m: any) => {
  const currdate: any = new Date();
  i['GoogleAnalyticsObject'] = r;
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * currdate);
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
};
/* tslint:enable */

/**
 * Initiates Google Analytics Tracking Script.
 * Should be called when the app loads
 *
 * @param gaId Your Google Analytics Tracking ID
 * @param production current environment of the app
 */
export const initAnalytics = () => {
  if (!isProduction && !analyticsCode) {
    return;
  }

  const url = isProduction
    ? 'https://www.google-analytics.com/analytics.js'
    : 'https://www.google-analytics.com/analytics_debug.js';

  gaInit(window, document, 'script', url, 'ga', {}, {});

  (window as any).ga('create', analyticsCode, 'auto');
  (window as any).ga('send', 'pageview');
};
