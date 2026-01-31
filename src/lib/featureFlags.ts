/**
 * Feature flags for the application.
 * 
 * HIDE_TRADING_CTAS: When true, hides all CTAs related to:
 * - Opening live trading accounts
 * - Trade now buttons
 * - Broker-related promotions
 * - Links to external trading platforms (e.g., nasrtrade.com)
 * 
 * This is used for App Store compliance to show the app is educational,
 * not a broker application.
 * 
 * NOTE: NASR client shows CTAs, all other clients hide them.
 */

// Static flag for backwards compatibility (default: hide CTAs)
export const HIDE_TRADING_CTAS = true;

/**
 * Dynamic function to check if trading CTAs should be hidden
 * based on the current client subdomain.
 * 
 * @param clientSubdomain - The subdomain of the current client
 * @returns true if CTAs should be hidden, false if they should be shown
 */
export function shouldHideTradingCTAs(clientSubdomain: string | undefined | null): boolean {
  // NASR client shows CTAs (return false = don't hide)
  if (clientSubdomain === 'nasr') {
    return false;
  }
  // All other clients hide CTAs
  return true;
}
