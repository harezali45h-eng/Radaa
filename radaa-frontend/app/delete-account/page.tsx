import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Radaa Account",
  description: "Request deletion of your Radaa account and associated data.",
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-[60vh] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Delete Your Radaa Account
          </h1>
          <p className="text-sm text-slate-300">
            Use this page to understand how to request deletion of your Radaa account
            and what happens to your data when you do.
          </p>
        </header>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">
            Steps to Request Account Deletion
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Open the Radaa app or visit this page in your browser.</li>
            <li>
              From the email address you used to register your Radaa account, send an
              email to{" "}
              <a
                href="mailto:support@radaa.vercel.app"
                className="font-medium text-emerald-300 underline underline-offset-4"
              >
                support@radaa.vercel.app
              </a>{" "}
              clearly stating that you want to delete your Radaa account.
            </li>
            <li>
              Our support team may contact you if we need to verify your identity or
              confirm details related to your Radaa account.
            </li>
            <li>
              Once verified, we will schedule your account and data for deletion and
              send you a confirmation email when the process is complete.
            </li>
          </ol>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">
            Data That Will Be Deleted
          </h2>
          <p>
            When your deletion request is approved and processed, we will delete the
            following data associated with your Radaa account:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Your Radaa user profile information (such as name and contact details)</li>
            <li>Profile photos you uploaded to Radaa</li>
            <li>
              Documents and files used for verification (such as driver licenses or
              vehicle documents)
            </li>
            <li>Your ride history stored in Radaa</li>
            <li>Location data associated with your rides in Radaa</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">
            Data That May Be Retained
          </h2>
          <p>
            In some cases, we may retain limited information even after your account
            is scheduled for deletion where we are legally required or have a
            legitimate need to do so. This may include retaining certain records for:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Compliance with applicable law or law-enforcement requests</li>
            <li>Fraud prevention, security, and abuse detection</li>
            <li>Accounting, tax, or audit obligations</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">Retention Period</h2>
          <p>
            Where retention is required, certain records may be kept for a limited
            period of time after your request is processed. Depending on the type of
            data and legal requirements, this period may be up to
            {" "}
            <span className="font-semibold">30-90 days</span>. After this
            retention period, data that is no longer required is permanently removed or
            anonymized.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">Processing Time</h2>
          <p>
            We aim to complete deletion of your Radaa account and associated data as
            quickly as possible once we have verified your request.
          </p>
          <p>
            In most cases, deletion will be completed within
            {" "}
            <span className="font-semibold">30 days</span> of confirming your
            identity, subject to any limited retention described above. You will
            receive a confirmation email when your Radaa account has been deleted.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">
            Contact Information
          </h2>
          <p>
            If you have questions about account deletion or how Radaa handles your
            data, you can contact us at:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:support@radaa.vercel.app"
              className="font-medium text-emerald-300 underline underline-offset-4"
            >
              support@radaa.vercel.app
            </a>
          </p>
        </section>

        <section className="border-t border-slate-800 pt-4 text-xs text-slate-400">
          <p>
            This page is publicly accessible and does not require a Radaa login. It is
            intended to help you and Google Play reviewers understand how to request
            deletion of your Radaa account and data.
          </p>
        </section>
      </div>
    </main>
  );
}
