import { NextResponse } from "next/server";
import { dispatchEmail, getSmtpConfig } from "@/infrastructure/email/smtp-client";
import { wrapHtmlLayout } from "@/infrastructure/email/email-templates";

export async function POST() {
  try {
    const config = getSmtpConfig();
    const testRecipient = config.adminRecipient || "info@gstaadcricketclub.ch";
    const timestamp = new Date().toUTCString();

    const htmlContent = `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; background-color: #F5EFE0; color: #0A1C15; padding: 6px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; border: 1px solid #C5A059;">
          Diagnostics &bull; Verification Pass
        </span>
        <h2 style="margin: 14px 0 6px; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: #0F382A;">
          Mail Delivery Diagnostic Successful
        </h2>
        <p style="margin: 0; font-size: 13px; color: #5A6E65;">
          Gstaad Cricket Club &bull; Alpine Infrastructure Test
        </p>
      </div>

      <p style="font-size: 14.5px; line-height: 1.6; margin-bottom: 20px;">
        This diagnostic confirmation verifies that outgoing email dispatch is operational and delivering directly into the official club mailbox.
      </p>

      <table class="info-table" role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #FAFAF7; border: 1px solid #E2DDD2;">
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E2DDD2; width: 35%; font-weight: 700; color: #5A6E65; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; background-color: #F6F4EE;">Target Mailbox</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E2DDD2; color: #1A2E26; font-weight: 600;">${testRecipient}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E2DDD2; width: 35%; font-weight: 700; color: #5A6E65; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; background-color: #F6F4EE;">Configured Host</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E2DDD2; color: #1A2E26;">${config.host}:${config.port}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E2DDD2; width: 35%; font-weight: 700; color: #5A6E65; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; background-color: #F6F4EE;">Sender Identity</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E2DDD2; color: #1A2E26;">${config.fromName} &lt;${config.fromAddress}&gt;</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E2DDD2; width: 35%; font-weight: 700; color: #5A6E65; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; background-color: #F6F4EE;">Timestamp</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E2DDD2; color: #1A2E26; font-size: 12px;">${timestamp}</td>
        </tr>
      </table>

      <div style="margin: 24px 0; padding: 16px; background-color: #F8F7F2; border-left: 4px solid #C5A059; font-size: 13px; line-height: 1.5; color: #5A6E65;">
        <strong style="color: #0A1C15; display: block; margin-bottom: 4px;">Self-Healing Delivery Status:</strong>
        Delivery verified via direct system MTA / Postfix pipeline. All festival reservations and website inquiries will be routed to this mailbox.
      </div>
    `;

    const html = wrapHtmlLayout("[GCC Test] Diagnostic Mail Delivery", htmlContent);
    const text = `GSTAAD CRICKET CLUB - MAIL DELIVERY DIAGNOSTIC\n\nTarget Mailbox: ${testRecipient}\nTimestamp: ${timestamp}\nStatus: Operational\n`;

    const result = await dispatchEmail({
      to: testRecipient,
      subject: `[GCC Test] Mail Delivery Verification (${timestamp})`,
      html,
      text,
    });

    return NextResponse.json({
      success: result.success,
      recipient: testRecipient,
      method: result.method || "unknown",
      messageId: result.messageId,
      error: result.error,
      timestamp,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
