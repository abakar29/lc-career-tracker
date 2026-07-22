import { Briefcase, Users, Sparkles, ArrowRight } from "lucide-react";
import { Modal, Button } from "./ui";

function FeaturePoint({ icon: Icon, text }) {
  return (
    <div className="rounded-lg bg-orange-50 p-3">
      <Icon className="h-5 w-5 text-orange-700" aria-hidden="true" />
      <p className="mt-2 text-xs text-slate-600">{text}</p>
    </div>
  );
}

export default function Onboarding({ open, onDismiss }) {
  return (
    <Modal open={open} onClose={onDismiss} title="Welcome to PioneerPath" className="max-w-xl">
      <div className="space-y-5">
        <p className="text-sm text-slate-600">
          Right now, a Pioneer&apos;s job search is scattered across Handshake, spreadsheets,
          LinkedIn messages, and sticky notes, with no single place connecting what
          you&apos;ve <strong>done</strong> (experience), <strong>who you know</strong> (network),
          and <strong>what you can do</strong> (skills) into a clear picture of how ready you
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

        <p className="text-sm text-slate-600">
          PioneerPath turns that scattered progress into one connected profile, built for
          L&amp;C students working with the <strong>Career Center</strong> to get ready for
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
