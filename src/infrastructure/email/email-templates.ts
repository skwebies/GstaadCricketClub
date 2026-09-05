/**
 * @file email-templates.ts
 * @description Swiss luxury branded email templates for notifications and confirmation receipts.
 * Generates both responsive HTML and clean plain-text alternatives for maximum deliverability and anti-spam compliance.
 * @module infrastructure/email
 */

import { sanitizeHeader } from "@/infrastructure/security/anti-spam";

export interface RegistrationEmailData {
  fullName: string;
  email: string;
  phone?: string;
  registrationType: string;
  partySize: number;
  dietaryRequirements?: string;
  emergencyContact?: string;
  notes?: string;
}

export interface MembershipEmailData {
  fullName: string;
  email: string;
  phone: string;
  tier: string;
  handicapOrExperience?: string;
  notes?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  clientIp?: string;
}

const BRAND_COLORS = {
  greenDark: "#0A1C15",
  greenPrimary: "#0F382A",
  gold: "#C5A059",
  goldLight: "#F5EFE0",
  paper: "#FDFCF7",
  ink: "#1A2E26",
  muted: "#5A6E65",
  border: "#E2DDD2",
};

/**
 * Common HTML wrapper layout providing luxury alpine aesthetics.
 */
function wrapHtmlLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: ${BRAND_COLORS.paper};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: ${BRAND_COLORS.ink};
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: ${BRAND_COLORS.paper};
      padding: 40px 16px;
    }
    .main {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid ${BRAND_COLORS.border};
      border-top: 5px solid ${BRAND_COLORS.gold};
    }
    .header {
      background-color: ${BRAND_COLORS.greenPrimary};
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #FFFFFF;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 24px;
      letter-spacing: 0.05em;
      font-weight: normal;
    }
    .header p {
      margin: 6px 0 0;
      color: ${BRAND_COLORS.gold};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: bold;
    }
    .content {
      padding: 36px 32px;
      font-size: 15px;
      line-height: 1.6;
      color: ${BRAND_COLORS.ink};
    }
    .content h2 {
      margin: 0 0 16px;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 20px;
      color: ${BRAND_COLORS.greenPrimary};
      font-weight: normal;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      background-color: #FAFAF7;
      border: 1px solid ${BRAND_COLORS.border};
    }
    .info-table td {
      padding: 12px 16px;
      border-bottom: 1px solid ${BRAND_COLORS.border};
      font-size: 14px;
    }
    .info-table td.label {
      width: 35%;
      font-weight: 600;
      color: ${BRAND_COLORS.muted};
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
    }
    .info-table td.value {
      color: ${BRAND_COLORS.ink};
      font-weight: 500;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background-color: ${BRAND_COLORS.goldLight};
      color: ${BRAND_COLORS.greenDark};
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.05em;
    }
    .footer {
      background-color: #F7F6F2;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid ${BRAND_COLORS.border};
      font-size: 12px;
      color: ${BRAND_COLORS.muted};
      line-height: 1.5;
    }
    .footer a {
      color: ${BRAND_COLORS.greenPrimary};
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="header">
          <h1>Gstaad Cricket Club</h1>
          <p>Cricket for our Community &bull; Bernese Oberland</p>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${content}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <strong>Gstaad Cricket Club</strong><br>
          Ebnit School Pitch, 3780 Gstaad, Switzerland<br>
          <a href="https://gstaadcricketclub.ch">www.gstaadcricketclub.ch</a> &bull; info@gstaadcricketclub.ch
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

// ============================================================================
// 1. Festival Registration Templates
// ============================================================================

export function renderRegistrationAdminEmail(data: RegistrationEmailData) {
  const subject = `[GCC Festival] New Registration: ${sanitizeHeader(data.fullName)} (${data.partySize} person${data.partySize > 1 ? "s" : ""})`;

  const content = `
    <h2>New Festival Registration Received</h2>
    <p>A new reservation has been submitted through the club website for the Gstaad Cricket Festival 2026.</p>
    
    <table class="info-table" role="presentation">
      <tr>
        <td class="label">Full Name</td>
        <td class="value"><strong>${escapeHtml(data.fullName)}</strong></td>
      </tr>
      <tr>
        <td class="label">Email Address</td>
        <td class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td class="label">Phone</td>
        <td class="value">${escapeHtml(data.phone || "Not provided")}</td>
      </tr>
      <tr>
        <td class="label">Participant Type</td>
        <td class="value"><span class="badge">${escapeHtml(data.registrationType)}</span></td>
      </tr>
      <tr>
        <td class="label">Party Size</td>
        <td class="value"><strong>${data.partySize}</strong></td>
      </tr>
      ${data.emergencyContact ? `
      <tr>
        <td class="label">Emergency Contact</td>
        <td class="value">${escapeHtml(data.emergencyContact)}</td>
      </tr>` : ""}
      ${data.dietaryRequirements ? `
      <tr>
        <td class="label">Notes / Dietary</td>
        <td class="value">${escapeHtml(data.dietaryRequirements)}</td>
      </tr>` : ""}
      <tr>
        <td class="label">Date &amp; Time</td>
        <td class="value">${new Date().toUTCString()}</td>
      </tr>
    </table>

    <p style="margin-top: 24px; font-size: 13px; color: ${BRAND_COLORS.muted};">
      This entry has been recorded in the Supabase production database and is visible in the Admin Portal.
    </p>
  `;

  const text = `GSTAAD CRICKET CLUB - NEW FESTIVAL REGISTRATION

A new reservation has been placed on the website:

- Full Name: ${data.fullName}
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}
- Registration Type: ${data.registrationType}
- Party Size: ${data.partySize}
${data.emergencyContact ? `- Emergency Contact: ${data.emergencyContact}\n` : ""}${data.dietaryRequirements ? `- Notes / Dietary: ${data.dietaryRequirements}\n` : ""}
- Received: ${new Date().toUTCString()}

Admin Portal: https://gstaadcricketclub.ch/admin
`;

  return { subject, html: wrapHtmlLayout(subject, content), text };
}

export function renderRegistrationUserConfirmation(data: RegistrationEmailData) {
  const subject = "Your Reservation Confirmation - Gstaad Cricket Festival 2026";

  const content = `
    <h2>Dear ${escapeHtml(data.fullName)},</h2>
    <p>
      Thank you for registering for the <strong>Gstaad Cricket Festival 2026</strong>. We are delighted to confirm that your reservation has been received.
    </p>
    
    <table class="info-table" role="presentation">
      <tr>
        <td class="label">Event</td>
        <td class="value">Gstaad Cricket Festival 2026</td>
      </tr>
      <tr>
        <td class="label">Location</td>
        <td class="value">Ebnit School Pitch, 3780 Gstaad, Switzerland</td>
      </tr>
      <tr>
        <td class="label">Registration Type</td>
        <td class="value"><span class="badge">${escapeHtml(data.registrationType)}</span></td>
      </tr>
      <tr>
        <td class="label">Party Size</td>
        <td class="value"><strong>${data.partySize}</strong> attendee${data.partySize > 1 ? "s" : ""}</td>
      </tr>
      ${data.dietaryRequirements ? `
      <tr>
        <td class="label">Your Notes</td>
        <td class="value">${escapeHtml(data.dietaryRequirements)}</td>
      </tr>` : ""}
    </table>

    <p>
      We will send match schedules, parking details, and hospitality timings as the festival weekend approaches. If you have any questions or require modifications to your party size, please reply directly to this email or reach us at <a href="mailto:info@gstaadcricketclub.ch">info@gstaadcricketclub.ch</a>.
    </p>

    <p style="margin-top: 32px;">
      Warm regards,<br>
      <strong>The Committee</strong><br>
      Gstaad Cricket Club
    </p>
  `;

  const text = `DEAR ${data.fullName.toUpperCase()},

Thank you for registering for the Gstaad Cricket Festival 2026! We are delighted to confirm that your reservation has been received.

Reservation Summary:
- Event: Gstaad Cricket Festival 2026
- Location: Ebnit School Pitch, 3780 Gstaad, Switzerland
- Participant Type: ${data.registrationType}
- Party Size: ${data.partySize}
${data.dietaryRequirements ? `- Notes: ${data.dietaryRequirements}\n` : ""}

We will contact you with further details and schedule information closer to the date.

Warm regards,
Gstaad Cricket Club Committee
info@gstaadcricketclub.ch
https://gstaadcricketclub.ch
`;

  return { subject, html: wrapHtmlLayout(subject, content), text };
}

// ============================================================================
// 2. Membership Application Templates
// ============================================================================

export function renderMembershipAdminEmail(data: MembershipEmailData) {
  const subject = `[GCC Membership] New Application: ${sanitizeHeader(data.fullName)} (${sanitizeHeader(data.tier)})`;

  const content = `
    <h2>New Membership Application</h2>
    <p>A new membership application has been submitted via the club website.</p>
    
    <table class="info-table" role="presentation">
      <tr>
        <td class="label">Applicant Name</td>
        <td class="value"><strong>${escapeHtml(data.fullName)}</strong></td>
      </tr>
      <tr>
        <td class="label">Email Address</td>
        <td class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td class="label">Phone</td>
        <td class="value">${escapeHtml(data.phone)}</td>
      </tr>
      <tr>
        <td class="label">Requested Tier</td>
        <td class="value"><span class="badge">${escapeHtml(data.tier)}</span></td>
      </tr>
      ${data.handicapOrExperience ? `
      <tr>
        <td class="label">Experience / Level</td>
        <td class="value">${escapeHtml(data.handicapOrExperience)}</td>
      </tr>` : ""}
      ${data.notes ? `
      <tr>
        <td class="label">Applicant Notes</td>
        <td class="value">${escapeHtml(data.notes)}</td>
      </tr>` : ""}
      <tr>
        <td class="label">Submitted</td>
        <td class="value">${new Date().toUTCString()}</td>
      </tr>
    </table>

    <p style="margin-top: 24px; font-size: 13px; color: ${BRAND_COLORS.muted};">
      Please review and approve or reject this applicant in the Club Administration Portal.
    </p>
  `;

  const text = `GSTAAD CRICKET CLUB - NEW MEMBERSHIP APPLICATION

An application for club membership has been submitted:

- Applicant: ${data.fullName}
- Email: ${data.email}
- Phone: ${data.phone}
- Tier: ${data.tier}
${data.handicapOrExperience ? `- Experience: ${data.handicapOrExperience}\n` : ""}${data.notes ? `- Notes: ${data.notes}\n` : ""}
- Submitted: ${new Date().toUTCString()}

Admin Portal: https://gstaadcricketclub.ch/admin
`;

  return { subject, html: wrapHtmlLayout(subject, content), text };
}

export function renderMembershipUserConfirmation(data: MembershipEmailData) {
  const subject = "Gstaad Cricket Club - Membership Application Received";

  const content = `
    <h2>Dear ${escapeHtml(data.fullName)},</h2>
    <p>
      Thank you for applying for membership with <strong>Gstaad Cricket Club</strong>. We are thrilled by your enthusiasm for cricket in the Saanenland.
    </p>
    
    <table class="info-table" role="presentation">
      <tr>
        <td class="label">Requested Category</td>
        <td class="value"><strong>${escapeHtml(data.tier)}</strong></td>
      </tr>
      <tr>
        <td class="label">Contact Email</td>
        <td class="value">${escapeHtml(data.email)}</td>
      </tr>
      <tr>
        <td class="label">Contact Phone</td>
        <td class="value">${escapeHtml(data.phone)}</td>
      </tr>
      <tr>
        <td class="label">Status</td>
        <td class="value"><span class="badge">Under Committee Review</span></td>
      </tr>
    </table>

    <p>
      Our Honorary Secretary and Membership Committee review all applications and will be in touch shortly regarding registration details, fixture dates, and club welcome arrangements.
    </p>

    <p style="margin-top: 32px;">
      Yours in cricket,<br>
      <strong>The Committee</strong><br>
      Gstaad Cricket Club
    </p>
  `;

  const text = `DEAR ${data.fullName.toUpperCase()},

Thank you for applying for membership with Gstaad Cricket Club (${data.tier}).

We have received your details and our committee is reviewing your application. A committee member will contact you shortly with next steps and club information.

Kind regards,
Gstaad Cricket Club Committee
info@gstaadcricketclub.ch
https://gstaadcricketclub.ch
`;

  return { subject, html: wrapHtmlLayout(subject, content), text };
}

// ============================================================================
// 3. Contact Inquiry Templates
// ============================================================================

export function renderContactAdminEmail(data: ContactEmailData) {
  const subject = `[GCC Inquiry] ${sanitizeHeader(data.subject)} - from ${sanitizeHeader(data.name)}`;

  const content = `
    <h2>New Website Inquiry</h2>
    <p>A message has been submitted via the contact form on the club website.</p>
    
    <table class="info-table" role="presentation">
      <tr>
        <td class="label">Sender Name</td>
        <td class="value"><strong>${escapeHtml(data.name)}</strong></td>
      </tr>
      <tr>
        <td class="label">Sender Email</td>
        <td class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td class="label">Subject</td>
        <td class="value"><strong>${escapeHtml(data.subject)}</strong></td>
      </tr>
      ${data.clientIp ? `
      <tr>
        <td class="label">Sender IP</td>
        <td class="value" style="font-family: monospace; font-size: 12px;">${escapeHtml(data.clientIp)}</td>
      </tr>` : ""}
      <tr>
        <td class="label">Date Received</td>
        <td class="value">${new Date().toUTCString()}</td>
      </tr>
    </table>

    <h3 style="font-family: Georgia, serif; font-size: 16px; color: ${BRAND_COLORS.greenPrimary}; margin-top: 24px;">Message:</h3>
    <div style="background-color: #F8F7F4; border-left: 4px solid ${BRAND_COLORS.gold}; padding: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">
${escapeHtml(data.message)}
    </div>

    <p style="margin-top: 24px; font-size: 13px; color: ${BRAND_COLORS.muted};">
      Tip: You can hit <strong>Reply</strong> directly in your email client to respond to ${escapeHtml(data.name)}.
    </p>
  `;

  const text = `GSTAAD CRICKET CLUB - NEW INQUIRY

Sender: ${data.name} <${data.email}>
Subject: ${data.subject}
Date: ${new Date().toUTCString()}
${data.clientIp ? `IP: ${data.clientIp}\n` : ""}
Message:
${data.message}

Reply directly to this email to contact the sender.
`;

  return { subject, html: wrapHtmlLayout(subject, content), text };
}

export function renderContactUserConfirmation(data: ContactEmailData) {
  const subject = "We have received your message - Gstaad Cricket Club";

  const content = `
    <h2>Dear ${escapeHtml(data.name)},</h2>
    <p>
      Thank you for contacting <strong>Gstaad Cricket Club</strong>. We have safely received your inquiry regarding "<em>${escapeHtml(data.subject)}</em>".
    </p>
    
    <div style="background-color: #F8F7F4; border-left: 4px solid ${BRAND_COLORS.gold}; padding: 16px; margin: 20px 0; font-size: 14px; line-height: 1.6;">
      <strong style="color: ${BRAND_COLORS.greenPrimary}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">Your Message:</strong>
      <div style="white-space: pre-wrap;">${escapeHtml(data.message)}</div>
    </div>

    <p>
      A member of our committee will review your message and reply promptly. If your matter is urgent, you can reach us directly at <a href="mailto:info@gstaadcricketclub.ch">info@gstaadcricketclub.ch</a>.
    </p>

    <p style="margin-top: 32px;">
      Warm regards,<br>
      <strong>The Committee</strong><br>
      Gstaad Cricket Club
    </p>
  `;

  const text = `DEAR ${data.name.toUpperCase()},

Thank you for contacting Gstaad Cricket Club. We have received your inquiry:

Subject: ${data.subject}
Your Message:
${data.message}

A member of our committee will review your message and reply promptly.

Kind regards,
Gstaad Cricket Club
info@gstaadcricketclub.ch
https://gstaadcricketclub.ch
`;

  return { subject, html: wrapHtmlLayout(subject, content), text };
}

/**
 * Basic HTML entity escaping to prevent XSS in email clients.
 */
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
