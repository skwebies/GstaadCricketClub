import type { IRegistrationRepository } from "@/core/domain/repositories/IRegistrationRepository";
import type { IEventRepository } from "@/core/domain/repositories/IEventRepository";
import type { IAuditRepository } from "@/core/domain/repositories/IAuditRepository";
import { RegistrationSchema, type RegistrationFormData } from "../validators/schemas";
import type { EventRegistration } from "@/core/domain/entities/Registration";

export class RegisterForEventUseCase {
  constructor(
    private registrationRepo: IRegistrationRepository,
    private eventRepo: IEventRepository,
    private auditRepo?: IAuditRepository
  ) {}

  async execute(input: RegistrationFormData, eventSlug: string = "gstaad-cricket-festival-2026"): Promise<EventRegistration> {
    const validated = RegistrationSchema.parse(input);

    const event = await this.eventRepo.findBySlug(eventSlug);
    if (!event) {
      throw new Error(`Event not found: ${eventSlug}`);
    }

    if (!event.isActive) {
      throw new Error("This event is currently closed for new registrations.");
    }

    const currentCount = await this.registrationRepo.countByEvent(event.id);
    if (currentCount >= event.maxParticipants) {
      throw new Error("This event has reached full capacity. Please contact the committee.");
    }

    const registration = await this.registrationRepo.create({
      eventId: event.id,
      fullName: validated.fullName,
      email: validated.email.toLowerCase().trim(),
      phone: validated.phone.trim(),
      registrationType: validated.registrationType,
      dietaryRequirements: validated.dietaryRequirements,
      emergencyContact: validated.emergencyContact,
    });

    if (this.auditRepo) {
      await this.auditRepo.record(
        "CREATE_REGISTRATION",
        "event_registrations",
        registration.id,
        {
          eventSlug,
          email: validated.email,
          partySize: validated.partySize,
        }
      );
    }

    return registration;
  }
}
