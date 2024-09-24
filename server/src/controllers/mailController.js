import { StatusCodes } from 'http-status-codes';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const sendMail = async (req, res, next) => {
    try {
        const { email, subject, content } = req.body;

        const filePath = path.join(__dirname, '../json/info.json');
        const rawdata = fs.readFileSync(filePath);
        const jsonData = JSON.parse(rawdata);
        const { googleEmail, googlePassword, googleTitle, websiteName } = jsonData.info;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: googleEmail || process.env.EMAIL_USER,
                pass: googlePassword || process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${googleTitle || websiteName}" <${googleEmail || process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: content,
        });

        res.status(StatusCodes.OK).json({ message: 'Đã gửi email' });
    } catch (error) {
        next(error);
    }
}

export const emailController = {
    sendMail,
}
