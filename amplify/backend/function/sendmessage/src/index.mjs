import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

export const handler = async (event) => {
  // Parse request body (assuming JSON input)
  const { name, email, subject, message } = JSON.parse(event.body || "{}");

  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "All fields are required." }),
    };
  }

  const emailParams = {
    Destination: { ToAddresses: ["titlemunke@gmail.com"] }, // Owner's email
    Message: {
      Body: {
        Html: {
          Data: `
            <html>
              <body>
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong><br> ${message}</p>
                <hr>
                <p>This email was sent from your website's contact form.</p>
              </body>
            </html>`,
        },
      },
      Subject: { Data: `New Contact Form Message: ${subject}` },
    },
    Source: "info@titlemunke.com", // Must be verified in SES
    ReplyToAddresses: [email], // Allows the owner to reply directly to the sender
  };

  try {
    const command = new SendEmailCommand(emailParams);
    await sesClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email." }),
    };
  }
};
