export interface ClubEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateEventInput {
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  isActive?: boolean;
}
