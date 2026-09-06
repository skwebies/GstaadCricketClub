import type { IContactRepository } from "@/core/domain/repositories/IContactRepository";
import type { IAuditRepository } from "@/core/domain/repositories/IAuditRepository";
import { ContactMessageSchema, type ContactMessageFormData } from "../validators/schemas";
import type { ContactMessage } from "@/core/domain/entities/ContactMessage";

export class SubmitContactMessageUseCase {
  constructor(
    private contactRepo: IContactRepository,
    private auditRepo?: IAuditRepository
  ) {}

  async execute(input: ContactMessageFormData, ipHash?: string): Promise<ContactMessage> {
    const validated = ContactMessageSchema.parse(input);

    let prefix = "";
    if (validated.inquiryType === "sponsor" && !validated.subject.toLowerCase().includes("sponsor")) {
      prefix = "[Sponsorship] ";
    } else if (validated.inquiryType === "donor" && !validated.subject.toLowerCase().includes("donor")) {
      prefix = "[Community Donor] ";
    } else if (validated.inquiryType === "membership" && !validated.subject.toLowerCase().includes("membership")) {
      prefix = "[Membership] ";
    }

    const finalSubject = `${prefix}${validated.subject.trim()}`.slice(0, 150);

    const metadataPrefixes: string[] = [];
    if (validated.inquiryType && validated.inquiryType !== "general") {
      const typeMap: Record<string, string> = {
        sponsor: "Founding Sponsorship & Partnership",
        donor: "Community Donation & Patronage",
        membership: "Membership & Youth Cricket",
        other: "Other Inquiry",
      };
      metadataPrefixes.push(`Category: ${typeMap[validated.inquiryType] || validated.inquiryType}`);
    }
    if (validated.organization?.trim()) {
      metadataPrefixes.push(`Organisation: ${validated.organization.trim()}`);
    }
    if (validated.membershipPackage?.trim()) {
      const pkgMap: Record<string, string> = {
        adult: "Adult Package (CHF 100 / year)",
        family: "Family Package (CHF 200 / year)",
        junior: "Junior Package (CHF 50 / year)",
      };
      const pkgFormatted =
        pkgMap[validated.membershipPackage.toLowerCase()] || validated.membershipPackage.trim();
      metadataPrefixes.push(`Selected Membership Package: ${pkgFormatted}`);
    }
    if (validated.phone?.trim()) {
      metadataPrefixes.push(`Phone: ${validated.phone.trim()}`);
    }

    const finalMessage = metadataPrefixes.length > 0
      ? `${metadataPrefixes.join("\n")}\n\n---\n\n${validated.message.trim()}`
      : validated.message.trim();

    const message = await this.contactRepo.create({
      name: validated.name.trim(),
      email: validated.email.toLowerCase().trim(),
      subject: finalSubject,
      message: finalMessage,
      ipHash,
    });

    if (this.auditRepo) {
      await this.auditRepo.record("SUBMIT_CONTACT_MESSAGE", "contact_messages", message.id, {
        email: validated.email,
        subject: finalSubject,
        inquiryType: validated.inquiryType,
        membershipPackage: validated.membershipPackage,
        organization: validated.organization,
        phone: validated.phone,
      });
    }

    return message;
  }
}
