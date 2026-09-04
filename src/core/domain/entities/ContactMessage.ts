export type InquiryStatus = 'unread' | 'read' | 'responded';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  ipHash: string | null;
  createdAt: string;
}

export interface CreateContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipHash?: string;
}
