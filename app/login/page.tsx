import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log in · NSCD",
  description: "Sign in to your NSCD account to access your bilingual climate progress.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Account · Log in"
      title="Welcome back."
      intro="Sign in to pick up where you left off — your learned words, language goals, and matching interests all live behind this door."
      altLink={{ href: "/signup", label: "Need an account? Sign up →" }}
    >
      <LoginForm />
    </AuthShell>
  );
}
