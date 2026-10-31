
import SibApiV3Sdk from 'sib-api-v3-sdk';

const brevoClient = SibApiV3Sdk.ApiClient.instance;
brevoClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmailNotification = async (to, subject, message) => {
  try {
    await transEmailApi.sendTransacEmail({
      sender: {
        name: process.env.BREVO_FROM_NAME || 'SLOFT Support',
        email: process.env.BREVO_FROM_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: `<p>${message}</p>`,
    });
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
