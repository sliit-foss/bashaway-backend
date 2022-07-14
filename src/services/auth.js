import bcrypt from 'bcrypt';
const fs = require('fs');
import { v4 as uuidv4 } from 'uuid';
import {createUser, getOneUser, updateVerifiedUser, getUserByCode} from "../repository/user"
import {sendVerificationMail} from "./email";

export const authRegister = async (name, email, password, university, members) => {
    const user = await getOneUser({ email });
    if (user) return { status: 400, message: 'User already exists' };
    const encryptedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });

    const verification_code = uuidv4();
    const registeredUser =  await createUser({
        name,
        email,
        password: encryptedPassword,
        verification_code: verification_code,
        university,
        members,
    });
    await verifyMailTemplate(email, verification_code);

    return registeredUser;
}

export const authLogin = async ({ email, password }) => {
    const user = await getOneUser({ email });
    if (!user) return false;
    const isPasswordMatch = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    })
    if (!isPasswordMatch) return false;
    return user;
}

export const verifyMailTemplate = async (email, verification_code) => {

    const html = fs.readFileSync(__basedir + "/html/emailTemplate.html", "utf8");
    let replacements = {
        verify_URL: `http://localhost:3001/api/auth/verify/${verification_code}`,
    }
    let subject = "Welcome to the Bashaway"

    await sendVerificationMail(email, html, replacements, subject);
    return true;
}

export const updateVerify = async (id) => {

    const user = await getUserByCode(id);
    if (!user) return false;
    return await updateVerifiedUser({
        name: user.name,
        email: user.email,
        password: user.password,
        verification_code: user.verification_code,
        is_verified: true,
        university: user.university,
        members: user.members,
    });
}