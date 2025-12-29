import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the Radaa ride-hailing app, explaining what information we collect, how we use it, and how you can request deletion.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-[60vh] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-300">
            This Privacy Policy explains how Radaa collects, uses, and shares
            information when you use the Radaa app and related services.
          </p>
        </header>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">
            Information We Collect
          </h2>
          <p>
            When you use Radaa, we may collect the following types of
            information:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Basic account details such as your name, email address, and phone
              number.
            </li>
            <li>
              Ride and app activity information, including rides requested,
              rides completed, and interactions with in-app features.
            </li>
            <li>
              Location information, such as approximate or precise location
              while the app is in use, to help match you with nearby drivers and
              show relevant trip information.
            </li>
            <li>
              Device and technical information, such as device type, operating
              system, app version, and basic diagnostic data used to improve
              performance and security.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">
            How We Use Information
          </h2>
          <p>
            Radaa uses the information we collect to operate and improve the
            service, including to:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Provide and manage rides, including matching passengers and
              drivers and showing trip details.
            </li>
            <li>
              Maintain account security, prevent fraud, and keep the Radaa
              community safe.
            </li>
            <li>
              Send important notifications related to rides, account activity,
              and changes to our services.
            </li>
            <li>
              Analyze usage in aggregate to improve reliability, performance,
              and user experience.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">Data Sharing</h2>
          <p>
            We may share limited information with third-party service providers
            that help us run Radaa, such as payment processors, analytics
            providers, and cloud hosting partners. These providers are required
            to handle your data securely and only for the purposes we specify.
          </p>
          <p>
            Radaa does
            {" "}
            <span className="font-semibold">not sell your personal data</span>
            {" "}
            to third parties. We may share aggregated or anonymized
            information that does not identify you personally.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">
            Data Deletion
          </h2>
          <p>
            You can request deletion of your Radaa account and associated data
            at any time. For detailed instructions on what is deleted, what may
            be retained for legal or fraud-prevention reasons, and expected
            processing times, please visit our dedicated deletion page:
          </p>
          <p>
            <a
              href="https://radaa.vercel.app/delete-account"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-300 underline underline-offset-4"
            >
              https://radaa.vercel.app/delete-account
            </a>
            .
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">
            Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy or how Radaa
            handles your data, you can contact us at:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:support@radaa.vercel.app"
              className="font-medium text-emerald-300 underline underline-offset-4"
            >
              support@radaa.vercel.app
            </a>
            .
          </p>
        </section>

        <section className="border-t border-slate-800 pt-4 text-xs text-slate-400">
          <p>
            This Privacy Policy page is publicly accessible and does not require
            a Radaa login. It is intended to help users and reviewers understand
            how information is collected, used, and protected in the Radaa app.
          </p>
        </section>
      </div>
    </main>
  );
}
