import { MAIL_CREDENTIALS } from "../utils/config";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

const transport = nodemailer.createTransport({
    service: "gmail",
    host: MAIL_CREDENTIALS.HOST,
    auth: {
        user: MAIL_CREDENTIALS.USER,
        pass: MAIL_CREDENTIALS.PASS,
    },
});

export const sendMail = async (email, templateName, replacements, subject) => {
    const html = fs.readFileSync(__basedir + `/html/${templateName}.html`, "utf8")
    const template = handlebars.compile(html);
    const htmlToSend = template(replacements);
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
