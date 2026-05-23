interface Props {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  value: string;
  autoComplete?: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  onChange: (v: string) => void;
}

export default function FormField({
  label,
  name,
  type = "text",
  value,
  autoComplete,
  required,
  error,
  hint,
  onChange,
}: Props) {
  return (
    <label className="block">
      <span className="label-mono text-sage block mb-2">
        {label}
        {required && <span aria-hidden className="text-coral ml-1">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={`w-full border-2 bg-paper px-4 py-3.5 text-[16px] text-ink outline-none transition-colors ${
          error ? "border-coral" : "border-ink focus:border-coral"
        }`}
      />
      {hint && !error && (
        <span className="mt-1.5 block label-mono text-sage normal-case tracking-normal text-[12px]">
          {hint}
        </span>
      )}
      {error && (
        <span className="mt-1.5 block label-mono text-coral normal-case tracking-normal text-[12px]">
          {error}
        </span>
      )}
    </label>
  );
}
