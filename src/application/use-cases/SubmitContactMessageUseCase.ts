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

    const message = await this.contactRepo.create({
      name: validated.name.trim(),
      email: validated.email.toLowerCase().trim(),
      subject: validated.subject.trim(),
      message: validated.message.trim(),
      ipHash,
    });

    if (this.auditRepo) {
      await this.auditRepo.record("SUBMIT_CONTACT_MESSAGE", "contact_messages", message.id, {
        email: validated.email,
        subject: validated.subject,
      });
    }

    return message;
  }
}
