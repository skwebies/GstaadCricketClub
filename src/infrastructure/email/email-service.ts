/**
 * @file email-service.ts
 * @description High-level email service handling dual-dispatch (Admin Notification + User Confirmation)
 * with graceful error recovery so database submissions are never blocked by network/SMTP hiccups.
 * @module infrastructure/email
 */

import { dispatchEmail, getSmtpConfig } from "./smtp-client";
import {
  renderRegistrationAdminEmail,
  renderRegistrationUserConfirmation,
  renderMembershipAdminEmail,
  renderMembershipUserConfirmation,
  renderContactAdminEmail,
  renderContactUserConfirmation,
  type RegistrationEmailData,
  type MembershipEmailData,
  type ContactEmailData,
} from "./email-templates";

export class EmailService {
  /**
   * Dispatches Festival registration notification to admin and confirmation to registrant.
   */
  public static async sendRegistrationEmails(data: RegistrationEmailData): Promise<void> {
    const config = getSmtpConfig();
    const adminTemplate = renderRegistrationAdminEmail(data);
    const userTemplate = renderRegistrationUserConfirmation(data);

    try {
      await Promise.allSettled([
        // 1. Admin notification to info@gstaadcricketclub.ch
        dispatchEmail({
          to: config.adminRecipient,
          subject: adminTemplate.subject,
          html: adminTemplate.html,
          text: adminTemplate.text,
          replyTo: data.email,
        }),
        // 2. Registrant receipt confirmation
        dispatchEmail({
          to: data.email,
          subject: userTemplate.subject,
          html: userTemplate.html,
          text: userTemplate.text,
        }),
      ]);
    } catch (err: unknown) {
      console.error("[EmailService] Failed to complete registration email dispatch:", err);
    }
  }

  /**
   * Dispatches Membership application notification to admin and confirmation to applicant.
   */
  public static async sendMembershipEmails(data: MembershipEmailData): Promise<void> {
    const config = getSmtpConfig();
    const adminTemplate = renderMembershipAdminEmail(data);
    const userTemplate = renderMembershipUserConfirmation(data);

    try {
      await Promise.allSettled([
        // 1. Admin notification to info@gstaadcricketclub.ch
        dispatchEmail({
          to: config.adminRecipient,
          subject: adminTemplate.subject,
          html: adminTemplate.html,
          text: adminTemplate.text,
          replyTo: data.email,
        }),
        // 2. Applicant confirmation
        dispatchEmail({
          to: data.email,
          subject: userTemplate.subject,
          html: userTemplate.html,
          text: userTemplate.text,
        }),
      ]);
    } catch (err: unknown) {
      console.error("[EmailService] Failed to complete membership email dispatch:", err);
    }
  }

  /**
   * Dispatches Contact inquiry notification to admin and confirmation to sender.
   */
  public static async sendContactEmails(data: ContactEmailData): Promise<void> {
    const config = getSmtpConfig();
    const adminTemplate = renderContactAdminEmail(data);
    const userTemplate = renderContactUserConfirmation(data);

    try {
      await Promise.allSettled([
        // 1. Admin notification to info@gstaadcricketclub.ch with replyTo set to sender
        dispatchEmail({
          to: config.adminRecipient,
          subject: adminTemplate.subject,
          html: adminTemplate.html,
          text: adminTemplate.text,
          replyTo: `"${data.name}" <${data.email}>`,
        }),
        // 2. Sender receipt confirmation
        dispatchEmail({
          to: data.email,
          subject: userTemplate.subject,
          html: userTemplate.html,
          text: userTemplate.text,
        }),
      ]);
    } catch (err: unknown) {
      console.error("[EmailService] Failed to complete contact inquiry email dispatch:", err);
    }
  }
}
