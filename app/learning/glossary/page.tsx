import GlossaryHeader from "@/components/glossary/GlossaryHeader";
import GlossaryBrowser from "@/components/glossary/GlossaryBrowser";
import { getAllVocab } from "@/lib/vocabulary";

export default function GlossaryPage() {
  const entries = getAllVocab();
  return (
    <>
      <GlossaryHeader />
      <GlossaryBrowser entries={entries} />
    </>
  );
}
