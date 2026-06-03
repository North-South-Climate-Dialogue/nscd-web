import QuizHeader from "@/components/quiz/QuizHeader";
import QuizGame from "@/components/quiz/QuizGame";
import { getAllVocab } from "@/lib/vocabulary";

export const metadata = {
  title: "Quiz · NSCD",
  description:
    "A 20-question round drawn from the NSCD climate glossary, mixing fill-in-the-blank, term matching, and Chinese phrase completion — randomly assigned each round.",
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
