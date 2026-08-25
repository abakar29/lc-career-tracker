import { Briefcase, Users, Sparkles, ArrowRight } from "lucide-react";
import { Modal, Button } from "./ui";

function FeaturePoint({ icon: Icon, text }) {
  return (
    <div className="rounded-lg bg-orange-50 dark:bg-orange-500/10 p-3">
      <Icon className="h-5 w-5 text-orange-700 dark:text-orange-300" aria-hidden="true" />
      <p className="mt-2 text-xs text-slate-600 dark:text-neutral-400">{text}</p>
    </div>
  );
}

export default function Onboarding({ open, onDismiss }) {
  return (
    <Modal open={open} onClose={onDismiss} title="Welcome to Abuve" className="max-w-xl">
      <div className="space-y-5">
        <p className="text-sm text-slate-600 dark:text-neutral-400">
          Right now, your job search is scattered across Handshake, spreadsheets,
          LinkedIn messages, and sticky notes, with no single place connecting what
          you&apos;ve <strong className="dark:text-neutral-200">done</strong> (experience), <strong className="dark:text-neutral-200">who you know</strong> (network),
          and <strong className="dark:text-neutral-200">what you can do</strong> (skills) into a clear picture of how ready you
          are to apply.
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          <FeaturePoint
            icon={Briefcase}
            text="Log internships, study abroad, and campus activities like ASLC in one timeline"
          />
          <FeaturePoint
            icon={Users}
            text="Track every Career Center and alumni contact, with follow-up reminders"
          />
          <FeaturePoint
            icon={Sparkles}
            text="See your Career Readiness Score and exactly what's missing to close the gap"
          />
        </div>

        <p className="text-sm text-slate-600 dark:text-neutral-400">
          Abuve turns that scattered progress into one connected profile, built for
          L&amp;C students working with the <strong className="dark:text-neutral-200">Career Center</strong> to get ready for
          internships, study abroad, and life after Watzek.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onDismiss}>
            Skip for now
          </Button>
          <Button variant="primary" onClick={onDismiss}>
            Get Started
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
