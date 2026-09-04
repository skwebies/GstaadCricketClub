export type RegistrationType = 'playing_member' | 'spectator' | 'vip_patron';

export interface EventRegistration {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  registrationType: RegistrationType;
  dietaryRequirements: string | null;
  emergencyContact: string;
  createdAt: string;
}

export interface CreateRegistrationInput {
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  registrationType: RegistrationType;
  dietaryRequirements?: string;
  emergencyContact: string;
}
