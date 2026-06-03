import QuizHeader from "@/components/understanding/QuizHeader";
import QuizGame from "@/components/understanding/QuizGame";
import { getAllVocab } from "@/lib/vocabulary";

export const metadata = {
  title: "Test your understanding · NSCD",
  description:
    "Multiple-choice rounds drawn from the NSCD climate glossary. Pick a category and a length, then match each term to its definition.",
};

export default function TestUnderstandingPage() {
  const entries = getAllVocab();
  return (
    <>
      <QuizHeader />
      <QuizGame entries={entries} />
    </>
  );
}
