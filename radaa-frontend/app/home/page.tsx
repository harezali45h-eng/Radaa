"use client";

export default function AboutPage() {
  return (
    <main className="space-y-10 text-xs">
      <section className="space-y-3">
        <p className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
          Kaa Radaa ujue mat yako iko wapi
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Radaa is your live matatu radar.
        </h1>
        <p className="max-w-xl text-slate-300">
          Radaa helps you see nearby matatus in real time, choose your route
          with confidence, and pay fares without stress. Designed for Gen-Z,
          students, and everyday commuters along Nairobi corridors.
        </p>
      </section>

      <section className="space-y-4 border-t border-slate-800/70 pt-4">
        <h2 className="text-sm font-semibold text-slate-100">Contact &amp; support</h2>
        <div className="space-y-2 text-slate-300">
          <p>
            For questions, route issues, or feedback about Radaa, talk to your
            SACCO representative or platform admin. You can also share feedback
            directly in product experiments when prompted.
          </p>
          <p className="text-[11px] text-slate-400">
            Radaa is still evolving. If something feels off, treat the
            information as guidance and always confirm with crew on the ground.
          </p>
        </div>
      </section>

      <section className="space-y-4 border-t border-slate-800/70 pt-4">
        <h2 className="text-sm font-semibold text-slate-100">How Radaa works</h2>
        <div className="space-y-2 text-slate-300">
          <p>
            When you open Radaa, you get a live map of nearby matatus, a simple
            search for where you&apos;re going, and a clean wallet view for your
            rides.
          </p>
          <ul className="space-y-1.5 pl-4 text-[11px] list-disc marker:text-slate-500">
            <li>
              Check live matatus and routes before you walk to the stage.
            </li>
            <li>Track your recent trips and loyalty rewards in one place.</li>
            <li>Pay fares digitally where supported, or keep track of cash.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4 border-t border-slate-800/70 pt-4">
        <h2 className="text-sm font-semibold text-slate-100">Safety &amp; trust</h2>
        <div className="space-y-2 text-slate-300">
          <p>
            Radaa is built to make everyday public transport feel more
            transparent. We focus on clear information, predictable routes, and
            trip history that you can reference later.
          </p>
          <p className="text-[11px] text-slate-400">
            Radaa does not replace official safety channels. In any emergency,
            always contact local authorities or your SACCO operator first.
          </p>
        </div>
      </section>

      <section className="space-y-4 border-t border-slate-800/70 pt-4">
        <h2 className="text-sm font-semibold text-slate-100">
          Terms, privacy &amp; data
        </h2>
        <div className="space-y-2 text-slate-300">
          <p>
            We use your location and basic profile details to show nearby
            matatus, calculate routes, and keep your trip history and wallet in
            sync.
          </p>
          <p className="text-[11px] text-slate-400">
            By using Radaa you agree that your data may be processed to provide
            transport services, improve reliability, and prevent fraud. Location
            is only accessed while you&apos;re actively using live features like the
            map or ride requests.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-800/70 pt-4 text-[11px] text-slate-500">
        <p>
          Radaa is an experimental mobility product built for Kenyan public
          transport. Features may change over time as we test, learn, and ship
          improvements.
        </p>
      </footer>
    </main>
  );
}
