import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const sendVerificationEmail = async (email: string, localToken: string) => {
    try {
        const accesToken = await oAuth2Client.getAccessToken();
        const token = accesToken.token;
        if (!token) {
            console.log("No se pudo obteber el token");
            return;
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_FROM,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: token
            }
        });
        const url = process.env.BASE_URL_MOBIL;
        const verificationLink = `${url}/user/verify/${localToken}`;
        const info = await transporter.sendMail({
            from: `Envios Todo Santiago <${process.env.EMAIL_FROM}>`,
            to: email.toLowerCase(),
            subject: "Verifica tu cuenta",
            html: `<p>Haz click para verificar tu cuenta:</p>
        <a href="${verificationLink}">${verificationLink}</a>`
        });

    } catch (error) {
        console.log(error);
    }
}