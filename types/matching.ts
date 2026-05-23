/**
 * Fields stored in user_metadata.matching (JSON sub-object).
 * Mirrors the form on /account/matching.
 */

export const AVAILABILITY_OPTIONS = [
  { value: "weekday-evening",   label: "Weekday evenings" },
  { value: "weekend-morning",   label: "Weekend mornings" },
  { value: "weekend-afternoon", label: "Weekend afternoons" },
  { value: "flexible",          label: "Flexible" },
] as const;

export const TOPIC_OPTIONS = [
  { value: "climate-justice", label: "Climate justice" },
  { value: "policy",          label: "Policy" },
  { value: "food-systems",    label: "Food systems" },
  { value: "energy",          label: "Energy" },
  { value: "oceans",          label: "Oceans" },
  { value: "urban-planning",  label: "Urban planning" },
  { value: "art-and-climate", label: "Art & climate" },
] as const;

export const OPEN_TO_MATCH_OPTIONS = ["yes", "maybe", "no"] as const;
export type OpenToMatch = (typeof OPEN_TO_MATCH_OPTIONS)[number];

export type Availability = (typeof AVAILABILITY_OPTIONS)[number]["value"];
export type Topic = (typeof TOPIC_OPTIONS)[number]["value"];

export interface MatchingFields {
  availability: Availability[];
  neighborhood: string;
  topics: Topic[];
  about: string;
  open_to_match: OpenToMatch | "";
}

export const EMPTY_MATCHING: MatchingFields = {
  availability: [],
  neighborhood: "",
  topics: [],
  about: "",
  open_to_match: "",
};

export const OPEN_TO_MATCH_LABELS: Record<OpenToMatch, string> = {
  yes:   "Yes, pair me",
  maybe: "Maybe — depends",
  no:    "Not right now",
};
