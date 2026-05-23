"use client";

import Image from "next/image";

/**
 * QiQi — the NSCD tangram mascot.
 * Uses the official illustration from D:\NSCDGit\QiQi (QiQi new.png) and
 * gently sways the whole figure as a wave gesture, paired with bilingual
 * speech bubbles on either side.
 */
export default function QiQi({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="qiqi-wave">
        <Image
          src="/qiqi/qiqi-new.png"
          alt="QiQi, the NSCD mascot, waving hello in English and 中文"
          width={640}
          height={640}
          priority
          className="w-full h-auto select-none"
          draggable={false}
        />
      </div>

      {/* English speech bubble */}
      <div className="absolute top-[6%] left-[-2%] md:left-[-6%] bubble bubble-en">
        <span className="font-display font-extrabold text-green text-xl md:text-2xl tracking-tight">
          HI!
        </span>
      </div>

      {/* Chinese speech bubble */}
      <div className="absolute top-[2%] right-[-2%] md:right-[-6%] bubble bubble-zh">
        <span className="font-zh font-bold text-coral text-xl md:text-2xl">
          你好！
        </span>
      </div>

      <style jsx>{`
        @keyframes qiqi-wave {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          50%      { transform: rotate(5deg)  translateY(-6px); }
        }
        .qiqi-wave {
          animation: qiqi-wave 2.2s ease-in-out infinite;
          transform-origin: 50% 92%;
          will-change: transform;
        }

        @keyframes bubble-bob-a {
          0%, 100% { transform: translateY(0)    rotate(-4deg); }
          50%      { transform: translateY(-4px) rotate(-1deg); }
        }
        @keyframes bubble-bob-b {
          0%, 100% { transform: translateY(0)    rotate(4deg); }
          50%      { transform: translateY(-4px) rotate(1deg); }
        }
        .bubble {
          background: #F4EFE6;
          border: 3px solid #0E1F2C;
          border-radius: 18px;
          padding: 10px 16px;
          box-shadow: 4px 4px 0 #0E1F2C;
          line-height: 1;
        }
        .bubble::after {
          content: "";
          position: absolute;
          bottom: -10px;
          width: 16px;
          height: 16px;
          background: #F4EFE6;
          border-right: 3px solid #0E1F2C;
          border-bottom: 3px solid #0E1F2C;
          transform: rotate(45deg);
        }
        .bubble-en::after { left: 22px; }
        .bubble-zh::after { right: 22px; }

        .bubble-en { animation: bubble-bob-a 3.1s ease-in-out infinite; }
        .bubble-zh { animation: bubble-bob-b 2.7s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .qiqi-wave,
          .bubble-en,
          .bubble-zh { animation: none; }
        }
      `}</style>
    </div>
  );
}
