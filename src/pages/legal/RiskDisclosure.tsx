import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClient } from "@/lib/clientContext";

const RiskDisclosure = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === 'nasr';

  return (
    <div className={`min-h-screen ${isNasrTheme ? 'bg-nasr-background' : 'bg-gradient-to-br from-deep via-ocean to-ocean-deep'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${isNasrTheme ? 'bg-nasr-background/95' : 'bg-deep/95'} backdrop-blur-lg border-b ${isNasrTheme ? 'border-gold/20' : 'border-ice/20'}`}>
        <div className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className={`h-10 w-10 ${isNasrTheme ? 'text-nasr-text hover:bg-gold/10' : 'text-ocean hover:bg-aqua/10'}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className={`text-lg md:text-xl font-semibold ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>
            Risk Disclosure
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 md:px-6 md:py-8 max-w-3xl mx-auto">
        <div className={`prose prose-sm md:prose-base max-w-none ${isNasrTheme ? 'prose-invert' : 'prose-invert'}`}>
          <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
            Last updated: 9.1.2026
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>1. General Risk Warning</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            Trading and investing in financial markets involves significant risk and may result in the loss of part or all of your capital. Past performance does not guarantee future results.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>2. Educational Purpose Only</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            Finademica is an educational platform. All content, tools, AI-generated explanations, and materials are provided for learning purposes only and do not constitute financial advice or investment recommendations.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>3. No Guarantees</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>There are no guarantees of:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>profitability</li>
            <li>trading success</li>
            <li>income or performance</li>
          </ul>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            Examples and simulations are illustrative only.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>4. AI-Generated Content Risk</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>AI-generated insights:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>may be inaccurate or outdated</li>
            <li>do not consider your personal financial situation</li>
            <li>must not be relied upon for real-world trading decisions</li>
          </ul>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>5. Market Volatility</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            Financial markets are volatile and unpredictable. Sudden price movements may result in rapid losses.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>6. Leverage & Complex Instruments</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            Leveraged products and derivatives involve high risk and may result in losses exceeding the initial investment. Educational discussion does not imply suitability.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>7. Personal Responsibility</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>You are solely responsible for:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>evaluating risks</li>
            <li>making trading or investment decisions</li>
            <li>complying with local laws and regulations</li>
          </ul>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>8. Limitation of Liability</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            To the maximum extent permitted by law, the platform operator is not liable for losses or damages arising from the use of educational content.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>9. Acceptance of Risk</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>By using the Service, you acknowledge that:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>you understand the risks involved</li>
            <li>education does not eliminate risk</li>
            <li>you accept full responsibility for your actions</li>
          </ul>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>Platform Operator</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            Finademica<br />
            Owned and operated by Clientee AI, s.r.o.<br />
            Příčná 1892/4<br />
            Nové Město (Praha 1)<br />
            110 00 Praha<br />
            Czech Republic<br />
            IČO: 234 35 186<br />
            hey@finademica.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskDisclosure;
