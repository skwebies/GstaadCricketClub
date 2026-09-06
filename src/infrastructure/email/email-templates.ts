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
  inquiryType?: string;
  membershipPackage?: string;
  phone?: string;
  organization?: string;
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

export const DEFAULT_SITE_URL = "https://gstaadcricketclub.ch";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : DEFAULT_SITE_URL;
export const LOGO_URL = `${DEFAULT_SITE_URL}/gstaad-cricket-club-crest.png`;

/**
 * Common HTML wrapper layout providing luxury alpine aesthetics with official crest logo.
 */
export function wrapHtmlLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: ${BRAND_COLORS.paper};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: ${BRAND_COLORS.ink};
      -webkit-font-smoothing: antialiased;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
      -ms-interpolation-mode: bicubic;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: ${BRAND_COLORS.paper};
      padding: 36px 12px;
    }
    .main {
      max-width: 620px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid ${BRAND_COLORS.border};
      border-top: 5px solid ${BRAND_COLORS.gold};
      box-shadow: 0 10px 30px rgba(10, 28, 21, 0.06);
    }
    .header {
      background-color: ${BRAND_COLORS.greenDark};
      background: linear-gradient(180deg, #071510 0%, #0F382A 100%);
      padding: 34px 24px 28px;
      text-align: center;
      border-bottom: 2px solid ${BRAND_COLORS.gold};
    }
    .content {
      padding: 36px 32px;
      font-size: 15px;
      line-height: 1.65;
      color: ${BRAND_COLORS.ink};
    }
    .content h2 {
      margin: 0 0 16px;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 21px;
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
      padding: 13px 18px;
      border-bottom: 1px solid ${BRAND_COLORS.border};
      font-size: 14px;
      vertical-align: middle;
    }
    .info-table td.label {
      width: 34%;
      font-weight: 700;
      color: ${BRAND_COLORS.muted};
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.06em;
      background-color: #F6F4EE;
    }
    .info-table td.value {
      color: ${BRAND_COLORS.ink};
      font-weight: 500;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: ${BRAND_COLORS.goldLight};
      color: ${BRAND_COLORS.greenDark};
      font-weight: 700;
      font-size: 11.5px;
      letter-spacing: 0.06em;
      border: 1px solid ${BRAND_COLORS.gold};
      text-transform: uppercase;
    }
    .footer {
      background-color: #F8F7F2;
      padding: 26px 32px 28px;
      text-align: center;
      border-top: 1px solid ${BRAND_COLORS.border};
      font-size: 12px;
      color: ${BRAND_COLORS.muted};
      line-height: 1.6;
    }
    .footer a {
      color: ${BRAND_COLORS.greenPrimary};
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px 18px !important;
      }
      .info-table td {
        padding: 10px 12px !important;
        font-size: 13px !important;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="header" align="center">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; text-align: center;">
            <tr>
              <td align="center" style="padding-bottom: 14px;">
                <a href="${SITE_URL}" target="_blank" style="text-decoration: none; display: inline-block;">
                  <img src="${LOGO_URL}" alt="Gstaad Cricket Club Crest" width="92" height="92" style="display: block; width: 92px; height: 92px; max-width: 92px; margin: 0 auto; border-radius: 50%; border: 2px solid ${BRAND_COLORS.gold}; background-color: #0A1C15; padding: 2px;" border="0" />
                </a>
              </td>
            </tr>
            <tr>
              <td align="center">
                <h1 style="margin: 0; color: #FFFFFF; font-family: Georgia, 'Times New Roman', serif; font-size: 23px; line-height: 1.25; letter-spacing: 0.06em; font-weight: normal; text-transform: uppercase;">
                  Gstaad Cricket Club
                </h1>
                <p style="margin: 8px 0 0; color: ${BRAND_COLORS.gold}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.22em; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  Cricket for our Community &bull; Bernese Oberland
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${content}
        </td>
      </tr>
      <tr>
        <td class="footer" align="center">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto 12px auto; text-align: center;">
            <tr>
              <td align="center">
                <a href="${SITE_URL}" target="_blank" style="text-decoration: none;">
                  <img src="${LOGO_URL}" alt="GCC Logo" width="42" height="42" style="display: block; width: 42px; height: 42px; margin: 0 auto; border-radius: 50%; border: 1px solid ${BRAND_COLORS.gold}; opacity: 0.9;" border="0" />
                </a>
              </td>
            </tr>
          </table>
          <strong style="color: ${BRAND_COLORS.greenDark}; font-size: 13px; letter-spacing: 0.04em;">Gstaad Cricket Club</strong><br>
          OSZ Ebnit Gstaad, Rumpleregässli 8, 3780 Gstaad, Switzerland<br>
          <span style="font-size: 12px;">
            <a href="${SITE_URL}" target="_blank" style="color: ${BRAND_COLORS.greenPrimary}; text-decoration: underline; font-weight: 600;">www.gstaadcricketclub.ch</a>
            &nbsp;&bull;&nbsp;
            <a href="mailto:info@gstaadcricketclub.ch" style="color: ${BRAND_COLORS.greenPrimary}; text-decoration: none; font-weight: 600;">info@gstaadcricketclub.ch</a>
          </span>
          <p style="margin: 12px 0 0; font-size: 10.5px; color: #8A9890; text-transform: uppercase; letter-spacing: 0.08em;">
            Swiss Non-Profit Sports Club &bull; Saanenland &bull; Bernese Alps
          </p>
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
  const subject = `[GCC Festival] New Reservation: ${sanitizeHeader(data.fullName)} (${data.partySize} attendee${data.partySize > 1 ? "s" : ""})`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: ${BRAND_COLORS.goldLight}; color: ${BRAND_COLORS.greenDark}; padding: 6px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border: 1px solid ${BRAND_COLORS.gold};">
        Festival Place Reservation
      </span>
      <h2 style="margin: 14px 0 6px; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: ${BRAND_COLORS.greenPrimary};">
        New Festival Place Reserved
      </h2>
      <p style="margin: 0; font-size: 13px; color: ${BRAND_COLORS.muted};">
        Gstaad Cricket Festival 2026 &bull; Saturday, 26 September 2026
      </p>
    </div>

    <p style="font-size: 14.5px; line-height: 1.6; margin-bottom: 20px;">
      A new reservation has been placed through the website reservation form. Complete attendee details are recorded below:
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
          ${data.phone ? `<a href="tel:${escapeHtml(data.phone)}" style="color: ${BRAND_COLORS.ink}; font-weight: 600; text-decoration: none;">${escapeHtml(data.phone)}</a>` : '<span style="color: #999;">Not provided</span>'}
        </td>
      </tr>
      <tr>
        <td class="label">Category</td>
        <td class="value"><span class="badge">${escapeHtml(data.registrationType)}</span></td>
      </tr>
      <tr>
        <td class="label">Party / Group Size</td>
        <td class="value"><strong style="font-size: 15px; color: ${BRAND_COLORS.greenDark};">${data.partySize} ${data.partySize > 1 ? "Attendees" : "Attendee"}</strong></td>
      </tr>
      ${data.dietaryRequirements ? `
      <tr>
        <td class="label">Notes / Requests</td>
        <td class="value" style="background-color: #FFFDF5; font-style: italic; color: #3A4A42;">${escapeHtml(data.dietaryRequirements)}</td>
      </tr>` : ""}
      ${data.emergencyContact && data.emergencyContact !== data.phone ? `
      <tr>
        <td class="label">Emergency Contact</td>
        <td class="value">${escapeHtml(data.emergencyContact)}</td>
      </tr>` : ""}
      <tr>
        <td class="label">Received Date</td>
        <td class="value" style="font-size: 12px; color: ${BRAND_COLORS.muted};">${new Date().toUTCString()}</td>
      </tr>
    </table>

    <div style="margin: 28px 0 10px; padding: 18px; background-color: #F8F7F2; border-left: 4px solid ${BRAND_COLORS.gold}; font-size: 13px; line-height: 1.6; color: ${BRAND_COLORS.muted};">
      <strong style="color: ${BRAND_COLORS.greenDark}; display: block; margin-bottom: 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Quick Actions:</strong>
      <a href="mailto:${escapeHtml(data.email)}?subject=Gstaad%20Cricket%20Festival%202026%20Reservation" style="color: ${BRAND_COLORS.greenPrimary}; font-weight: 700; text-decoration: underline;">&bull; Reply via Email</a> &nbsp;&nbsp;|&nbsp;&nbsp;
      ${data.phone ? `<a href="tel:${escapeHtml(data.phone)}" style="color: ${BRAND_COLORS.greenPrimary}; font-weight: 700; text-decoration: underline;">&bull; Call ${escapeHtml(data.fullName)}</a> &nbsp;&nbsp;|&nbsp;&nbsp;` : ""}
      <a href="${DEFAULT_SITE_URL}/admin" style="color: ${BRAND_COLORS.greenPrimary}; font-weight: 700; text-decoration: underline;">&bull; Open Admin Portal</a>
    </div>
  `;

  const text = `GSTAAD CRICKET CLUB - NEW FESTIVAL RESERVATION

A new reservation has been placed on the website for the Gstaad Cricket Festival 2026:

- Full Name: ${data.fullName}
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}
- Registration Category: ${data.registrationType}
- Number Attending: ${data.partySize}
${data.dietaryRequirements ? `- Notes / Requests: ${data.dietaryRequirements}\n` : ""}${data.emergencyContact ? `- Emergency Contact: ${data.emergencyContact}\n` : ""}
- Submission Date: ${new Date().toUTCString()}

Manage Registrations in Admin Portal: ${DEFAULT_SITE_URL}/admin
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
        Saturday, 26 September 2026 &bull; OSZ Ebnit Gstaad
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
          <strong>OSZ Ebnit Gstaad</strong><br>
          <span style="font-size: 13px; color: ${BRAND_COLORS.muted};">Rumpleregässli 8, 3780 Gstaad, Switzerland &bull; Tel: +41 79 786 25 31</span>
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
- Venue: OSZ Ebnit Gstaad, Rumpleregässli 8, 3780 Gstaad, Switzerland (Tel: +41 79 786 25 31)
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
  const typeLabel =
    data.inquiryType === "sponsor"
      ? "Founding Sponsorship"
      : data.inquiryType === "donor"
      ? "Community Donation & Patronage"
      : data.inquiryType === "membership"
      ? "Club Membership"
      : "General Inquiry";

  const subject = `[GCC Inquiry${data.inquiryType ? ` - ${typeLabel}` : ""}] ${sanitizeHeader(data.subject)} - from ${sanitizeHeader(data.name)}`;

  const content = `
    <h2>New Website Inquiry</h2>
    <p>A message has been submitted via the contact form on the club website.</p>
    
    <table class="info-table" role="presentation">
      <tr>
        <td class="label">Category</td>
        <td class="value"><span class="badge">${escapeHtml(typeLabel)}</span></td>
      </tr>
      <tr>
        <td class="label">Sender Name</td>
        <td class="value"><strong>${escapeHtml(data.name)}</strong></td>
      </tr>
      ${data.organization ? `
      <tr>
        <td class="label">Organisation</td>
        <td class="value"><strong>${escapeHtml(data.organization)}</strong></td>
      </tr>` : ""}
      ${data.membershipPackage ? `
      <tr>
        <td class="label">Requested Package</td>
        <td class="value"><strong style="color: ${BRAND_COLORS.greenDark};">${escapeHtml(
          data.membershipPackage === "adult"
            ? "Adult Package (CHF 100 / year)"
            : data.membershipPackage === "family"
            ? "Family Package (CHF 200 / year)"
            : data.membershipPackage === "junior"
            ? "Junior Package (CHF 50 / year)"
            : data.membershipPackage
        )}</strong></td>
      </tr>` : ""}
      <tr>
        <td class="label">Sender Email</td>
        <td class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
      </tr>
      ${data.phone ? `
      <tr>
        <td class="label">Phone</td>
        <td class="value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td>
      </tr>` : ""}
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

Category: ${typeLabel}
${data.membershipPackage ? `Package: ${data.membershipPackage}\n` : ""}Sender: ${data.name} <${data.email}>
${data.organization ? `Organisation: ${data.organization}\n` : ""}${data.phone ? `Phone: ${data.phone}\n` : ""}Subject: ${data.subject}
Date: ${new Date().toUTCString()}
${data.clientIp ? `IP: ${data.clientIp}\n` : ""}
Message:
${data.message}

Reply directly to this email to contact the sender.
`;

  return { subject, html: wrapHtmlLayout(subject, content), text };
}

