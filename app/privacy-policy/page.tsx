import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Logic Gym – a logic puzzle app that respects your privacy and does not collect personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#050d1a] text-slate-200 px-4 md:px-10 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
        >
          ← Back to Logic Gym
        </Link>

        {/* Title */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-green-400">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">
            Effective date: 23 January 2026
          </p>
        </header>

        {/* Content */}
        <section className="space-y-5 text-sm md:text-base leading-relaxed">
          <p>
            Logic Gym (“we”, “our”, or “the app”) is a logic puzzle application
            designed to help users train their brain through classic and modern
            logic games. We respect your privacy and are committed to protecting
            it.
          </p>

          <h2 className="text-lg font-semibold text-green-300">
            1. Information We Collect
          </h2>

          <p className="font-semibold">a) Personal Information</p>
          <p>
            Logic Gym does <strong>not</strong> collect, store, or request any
            personally identifiable information, such as your name, email
            address, phone number, location, or contacts.
          </p>
          <p>
            You can use the app without creating an account or signing in.
          </p>

          <p className="font-semibold">b) Usage Information</p>
          <p>
            Logic Gym does not actively track users or store gameplay data on any
            server. Basic technical information may be handled automatically by
            your browser or operating system for normal functionality and
            security, but this information is not accessed or stored by us.
          </p>

          <h2 className="text-lg font-semibold text-green-300">
            2. Cookies and Local Storage
          </h2>
          <p>
            Logic Gym may use local or browser storage to remember game state or
            improve user experience. This data remains on your device and is not
            transmitted to our servers.
          </p>
          <p>
            We do not use cookies for advertising or tracking purposes.
          </p>

          <h2 className="text-lg font-semibold text-green-300">
            3. Advertisements
          </h2>
          <p>
            Logic Gym does not display advertisements and does not use ad
            networks.
          </p>

          <h2 className="text-lg font-semibold text-green-300">
            4. Third-Party Services
          </h2>
          <p>
            Logic Gym does not integrate with third-party analytics, advertising,
            or tracking services. If this changes in the future, this Privacy
            Policy will be updated accordingly.
          </p>

          <h2 className="text-lg font-semibold text-green-300">
            5. Children’s Privacy
          </h2>
          <p>
            Logic Gym is suitable for users of all ages. We do not knowingly
            collect personal data from children.
          </p>

          <h2 className="text-lg font-semibold text-green-300">
            6. Data Security
          </h2>
          <p>
            Since Logic Gym does not collect or store personal data, there is no
            risk of personal data leakage from our systems. The app is served
            over HTTPS to ensure secure communication.
          </p>

          <h2 className="text-lg font-semibold text-green-300">
            7. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            be reflected on this page with an updated effective date.
          </p>

          <h2 className="text-lg font-semibold text-green-300">
            8. Contact Information
          </h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact
            us via the Logic Gym website:
          </p>
          <p>
            <a
              href="https://logicgym.rahulprakash.co.in"
              className="text-green-400 hover:underline"
            >
              https://logicgym.rahulprakash.co.in
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
