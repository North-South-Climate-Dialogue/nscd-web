import FlashcardsHeader from "@/components/flashcards/FlashcardsHeader";
import FlashcardDeck from "@/components/flashcards/FlashcardDeck";
import { getAllVocab } from "@/lib/vocabulary";

export const metadata = {
  title: "Flashcards · NSCD",
  description:
    "A focused flashcard mode for the NSCD climate vocabulary. Flip, recall, master.",
};

export default function FlashcardsPage() {
  const entries = getAllVocab();
  return (
    <>
      <FlashcardsHeader />
      <FlashcardDeck entries={entries} />
    </>
  );
}
