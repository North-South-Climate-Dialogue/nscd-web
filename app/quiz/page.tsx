import QuizHeader from "@/components/quiz/QuizHeader";
import QuizGame from "@/components/quiz/QuizGame";
import { getAllVocab } from "@/lib/vocabulary";

export const metadata = {
  title: "Quiz · NSCD",
  description:
    "Multiple-choice quiz rounds drawn from the NSCD climate glossary. Pick a category, pick a length, start playing.",
};

export default function QuizPage() {
  const entries = getAllVocab();
  return (
    <>
      <QuizHeader />
      <QuizGame entries={entries} />
    </>
  );
}
