/**
 * Profile fields stored in Supabase auth.users.user_metadata (JSONB).
 * Keeping them here gives the rest of the app a stable shape to read against.
 */

export const NATIVE_LANGUAGES = ["english", "chinese", "other"] as const;
export type NativeLanguage = (typeof NATIVE_LANGUAGES)[number];

export const PRACTICING_LANGUAGES = ["english", "chinese", "both"] as const;
export type PracticingLanguage = (typeof PRACTICING_LANGUAGES)[number];

export interface ProfileFields {
  display_name: string;
  bio: string;
  native_language: NativeLanguage | "";
  practicing: PracticingLanguage | "";
  location: string;
}

export const EMPTY_PROFILE: ProfileFields = {
  display_name: "",
  bio: "",
  native_language: "",
  practicing: "",
  location: "",
};

export const NATIVE_LANGUAGE_LABELS: Record<NativeLanguage, string> = {
  english: "English",
  chinese: "中文",
  other: "Other",
};

export const PRACTICING_LANGUAGE_LABELS: Record<PracticingLanguage, string> = {
  english: "English",
  chinese: "中文",
  both: "Both",
};
