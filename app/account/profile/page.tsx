import PageStub from "@/components/layout/PageStub";

export default function ProfilePage() {
  return (
    <PageStub
      eyebrow="Account · Profile"
      title="Your profile."
      description="Name, email, native language, avatar — all editable. Pulled from your Supabase auth user and the profiles table."
    />
  );
}
