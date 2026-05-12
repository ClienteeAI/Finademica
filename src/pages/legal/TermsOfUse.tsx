import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClient } from "@/lib/clientContext";

const TermsOfUse = () => {
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
            Terms of Use
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 md:px-6 md:py-8 max-w-3xl mx-auto">
        <div className={`prose prose-sm md:prose-base max-w-none ${isNasrTheme ? 'prose-invert' : 'prose-invert'}`}>
          <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
            Last updated: 9.1.2026
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>1. Acceptance of Terms</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            These Terms of Use ("Terms") govern your use of the Finademica platform, including the website and mobile applications (the "Service").
          </p>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            By accessing or using the Service, you agree to these Terms. If you do not agree, you must not use the Service.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>2. Platform Purpose</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>The Service is an educational academy designed to teach:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Trading concepts</li>
            <li>Financial market principles</li>
            <li>Risk awareness</li>
            <li>Analytical thinking</li>
          </ul>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            The Service does not provide financial, investment, legal, or tax advice.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>3. No Financial Advice</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>All content, including:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>videos</li>
            <li>AI-generated explanations</li>
            <li>calculators and tools</li>
            <li>quizzes and analytics</li>
          </ul>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            is provided for educational purposes only and does not constitute professional advice or a recommendation to trade or invest.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>4. Eligibility</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            The Service is intended for individuals 18 years of age or older. By using the Service, you confirm that you meet this requirement.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>5. Accounts</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>You are responsible for:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Maintaining accurate account information</li>
            <li>Protecting your login credentials</li>
            <li>All activity conducted under your account</li>
          </ul>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>6. AI & Automated Systems</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>The Service uses AI-based systems to support learning.</p>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>AI-generated outputs:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>may be inaccurate or incomplete</li>
            <li>should not be relied upon for decision-making</li>
            <li>are intended to support education only</li>
          </ul>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>7. Mobile Applications</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            The Service is available via web and mobile applications. Applications distributed through the Apple App Store or Google Play Store are provided independently of those platforms. App stores are not responsible for the Service or its content.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>8. Intellectual Property</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            All content, software, and materials are protected by intellectual property laws. You may not copy, redistribute, or commercially exploit any part of the Service without permission.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>9. Prohibited Use</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>You agree not to:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Abuse or manipulate platform systems</li>
            <li>Reverse engineer or disrupt the Service</li>
            <li>Create multiple accounts to exploit features</li>
            <li>Use the Service unlawfully</li>
          </ul>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>10. Availability</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            The Service is provided "as is" and "as available." We do not guarantee uninterrupted or error-free operation.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>11. Limitation of Liability</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>To the maximum extent permitted by law:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>We are not responsible for trading or investment losses</li>
            <li>We are not liable for decisions made based on educational content</li>
            <li>Use of the Service is at your own risk</li>
          </ul>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>12. App Store Disclaimer</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            These Terms are an agreement between you and the platform operator, not with Apple Inc. or Google LLC. Apple Inc. and Google LLC bear no responsibility for the Service.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>13. Termination</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            We may suspend or terminate access to the Service if these Terms are violated.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>14. Governing Law</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            These Terms are governed by applicable laws, without prejudice to mandatory consumer protections.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>15. Changes</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            We may update these Terms at any time. Continued use of the Service constitutes acceptance of the updated Terms.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>16. Operator Information</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            Brand: Finademica<br />
            Owner & Operator:<br />
            Clientee AI, s.r.o.<br />
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

export default TermsOfUse;
