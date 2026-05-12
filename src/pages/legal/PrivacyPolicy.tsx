import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClient } from "@/lib/clientContext";

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 md:px-6 md:py-8 max-w-3xl mx-auto">
        <div className={`prose prose-sm md:prose-base max-w-none ${isNasrTheme ? 'prose-invert' : 'prose-invert'}`}>
          <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
            Last updated: 9.1.2026
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>1. Introduction</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            This Privacy Policy explains how personal data is collected, used, and protected when you access or use the Finademica platform, including the website and mobile applications (the "Service").
          </p>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            The Service operates under the Finademica brand and is owned and managed by Clientee AI, s.r.o..
          </p>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            We respect your privacy and process personal data in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR).
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>2. Data Controller</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            Data Controller:<br />
            Clientee AI, s.r.o.<br />
            Příčná 1892/4<br />
            Nové Město (Praha 1)<br />
            110 00 Praha<br />
            Czech Republic<br />
            IČO: 234 35 186<br />
            hey@finademica.com
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>3. Personal Data We Collect</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>We may collect the following categories of personal data:</p>
          
          <h3 className={`text-lg font-medium mt-4 mb-2 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>a) Account Data</h3>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Email address</li>
            <li>Account identifiers</li>
            <li>Encrypted authentication credentials</li>
          </ul>

          <h3 className={`text-lg font-medium mt-4 mb-2 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>b) Learning & Usage Data</h3>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Videos watched and lessons completed</li>
            <li>Quiz results, progress, points, and achievements</li>
            <li>Interaction with educational and AI tools</li>
          </ul>

          <h3 className={`text-lg font-medium mt-4 mb-2 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>c) Technical Data</h3>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>IP address</li>
            <li>Device and browser information</li>
            <li>Log files and timestamps</li>
          </ul>

          <h3 className={`text-lg font-medium mt-4 mb-2 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>d) Communication Data</h3>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Support messages</li>
            <li>System and account-related emails</li>
          </ul>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>4. Purpose of Processing</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>Personal data is processed to:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Provide access to the Service</li>
            <li>Operate educational and AI-based features</li>
            <li>Track learning progress and unlock content</li>
            <li>Communicate with users</li>
            <li>Improve platform functionality and security</li>
            <li>Fulfill legal obligations</li>
          </ul>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>5. Legal Basis</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>We process personal data based on:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Performance of a contract</li>
            <li>Legitimate interests (security, platform improvement)</li>
            <li>User consent (where required)</li>
            <li>Legal obligations</li>
          </ul>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>6. Data Sharing</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>We do not sell personal data.</p>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>Personal data may be shared only with:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Technical and infrastructure service providers</li>
            <li>Analytics and email delivery services</li>
            <li>Authorities if legally required</li>
          </ul>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>All partners are bound by confidentiality and data protection obligations.</p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>7. International Data Transfers</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            Data may be processed within or outside the European Union. Where required, appropriate safeguards are applied to ensure GDPR compliance.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>8. Data Retention</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>We retain personal data only for as long as necessary:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>While your account remains active</li>
            <li>As required by applicable laws</li>
          </ul>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>You may request account deletion at any time.</p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>9. User Rights</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>You have the right to:</p>
          <ul className={`list-disc pl-5 space-y-1 ${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'}`}>
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request deletion</li>
            <li>Restrict or object to processing</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>Requests may be made through the platform or support channels.</p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>10. Security</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            We implement appropriate technical and organizational measures to protect personal data. However, no system can guarantee absolute security.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>11. Changes</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            This Privacy Policy may be updated from time to time. The latest version will always be available on the platform.
          </p>

          <h2 className={`text-xl font-semibold mt-6 mb-3 ${isNasrTheme ? 'text-nasr-text' : 'text-white'}`}>12. Contact</h2>
          <p className={`${isNasrTheme ? 'text-nasr-text/90' : 'text-white/90'} leading-relaxed`}>
            hey@finademica.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