export function renderContactUserConfirmation(data: ContactEmailData) {
  const isSponsor = data.inquiryType === "sponsor";
  const isDonor = data.inquiryType === "donor";
  const isMembership = data.inquiryType === "membership";
  const categoryTitle = isSponsor
    ? "sponsorship inquiry"
    : isDonor
    ? "donation inquiry"
    : isMembership
    ? "membership inquiry"
    : "message";

  const pkgFormatted = data.membershipPackage
    ? data.membershipPackage === "adult"
      ? "Adult Package (CHF 100 / year)"
      : data.membershipPackage === "family"
      ? "Family Package (CHF 200 / year)"
      : data.membershipPackage === "junior"
      ? "Junior Package (CHF 50 / year)"
      : data.membershipPackage
    : "";

  const subject = `We have received your ${categoryTitle} - Gstaad Cricket Club`;

  const introText = isSponsor
    ? "Thank you for your interest in partnering with <strong>Gstaad Cricket Club</strong> as a sponsor. Your support is instrumental in bringing cricket coaching, fixtures, and community sportsmanship to the Saanenland."
    : isDonor
    ? "Thank you for your generous support of <strong>Gstaad Cricket Club</strong>. Community donations enable us to purchase quality gear, develop junior players, and maintain our alpine facilities."
    : isMembership
    ? `Thank you for your interest in becoming a member of <strong>Gstaad Cricket Club</strong>${pkgFormatted ? ` with the <strong>${escapeHtml(pkgFormatted)}</strong>` : ""}. We warmly welcome you to our community.`
    : `Thank you for contacting <strong>Gstaad Cricket Club</strong>. We have safely received your inquiry regarding "<em>${escapeHtml(data.subject)}</em>".`;

  const content = `
    <h2>Dear ${escapeHtml(data.name)},</h2>
    <p>
      ${introText}
    </p>
    
    <div style="background-color: #F8F7F4; border-left: 4px solid ${BRAND_COLORS.gold}; padding: 16px; margin: 20px 0; font-size: 14px; line-height: 1.6;">
      <strong style="color: ${BRAND_COLORS.greenPrimary}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">Your Message Summary:</strong>
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
${data.organization ? `Organisation: ${data.organization}\n` : ""}${data.phone ? `Phone: ${data.phone}\n` : ""}Your Message:
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
