import type { Member, CreateMemberInput, MemberStatus, MemberTier } from "../entities/Member";

export interface IMemberRepository {
  create(data: CreateMemberInput): Promise<Member>;
  findById(id: string): Promise<Member | null>;
  findByEmail(email: string): Promise<Member | null>;
  list(filters?: { status?: MemberStatus; tier?: MemberTier; search?: string }): Promise<Member[]>;
  updateStatus(id: string, status: MemberStatus): Promise<Member>;
  count(): Promise<number>;
  delete(id: string): Promise<boolean>;
}
