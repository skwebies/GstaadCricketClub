import type { ContactMessage, CreateContactMessageInput, InquiryStatus } from "../entities/ContactMessage";

export interface IContactRepository {
  create(data: CreateContactMessageInput): Promise<ContactMessage>;
  list(status?: InquiryStatus): Promise<ContactMessage[]>;
  updateStatus(id: string, status: InquiryStatus): Promise<ContactMessage>;
  countUnread(): Promise<number>;
  delete(id: string): Promise<boolean>;
}
