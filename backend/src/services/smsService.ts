import Kavenegar from "kavenegar";

// Initialize Kavenegar API
const kavenegarApi = Kavenegar.KavenegarApi({
  apikey: process.env.KAVENEGAR_API_KEY || "",
});

export class SMSService {
  /**
   * Send SMS using Kavenegar
   * @param phoneNumber - Recipient phone number (e.g., "09123456789")
   * @param message - SMS message content
   */
  static async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Validate phone number
      if (!phoneNumber) {
        console.error("SMS Error: Phone number is required");
        return false;
      }

      // Check if API key is configured
      if (!process.env.KAVENEGAR_API_KEY) {
        console.error("SMS Error: KAVENEGAR_API_KEY is not configured");
        return false;
      }

      // Remove any non-digit characters from phone number
      const cleanPhone = phoneNumber.replace(/\D/g, "");

      // Ensure phone number starts with 98 (Iran country code)
      const formattedPhone = cleanPhone.startsWith("98") ? cleanPhone : `98${cleanPhone.replace(/^0/, "")}`;

      // Send SMS using Kavenegar
      return new Promise((resolve, reject) => {
        kavenegarApi.Send(
          {
            message: message,
            sender: process.env.KAVENEGAR_SENDER || "10008663",
            receptor: formattedPhone,
          },
          (response: any, status: number) => {
            if (status === 200) {
              console.log("✅ SMS sent successfully:", response);
              resolve(true);
            } else {
              console.error("❌ SMS sending failed:", status, response);
              resolve(false);
            }
          }
        );
      });
    } catch (error) {
      console.error("SMS Service Error:", error);
      return false;
    }
  }

  /**
   * Send SMS using Kavenegar template (lookup)
   * @param phoneNumber - Recipient phone number
   * @param templateName - Template name in Kavenegar panel
   * @param tokens - Template tokens (e.g., {token: "value", token2: "value2"})
   */
  static async sendTemplateSMS(
    phoneNumber: string,
    templateName: string,
    tokens: { [key: string]: string }
  ): Promise<boolean> {
    try {
      if (!phoneNumber || !templateName) {
        console.error("SMS Error: Phone number and template name are required");
        return false;
      }

      if (!process.env.KAVENEGAR_API_KEY) {
        console.error("SMS Error: KAVENEGAR_API_KEY is not configured");
        return false;
      }

      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const formattedPhone = cleanPhone.startsWith("98") ? cleanPhone : `98${cleanPhone.replace(/^0/, "")}`;

      return new Promise((resolve, reject) => {
        kavenegarApi.VerifyLookup(
          {
            receptor: formattedPhone,
            template: templateName,
            ...tokens,
          },
          (response: any, status: number) => {
            if (status === 200) {
              console.log("✅ Template SMS sent successfully:", response);
              resolve(true);
            } else {
              console.error("❌ Template SMS sending failed:", status, response);
              resolve(false);
            }
          }
        );
      });
    } catch (error) {
      console.error("Template SMS Service Error:", error);
      return false;
    }
  }
}
