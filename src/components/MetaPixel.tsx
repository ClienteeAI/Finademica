import { useEffect } from 'react';
import { useClient } from '@/lib/clientContext';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

/**
 * Meta (Facebook) Pixel - Only loads for NASR client
 */
const MetaPixel = () => {
  const { client } = useClient();

  useEffect(() => {
    // Only load for NASR client
    if (client?.subdomain !== 'nasr') return;

    // Prevent duplicate initialization
    if (window.fbq) return;

    // Initialize fbq
    const fbq = function(...args: unknown[]) {
      if ((fbq as any).callMethod) {
        (fbq as any).callMethod.apply(fbq, args);
      } else {
        (fbq as any).queue.push(args);
      }
    } as any;

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];

    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;

    // Load the FB pixel script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    // Initialize pixel with NASR's ID and track PageView
    window.fbq('init', '1385265819744408');
    window.fbq('track', 'PageView');

    // Add noscript fallback image
    const noscriptImg = document.createElement('img');
    noscriptImg.height = 1;
    noscriptImg.width = 1;
    noscriptImg.style.display = 'none';
    noscriptImg.src = 'https://www.facebook.com/tr?id=1385265819744408&ev=PageView&noscript=1';
    document.body.appendChild(noscriptImg);

    return () => {
      // Cleanup noscript image on unmount
      if (noscriptImg.parentNode) {
        noscriptImg.parentNode.removeChild(noscriptImg);
      }
    };
  }, [client?.subdomain]);

  return null;
};

export default MetaPixel;
