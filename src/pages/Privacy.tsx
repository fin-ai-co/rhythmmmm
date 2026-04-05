import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background scroll-container">
      <div className="max-w-md mx-auto px-5 pt-14 pb-16">
        <div className="page-transition">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 touch-active"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">back</span>
          </button>

          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">privacy policy</h1>
          <p className="text-xs text-muted-foreground mb-8">last updated: april 5, 2026</p>

          <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">1. information we collect</h2>
              <p>
                when you use rhythm, we collect information you provide directly — your email address,
                authentication credentials, and habit data you create within the app. we also collect usage
                data such as habit completions, streaks, and journal entries to provide you with analytics
                and insights.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">2. how we use your data</h2>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>to provide, maintain, and improve the app experience</li>
                <li>to track your habits, streaks, and progress over time</li>
                <li>to sync your data across devices via secure cloud storage</li>
                <li>to send you reminders if you've opted in to notifications</li>
                <li>to generate personalized insights and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">3. data storage & security</h2>
              <p>
                your data is stored securely using industry-standard encryption and cloud infrastructure.
                we use row-level security to ensure your data is only accessible to you. we do not sell,
                rent, or share your personal data with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">4. third-party services</h2>
              <p>
                we use google oauth for authentication. when you sign in with google, we receive your
                name, email, and profile picture. we do not access any other google account data.
                please review google's privacy policy for more information.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">5. your rights</h2>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>access and export your personal data at any time</li>
                <li>request deletion of your account and all associated data</li>
                <li>opt out of non-essential communications</li>
                <li>update or correct your personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">6. data retention</h2>
              <p>
                we retain your data for as long as your account is active. if you delete your account,
                all personal data will be permanently removed within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">7. children's privacy</h2>
              <p>
                rhythm is not intended for children under 13. we do not knowingly collect personal
                information from children under 13 years of age.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">8. changes to this policy</h2>
              <p>
                we may update this privacy policy from time to time. we will notify you of any material
                changes by posting the new policy within the app. your continued use of discipline after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">9. contact</h2>
              <p>
                if you have questions about this privacy policy or your data, please reach out to us
                through the app's settings page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
