import type { IMemberRepository } from "@/core/domain/repositories/IMemberRepository";
import type { IAuditRepository } from "@/core/domain/repositories/IAuditRepository";
import { MemberApplicationSchema, type MemberApplicationFormData } from "../validators/schemas";
import { normalizeMemberTier, type Member, type MemberStatus, type MemberTier } from "@/core/domain/entities/Member";

export class ManageMembersUseCase {
  constructor(
    private memberRepo: IMemberRepository,
    private auditRepo?: IAuditRepository
  ) {}

  async apply(input: MemberApplicationFormData): Promise<Member> {
    const validated = MemberApplicationSchema.parse(input);
    const canonicalTier = normalizeMemberTier(validated.tier);

    const member = await this.memberRepo.create({
      fullName: validated.fullName.trim(),
      email: validated.email.toLowerCase().trim(),
      phone: validated.phone.trim(),
      tier: canonicalTier,
      handicapOrExperience: validated.handicapOrExperience,
      notes: validated.notes,
      status: "pending",
    });

    if (this.auditRepo) {
      await this.auditRepo.record("MEMBER_APPLICATION", "members", member.id, {
        email: validated.email,
        tier: canonicalTier,
      });
    }

    return member;
  }

  async updateStatus(id: string, status: MemberStatus, actorId?: string): Promise<Member> {
    const updated = await this.memberRepo.updateStatus(id, status);

    if (this.auditRepo) {
      await this.auditRepo.record("UPDATE_MEMBER_STATUS", "members", id, { status }, actorId);
    }

    return updated;
  }

  async list(filters?: { status?: MemberStatus; tier?: MemberTier; search?: string }): Promise<Member[]> {
    return this.memberRepo.list(filters);
  }
}
