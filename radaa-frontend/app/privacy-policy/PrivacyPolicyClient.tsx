"use client";

import { useState } from "react";
import Link from "next/link";

export default function PrivacyPolicyClient() {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const isDark = mode === "dark";

  const backgroundClass = isDark
    ? "bg-slate-950 text-slate-50"
    : "bg-slate-50 text-slate-900";

  const cardClass = isDark
    ? "bg-slate-900/80 border-slate-800 shadow-lg"
    : "bg-white border-slate-200 shadow-md";

  const subtleTextClass = isDark ? "text-slate-300" : "text-slate-600";
  const bodyTextClass = isDark ? "text-slate-200" : "text-slate-700";

  return (
    <main
      className={`min-h-[60vh] px-4 py-12 sm:px-6 lg:px-8 transition-colors ${backgroundClass}`}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Radaa Privacy Policy
            </h1>
            <p className={`mt-1 text-sm ${subtleTextClass}`}>
              Privacy policy for the Radaa ride-hailing app. Learn what data we
              collect, how we use it, and how you can delete your account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMode(isDark ? "light" : "dark")}
            className="inline-flex items-center gap-1 rounded-full border border-slate-500/70 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-100 shadow-sm transition hover:border-emerald-400/80 hover:text-emerald-200"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span>{isDark ? "Dark" : "Light"} mode</span>
          </button>
        </div>

        <div
          className={`space-y-8 rounded-2xl border px-5 py-6 sm:px-8 sm:py-8 ${cardClass}`}
        >
          <section className="space-y-2 text-sm">
            <p className={bodyTextClass}>
              Radaa is a ride-hailing and matatu tracking app. This Privacy Policy
              explains what information we collect, how we use it, and the choices you
              have about your data when you use Radaa.
            </p>
          </section>

          <section className="space-y-2 text-sm">
            <h2 className="text-base font-semibold">Data We Collect</h2>
            <p className={bodyTextClass}>
              Depending on how you use Radaa (as a passenger, driver, or operator), we
              may collect the following types of information:
            </p>
            <ul className={`list-disc space-y-1 pl-5 ${bodyTextClass}`}>
              <li>
                <span className="font-medium">Profile information:</span> name,
                email address, phone number, and optional profile photos.
              </li>
              <li>
                <span className="font-medium">Location data:</span> approximate and
                precise location (GPS) while using the app, for example to show nearby
                vehicles, track rides, and improve routing.
              </li>
              <li>
                <span className="font-medium">Photos and documents:</span> images you
                provide such as driver license photos, vehicle documents, or other
                verification documents.
              </li>
              <li>
                <span className="font-medium">Files and media:</span> files or
                documents that you upload to verify your identity or vehicle
                eligibility.
              </li>
              <li>
                <span className="font-medium">App activity:</span> rides requested
                and completed, ride preferences, interactions with in-app features,
                and basic usage logs.
              </li>
              <li>
                <span className="font-medium">Device information and IDs:</span>
                device model, operating system, app version, and identifiers such as
                device IDs or advertising IDs used for security, analytics, and fraud
                prevention.
              </li>
            </ul>
          </section>

          <section className="space-y-2 text-sm">
            <h2 className="text-base font-semibold">How We Use Your Data</h2>
            <p className={bodyTextClass}>
              We use the information we collect to operate and improve the Radaa app
              and related services, including to:
            </p>
            <ul className={`list-disc space-y-1 pl-5 ${bodyTextClass}`}>
              <li>
                <span className="font-medium">Provide ride matching:</span> connect
                passengers with nearby drivers and show relevant trip information.
              </li>
              <li>
                <span className="font-medium">Verify drivers and vehicles:</span>
                confirm driver identity, eligibility, and vehicle documents where
                applicable.
              </li>
              <li>
                <span className="font-medium">Send app notifications:</span> provide
                important updates about rides, safety, service changes, and account
                activity.
              </li>
              <li>
                <span className="font-medium">Analytics and improvements:</span>
                analyze aggregated usage data to improve performance, reliability, and
                the overall Radaa experience.
              </li>
            </ul>
          </section>

          <section className="space-y-2 text-sm">
            <h2 className="text-base font-semibold">Data Sharing</h2>
            <p className={bodyTextClass}>
              We share data only when needed to provide and improve the Radaa service
              or to comply with legal obligations. This may include sharing limited
              information with:
            </p>
            <ul className={`list-disc space-y-1 pl-5 ${bodyTextClass}`}>
              <li>
                <span className="font-medium">Payment processors:</span> to process
                trip payments and refunds securely.
              </li>
              <li>
                <span className="font-medium">Analytics providers:</span> to
                understand app performance, detect errors, and improve reliability.
              </li>
              <li>
                <span className="font-medium">Service providers:</span> such as cloud
                hosting, mapping, and communication tools that help us operate Radaa.
              </li>
            </ul>
            <p className={bodyTextClass}>
              <span className="font-medium">We do not sell your personal data</span>
              {" "}
              to third parties. We may share aggregated or anonymized information that
              does not identify you personally.
            </p>
          </section>

          <section className="space-y-2 text-sm">
            <h2 className="text-base font-semibold">Data Deletion</h2>
            <p className={bodyTextClass}>
              You can request deletion of your Radaa account and associated data at
              any time. To start the process, please visit our dedicated deletion
              page:
            </p>
            <p className={bodyTextClass}>
              <a
                href="https://radaa.vercel.app/delete-account"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-400 underline underline-offset-4"
              >
                https://radaa.vercel.app/delete-account
              </a>
              .
            </p>
            <p className={bodyTextClass}>
              If you are already using the web app, you can also navigate to the
              deletion page from within Radaa:
            </p>
            <p className={bodyTextClass}>
              <Link
                href="/delete-account"
                className="font-medium text-emerald-400 underline underline-offset-4"
              >
                Go to Delete Radaa Account and Data page
              </Link>
              .
            </p>
          </section>

          <section className="space-y-2 text-sm">
            <h2 className="text-base font-semibold">Security Practices</h2>
            <p className={bodyTextClass}>
              We take reasonable measures to protect your information. These include:
            </p>
            <ul className={`list-disc space-y-1 pl-5 ${bodyTextClass}`}>
              <li>
                <span className="font-medium">Encryption in transit:</span> data is
                transmitted over secure HTTPS connections where supported.
              </li>
              <li>
                <span className="font-medium">Access controls:</span> limiting access
                to personal data to authorized personnel and service components.
              </li>
              <li>
                <span className="font-medium">Industry-standard security:</span>
                using common best practices and regularly maintaining our
                infrastructure and dependencies.
              </li>
            </ul>
            <p className={bodyTextClass}>
              No system can be 100% secure, but we work continuously to safeguard your
              information and to respond quickly to potential issues.
            </p>
          </section>

          <section className="space-y-2 text-sm">
            <h2 className="text-base font-semibold">Changes to This Privacy Policy</h2>
            <p className={bodyTextClass}>
              We may update this Privacy Policy from time to time as our services or
              legal requirements change. When we make material updates, we will
              update the effective date and may provide additional notice within the
              Radaa app or on our website.
            </p>
          </section>

          <section className="space-y-2 text-sm">
            <h2 className="text-base font-semibold">Contact Us</h2>
            <p className={bodyTextClass}>
              If you have any questions about this Privacy Policy or how Radaa handles
              your data, please contact us at:
            </p>
            <p className={bodyTextClass}>
              Email:{" "}
              <a
                href="mailto:support@radaa.vercel.app"
                className="font-medium text-emerald-400 underline underline-offset-4"
              >
                support@radaa.vercel.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
