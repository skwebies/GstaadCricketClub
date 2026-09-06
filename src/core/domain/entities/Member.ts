export type CanonicalMemberTier = 'Full Playing' | 'Social Member' | 'Junior' | 'Patron';
export type MemberTier = 'Adult' | 'Family' | 'Junior' | 'Full Playing' | 'Social Member' | 'Patron' | string;
export type MemberStatus = 'active' | 'pending' | 'inactive';

/**
 * Normalizes any package ID, friendly package title, or localized string
 * into a canonical database member tier compliant with members_tier_check.
 */
export function normalizeMemberTier(rawTier: string | null | undefined): CanonicalMemberTier {
  if (!rawTier) return "Full Playing";
  const lower = rawTier.toLowerCase().trim();
  if (lower.includes("patron") || lower.includes("honorary")) {
    return "Patron";
  }
  if (lower.includes("junior") || lower.includes("youth") || lower.includes("jugend") || lower.includes("kid")) {
    return "Junior";
  }
  if (
    lower.includes("family") ||
    lower.includes("familie") ||
    lower.includes("famille") ||
    lower.includes("social")
  ) {
    return "Social Member";
  }
  if (
    lower.includes("adult") ||
    lower.includes("erwachsene") ||
    lower.includes("adulte") ||
    lower.includes("playing") ||
    lower.includes("full")
  ) {
    return "Full Playing";
  }
  return "Full Playing";
}

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  handicapOrExperience: string | null;
  tier: MemberTier;
  status: MemberStatus;
  notes: string | null;
  createdAt: string;
}

export interface CreateMemberInput {
  fullName: string;
  email: string;
  phone: string;
  handicapOrExperience?: string;
  tier: MemberTier;
  status?: MemberStatus;
  notes?: string;
}

