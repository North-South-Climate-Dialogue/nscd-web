import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign up · NSCD",
  description: "Create an account to track your bilingual climate vocabulary progress.",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Account · Sign up"
      title="Join the dialogue."
      intro="Create an account to save your progress, mark words as learned, and (later) join the pen-pal system. Email and a password — that's it."
      altLink={{ href: "/login", label: "Already have an account? Log in →" }}
    >
      <SignupForm />
    </AuthShell>
  );
}
