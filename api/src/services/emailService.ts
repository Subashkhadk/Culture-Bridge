import nodemailer from 'nodemailer';

// Configure email transporter (use SendGrid, Mailgun, or SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@culturebridge.com',
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
};

export const sendWelcomeEmail = (email: string, name: string) => {
  const html = `
    <h1>Welcome to Culture Bridge! 🌉</h1>
    <p>Hi ${name},</p>
    <p>Thank you for joining Culture Bridge! We're excited to have you.</p>
    <p>Start exploring cultures from around the world:</p>
    <a href="${process.env.FRONTEND_URL}/feed">Browse the Feed</a>
    <br/><br/>
    <p>Happy exploring!</p>
    <p>The Culture Bridge Team</p>
  `;
  return sendEmail(email, 'Welcome to Culture Bridge!', html);
};

export const sendNotificationEmail = (email: string, name: string, notification: string) => {
  const html = `
    <h1>New Notification</h1>
    <p>Hi ${name},</p>
    <p>${notification}</p>
    <a href="${process.env.FRONTEND_URL}/notifications">View All Notifications</a>
    <br/><br/>
    <p>Cheers,</p>
    <p>The Culture Bridge Team</p>
  `;
  return sendEmail(email, 'New Notification from Culture Bridge', html);
};
