import nodemailer from "nodemailer"
import {transporter} from "./mailerConfig.js"

export const emailSend =async ({to,subject,text}) => {

    const nodemailers = nodemailer.createTransport(transporter);

    return await nodemailers.sendMail({
        from: '"Maddison Foo Koch 👻" <Whosthere@email.com>', 
        to, 
        subject,
        text, 
    });
}
