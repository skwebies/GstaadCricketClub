export type MemberTier = 'Full Playing' | 'Social Member' | 'Junior' | 'Patron';
export type MemberStatus = 'active' | 'pending' | 'inactive';

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
