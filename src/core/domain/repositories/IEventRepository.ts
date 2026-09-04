import type { ClubEvent, CreateEventInput } from "../entities/Event";

export interface IEventRepository {
  create(data: CreateEventInput): Promise<ClubEvent>;
  findBySlug(slug: string): Promise<ClubEvent | null>;
  findById(id: string): Promise<ClubEvent | null>;
  listActive(): Promise<ClubEvent[]>;
  listAll(): Promise<ClubEvent[]>;
  update(id: string, updates: Partial<CreateEventInput>): Promise<ClubEvent>;
  toggleActive(id: string, isActive: boolean): Promise<ClubEvent>;
}
