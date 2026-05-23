export default function AuthEnvWarning() {
  return (
    <div className="border-2 border-coral bg-paper p-5 md:p-6 shadow-thunk">
      <div className="flex items-start gap-3">
        <span aria-hidden className="text-coral text-2xl leading-none">⚠</span>
        <div>
          <div className="font-display font-extrabold text-ink text-[18px] md:text-[22px] leading-tight tracking-tight normal-case">
            Authentication isn&apos;t configured yet.
          </div>
          <p className="mt-2 text-ink/80 text-[14px] leading-[1.55]">
            This form will work as soon as Supabase credentials are added to{" "}
            <code className="font-mono bg-ink/8 px-1 py-0.5 border border-ink/15 text-[13px]">
              .env.local
            </code>
            . Until then, signup and login will fail. See{" "}
            <code className="font-mono bg-ink/8 px-1 py-0.5 border border-ink/15 text-[13px]">
              .env.local.example
            </code>{" "}
            for the variables to set.
          </p>
        </div>
      </div>
    </div>
  );
}
