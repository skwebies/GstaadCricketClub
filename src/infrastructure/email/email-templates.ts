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
  const subject = `[GCC Festival] New Registration: ${sanitizeHeader(data.fullName)} (${data.partySize} attendee${data.partySize > 1 ? "s" : ""})`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: ${BRAND_COLORS.goldLight}; color: ${BRAND_COLORS.greenDark}; padding: 6px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border: 1px solid ${BRAND_COLORS.gold};">
        Festival Attendee Reservation
      </span>
      <h2 style="margin: 14px 0 6px; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: ${BRAND_COLORS.greenPrimary};">
        New Festival Registration
      </h2>
      <p style="margin: 0; font-size: 13px; color: ${BRAND_COLORS.muted};">
        Gstaad Cricket Festival 2026 &bull; Saturday, 26 September 2026
      </p>
    </div>

    <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
      A new registration has been received via the website. Details of the reservation are recorded below:
    </p>
    
    <table class="info-table" role="presentation">
      <tr>
        <td class="label">Full Name</td>
        <td class="value"><strong style="font-size: 15px; color: ${BRAND_COLORS.greenPrimary};">${escapeHtml(data.fullName)}</strong></td>
      </tr>
      <tr>
        <td class="label">Email Address</td>
        <td class="value"><a href="mailto:${escapeHtml(data.email)}" style="color: ${BRAND_COLORS.greenPrimary}; font-weight: 600; text-decoration: underline;">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td class="label">Phone Number</td>
        <td class="value">
          ${data.phone ? `<a href="tel:${escapeHtml(data.phone)}" style="color: ${BRAND_COLORS.ink}; text-decoration: none;">${escapeHtml(data.phone)}</a>` : '<span style="color: #999;">Not provided</span>'}
        </td>
      </tr>
      <tr>
        <td class="label">Category</td>
        <td class="value"><span class="badge">${escapeHtml(data.registrationType)}</span></td>
      </tr>
      <tr>
        <td class="label">Number Attending</td>
        <td class="value"><strong style="font-size: 15px;">${data.partySize} ${data.partySize > 1 ? "Attendees" : "Attendee"}</strong></td>
      </tr>
      ${data.dietaryRequirements ? `
      <tr>
        <td class="label">Notes / Requests</td>
        <td class="value" style="background-color: #FFFDF5; font-style: italic;">${escapeHtml(data.dietaryRequirements)}</td>
      </tr>` : ""}
      ${data.emergencyContact && data.emergencyContact !== data.phone ? `
      <tr>
        <td class="label">Emergency Contact</td>
        <td class="value">${escapeHtml(data.emergencyContact)}</td>
      </tr>` : ""}
      <tr>
        <td class="label">Submission Date</td>
        <td class="value" style="font-size: 12px; color: ${BRAND_COLORS.muted};">${new Date().toUTCString()}</td>
      </tr>
    </table>

    <div style="margin: 28px 0; padding: 16px; background-color: #F8F7F2; border-left: 3px solid ${BRAND_COLORS.gold}; font-size: 13px; line-height: 1.5; color: ${BRAND_COLORS.muted};">
      <strong style="color: ${BRAND_COLORS.ink}; display: block; margin-bottom: 4px;">Quick Actions:</strong>
      &bull; <a href="mailto:${escapeHtml(data.email)}?subject=Gstaad%20Cricket%20Festival%202026" style="color: ${BRAND_COLORS.greenPrimary};">Reply via Email</a> &nbsp;|&nbsp;
      ${data.phone ? `&bull; <a href="tel:${escapeHtml(data.phone)}" style="color: ${BRAND_COLORS.greenPrimary};">Call ${escapeHtml(data.fullName)}</a> &nbsp;|&nbsp;` : ""}
      &bull; <a href="https://gstaadcricketclub.ch/admin" style="color: ${BRAND_COLORS.greenPrimary};">View in Admin Portal</a>
    </div>
  `;

  const text = `GSTAAD CRICKET CLUB - NEW FESTIVAL REGISTRATION

A new reservation has been placed on the website for the Gstaad Cricket Festival 2026:

- Full Name: ${data.fullName}
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}
- Registration Category: ${data.registrationType}
- Number Attending: ${data.partySize}
${data.dietaryRequirements ? `- Anything we should know? / Notes: ${data.dietaryRequirements}\n` : ""}${data.emergencyContact ? `- Emergency Contact: ${data.emergencyContact}\n` : ""}
- Submission Date: ${new Date().toUTCString()}

