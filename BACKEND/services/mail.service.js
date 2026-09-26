import dns from 'node:dns';
import nodemailer from 'nodemailer';

dns.setDefaultResultOrder('ipv4first');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: process.env.EMAIL_USER,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN
//     }
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  family: 4,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});
transporter.verify()
    .then(() => {        
        console.log('Email transporter is ready to send emails');
    }).catch((err) => {
        console.error("Email Transporter verification failed", err)
    })


export async function sendMail({ to, subject, html, text }) {
    try {
        const mailOption = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
            text
        }

        const details = await transporter.sendMail(mailOption);
        console.log("Email sent", details);
        return { success: true };
    } catch (error) {
        console.error("Error sending email", error);
        return { success: false, error: error.message };
    }
}