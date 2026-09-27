// import nodemailer from 'nodemailer';

// // const transporter = nodemailer.createTransport({
// //     service: 'gmail',
// //     auth: {
// //         type: 'OAuth2',
// //         user: process.env.EMAIL_USER,
// //         clientId: process.env.GOOGLE_CLIENT_ID,
// //         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //         refreshToken: process.env.GOOGLE_REFRESH_TOKEN
// //     }
// // });

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.GOOGLE_APP_PASSWORD,
//   },
//   family: 4, // force IPv4 - avoids Render's IPv6 ENETUNREACH/ETIMEDOUT to Gmail SMTP
//   connectionTimeout: 10000,
// });
// transporter.verify()
//     .then(() => {        
//         console.log('Email transporter is ready to send emails');
//     }).catch((err) => {
//         console.error("Email Transporter verification failed", err)
//     })


// export async function sendMail({ to, subject, html, text }) {
//     try {
//         const mailOption = {
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             html,
//             text
//         }

//         const details = await transporter.sendMail(mailOption);
//         console.log("Email sent", details);
//         return { success: true };
//     } catch (error) {
//         console.error("Error sending email", error);
//         return { success: false, error: error.message };
//     }
// }

// Sends transactional email via Brevo's HTTPS API (https://api.brevo.com/v3/smtp/email)
// instead of raw SMTP. Free-tier hosts (Render, Railway, etc.) block outbound SMTP
// ports 25/465/587, but HTTPS (443) is never blocked, so this works everywhere.
//
// Required env vars:
//   BREVO_API_KEY   - from Brevo dashboard -> SMTP & API -> API Keys
//   EMAIL_USER      - the sender email address, must be a "verified sender" in Brevo

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendMail({ to, subject, html, text }) {
    try {
        const response = await fetch(BREVO_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
            },
            body: JSON.stringify({
                sender: {
                    name: "SnapSeek",
                    email: process.env.EMAIL_USER,
                },
                to: [{ email: to }],
                subject,
                htmlContent: html,
                textContent: text,
            }),
        });

        const details = await response.json();
        console.log("Email sent", details);
        return details;
    } catch (error) {
        console.error("Error sending email", error);
        return null;
    }
}