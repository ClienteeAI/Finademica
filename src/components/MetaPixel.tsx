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
 * Works on both nasr subdomain and trade.nasrlector.com custom domain
 */
const MetaPixel = () => {
  const { client } = useClient();

  useEffect(() => {
    // Wait for client to load
    if (!client) {
      console.log('[MetaPixel] Waiting for client to load...');
      return;
    }

    // Check if this is NASR client (by subdomain OR custom domain)
    const isNasrClient = client.subdomain === 'nasr' || 
                         client.custom_domain?.includes('nasrlector');
    
    console.log('[MetaPixel] Client loaded:', client.subdomain, 'custom_domain:', client.custom_domain, 'isNasr:', isNasrClient);

    if (!isNasrClient) {
      console.log('[MetaPixel] Not NASR client, skipping pixel');
      return;
    }

    // Prevent duplicate initialization
    if (window.fbq) {
      console.log('[MetaPixel] Already initialized, tracking PageView');
      window.fbq('track', 'PageView');
      return;
    }

    console.log('[MetaPixel] Initializing Meta Pixel for NASR...');

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
    
    console.log('[MetaPixel] Pixel initialized and PageView tracked');

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
  }, [client]);

  return null;
};

export default MetaPixel;
