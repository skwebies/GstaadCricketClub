import type { EventRegistration, CreateRegistrationInput } from "../entities/Registration";

export interface IRegistrationRepository {
  create(data: CreateRegistrationInput): Promise<EventRegistration>;
  findByEmailAndEvent(email: string, eventId: string): Promise<EventRegistration | null>;
  listByEvent(eventId: string): Promise<EventRegistration[]>;
  listAll(): Promise<EventRegistration[]>;
  countByEvent(eventId: string): Promise<number>;
  delete(id: string): Promise<boolean>;
}
