"use server";

export async function sendWaitlistEmail(
  email: string,
  name?: string,
  userType?: string
) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BuilderIQ <noreply@builderiq.in>",
        to: email,
        subject:
          "You're In — Welcome to the Future of New Construction in Indiana",
        html: getWaitlistEmailTemplate(name, userType),
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

function getWaitlistEmailTemplate(name?: string, userType?: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to BuilderIQ</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #b22222 0%, #8B0000 50%, #FF4500 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; line-height: 1.2;">
                You're In — Welcome to the Future of New Construction in Indiana
              </h1>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #334155; font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">
                ${name ? `Hi ${name},` : "Hi there,"}
              </p>
              
              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thanks for joining the <strong>BuilderIQ.IN Early Access List</strong>! You're officially on the inside track for Indiana's first AI-powered builder incentive dashboard.
              </p>

              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Every week, Indiana builders roll out <strong style="color: #b22222;">3.99% rate buydowns</strong>, <strong style="color: #b22222;">$10K–$45K design credits</strong>, free upgrades, and paid closing costs — but most agents and buyers never hear about them in time.
              </p>

              <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-left: 4px solid #b22222; padding: 20px; margin: 0 0 30px 0; border-radius: 8px;">
                <p style="color: #b22222; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">
                  BuilderIQ.IN changes that.
                </p>
                <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0;">
                  We track every builder incentive in the state, updated weekly, in one simple dashboard.
                </p>
              </div>

              <!-- What Happens Next -->
              <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 30px 0 20px 0;">
                What Happens Next
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 2px solid #e2e8f0; margin-bottom: 15px;">
                    <div style=" display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                      <span style="color: #1e293b; font-size: 20px; font-weight: 700;">1</span>
                    </div>
                    <h3 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">
                      We're Building Your Dashboard
                    </h3>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
                      Our AI is tracking every builder in Indiana — DR Horton, Lennar, M/I Homes, and 20+ more.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 2px solid #e2e8f0; margin-bottom: 15px;">
                    <div style=" display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                      <span style="color: #1e293b; font-size: 20px; font-weight: 700;">2</span>
                    </div>
                    <h3 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">
                      You'll Get Early Access
                    </h3>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
                      You'll receive a personalized invite before we open to the public — with lifetime Founding Member pricing.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 2px solid #e2e8f0;">
                    <div style=" display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                      <span style="color: #1e293b; font-size: 20px; font-weight: 700;">3</span>
                    </div>
                    <h3 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">
                      We Keep You Posted
                    </h3>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
                      Expect updates in the coming weeks. We're launching in <strong>30 days</strong>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Spread the Word -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0;">
                <h2 style="color: #92400e; font-size: 22px; font-weight: 700; margin: 0 0 15px 0;">
                  Know Another Agent or Buyer Who'd Love This?
                </h2>
                <p style="color: #78350f; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                  Invite them to the Early Access List. They'll thank you when they land their next builder incentive deal.
                </p>
                <a href="https://builderiq.in" style="display: inline-block; background: linear-gradient(135deg, #b22222, #FF4500); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px;">
                  Share BuilderIQ.IN
                </a>
              </div>

              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0;">
                Welcome to BuilderIQ.IN.<br>
                Let's change how Indiana does new construction.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0;">
                <strong style="color: #ffffff;">BuilderIQ.IN</strong><br>
                Built in Indiana. Built for Home Builders.
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                A Just Jack AI Project | info@BuilderIQ.IN
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
