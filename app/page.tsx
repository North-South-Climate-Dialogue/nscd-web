import Hero from "@/components/home/Hero";
import StatsBand from "@/components/home/StatsBand";
import TodaysWords from "@/components/home/TodaysWords";

// Re-generate the page (and its live StatsBand numbers) at most every 5 min.
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <TodaysWords />
    </>
  );
}
