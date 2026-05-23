import PinyinHero from "@/components/pinyin/PinyinHero";
import AnatomyOfSyllable from "@/components/pinyin/AnatomyOfSyllable";
import WhatIsPinyin from "@/components/pinyin/WhatIsPinyin";
import TrickySounds from "@/components/pinyin/TrickySounds";
import SoundTable from "@/components/pinyin/SoundTable";
import TonesSection from "@/components/pinyin/TonesSection";
import NextCta from "@/components/pinyin/NextCta";
import { INITIALS, FINALS } from "@/lib/pinyin/reference";

export const metadata = {
  title: "Simple Pinyin Guide · NSCD",
  description:
    "A short field manual on how Chinese pinyin works — initials, finals, tones, and the five sounds English speakers most often misread.",
};

export default function PinyinGuidePage() {
  return (
    <>
      <PinyinHero />
      <AnatomyOfSyllable />
      <WhatIsPinyin />
      <TrickySounds />
      <SoundTable
        eyebrow="Initials"
        title="The consonants."
        blurb="Initials are the consonants that start most syllables. Most read like their English cousins. Pay extra attention to j / q / x / z / c / zh / ch / sh — they're the ones that don't."
        entries={INITIALS}
      />
      <SoundTable
        eyebrow="Finals"
        title="The vowels."
        blurb="Finals carry the vowel sound and the tone mark. There are also compound finals — ia, iao, ian, iang, iong, ua, uo, uai, uan, uang, ueng, üe, ün, üan — read as a smooth slide of the simple finals."
        entries={FINALS}
      />
      <TonesSection />
      <NextCta />
    </>
  );
}