Manage Registrations: https://gstaadcricketclub.ch/admin
`;

  return { subject, html: wrapHtmlLayout(subject, content), text };
}

export function renderRegistrationUserConfirmation(data: RegistrationEmailData) {
  const subject = "Reservation Confirmation: Gstaad Cricket Festival 2026";

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: ${BRAND_COLORS.goldLight}; color: ${BRAND_COLORS.greenDark}; padding: 6px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border: 1px solid ${BRAND_COLORS.gold};">
        Reservation Confirmed
      </span>
      <h2 style="margin: 14px 0 6px; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: ${BRAND_COLORS.greenPrimary};">
        Welcome to Gstaad Cricket
      </h2>
      <p style="margin: 0; font-size: 13px; color: ${BRAND_COLORS.muted};">
        Saturday, 26 September 2026 &bull; Ebnit School, Gstaad
      </p>
    </div>

    <p style="font-size: 15px; line-height: 1.6;">
      Dear <strong>${escapeHtml(data.fullName)}</strong>,
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: ${BRAND_COLORS.ink};">
      Thank you for registering for the <strong>Gstaad Cricket Festival 2026</strong>. We are delighted to confirm that your reservation has been safely recorded.
    </p>
    
    <table class="info-table" role="presentation">
      <tr>
        <td class="label">Event</td>
        <td class="value"><strong style="color: ${BRAND_COLORS.greenPrimary};">Gstaad Cricket Festival 2026</strong></td>
      </tr>
      <tr>
        <td class="label">Date &amp; Time</td>
        <td class="value"><strong>Saturday, 26 September 2026</strong><br><span style="font-size: 13px; color: ${BRAND_COLORS.muted};">From 11:00 CEST onwards</span></td>
      </tr>
      <tr>
        <td class="label">Venue</td>
        <td class="value">
          <strong>Ebnit School Pitch (Schulhaus Ebnit)</strong><br>
          <span style="font-size: 13px; color: ${BRAND_COLORS.muted};">Ebnitstrasse 28, 3780 Gstaad, Switzerland</span>
        </td>
      </tr>
      <tr>
        <td class="label">Registration Category</td>
        <td class="value"><span class="badge">${escapeHtml(data.registrationType)}</span></td>
      </tr>
      <tr>
        <td class="label">Number Attending</td>
        <td class="value"><strong>${data.partySize} ${data.partySize > 1 ? "people" : "person"}</strong></td>
      </tr>
      ${data.phone ? `
      <tr>
        <td class="label">Contact Phone</td>
        <td class="value">${escapeHtml(data.phone)}</td>
      </tr>` : ""}
      ${data.dietaryRequirements ? `
      <tr>
        <td class="label">Your Notes</td>
        <td class="value" style="font-style: italic;">${escapeHtml(data.dietaryRequirements)}</td>
      </tr>` : ""}
      <tr>
        <td class="label">Admission</td>
        <td class="value"><strong style="color: ${BRAND_COLORS.greenPrimary};">Free of Charge</strong> (Cricket for our Community)</td>
      </tr>
    </table>

    <div style="margin: 24px 0; padding: 18px 20px; background-color: #FAFAF7; border: 1px solid ${BRAND_COLORS.border};">
      <h3 style="margin: 0 0 10px; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; color: ${BRAND_COLORS.greenPrimary};">
        What to Expect on Festival Day
      </h3>
      <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.7; color: ${BRAND_COLORS.ink};">
        <li><strong>Open to all skill levels:</strong> Complete beginners, children, adults, and curious onlookers are all warmly welcomed.</li>
        <li><strong>All equipment provided:</strong> Bats, soft safety balls, and coaching will be made available by the club.</li>
        <li><strong>Refreshments:</strong> Refreshments, tea, and local hospitality will be served throughout the day.</li>
        <li><strong>Dress code:</strong> Comfortable trainers or sport shoes and relaxed casual attire suited to an outdoor lawn pitch.</li>
      </ul>
    </div>

    <p style="font-size: 14px; line-height: 1.6;">
      Closer to the date, we will share the final schedule of activities, parking advice, and weather updates. If your party size changes or if you have any questions, please reply directly to this email or write to <a href="mailto:info@gstaadcricketclub.ch" style="color: ${BRAND_COLORS.greenPrimary}; font-weight: 600;">info@gstaadcricketclub.ch</a>.
    </p>

    <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid ${BRAND_COLORS.border};">
      <p style="margin: 0; font-size: 14px; line-height: 1.5;">
        Warm alpine regards,<br>
        <strong style="color: ${BRAND_COLORS.greenPrimary}; font-size: 15px;">The Committee &amp; Founding Members</strong><br>
        Gstaad Cricket Club &bull; Bernese Oberland
      </p>
    </div>
  `;

  const text = `GSTAAD CRICKET FESTIVAL 2026 - RESERVATION CONFIRMED

DEAR ${data.fullName.toUpperCase()},

Thank you for registering for the Gstaad Cricket Festival 2026! We are delighted to confirm that your reservation has been safely recorded.

RESERVATION SUMMARY:
- Event: Gstaad Cricket Festival 2026
- Date: Saturday, 26 September 2026
- Time: 11:00 CEST onwards
- Venue: Ebnit School Pitch, Ebnitstrasse 28, 3780 Gstaad, Switzerland
- Category: ${data.registrationType}
- Number Attending: ${data.partySize}
${data.phone ? `- Contact Phone: ${data.phone}\n` : ""}${data.dietaryRequirements ? `- Your Notes / Requests: ${data.dietaryRequirements}\n` : ""}- Admission: Free of Charge

FESTIVAL DAY DETAILS:
- Complete beginners, families, and children are all welcome.
- All cricket equipment is provided by the club.
- Refreshments and hospitality will be available throughout the day.
- Wear comfortable trainers or athletic footwear.

If you have any questions or need to modify your reservation, reply to this email or reach us at info@gstaadcricketclub.ch.

Warm alpine regards,
The Committee & Founding Members
Gstaad Cricket Club
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
