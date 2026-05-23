import PageStub from "@/components/layout/PageStub";

export default function ProgressPage() {
  return (
    <PageStub
      eyebrow="Account · Progress"
      title="Words learned. Badges earned."
      description="A heat-grid of all 149 terms colored by status, a sparkline of words learned per week, and your earned badges. Reads from Supabase's vocabulary_progress table."
    />
  );
}
