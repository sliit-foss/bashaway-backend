import { MAIL_CREDENTIALS } from "../utils/config";
import nodemailer from "nodemailer";
import handlebars from "handlebars";

let transport = nodemailer.createTransport({
    service: "gmail",
    host: MAIL_CREDENTIALS.HOST,
    auth: {
        user: MAIL_CREDENTIALS.USER,
        pass: MAIL_CREDENTIALS.PASS,
    },
});

export const sendVerificationMail = async (email, html, replacements, subject) => {

    let template = handlebars.compile(html);
    let htmlToSend = template(replacements);

    const mailOptions = {
        from: MAIL_CREDENTIALS.USER,
        to: email,
        subject: subject,
        html: htmlToSend,
    };
    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (error) => {
            if (error) reject(error);
            resolve(true);
        });
    });
}

export const checkAvailability = async () => {
    return new Promise((resolve, reject) => {
        transport.verify(async (error) => {
            if (error) reject(error);
            resolve(true);
        });
    })
}