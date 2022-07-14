import bcrypt from 'bcrypt';
import { createUser, getOneUser } from "../repository/user"
import { v4 as uuidv4 } from 'uuid';

export const authRegister = async ({ name, email, password, university, members }) => {
    const user = await getOneUser({ email });
    if (user) return { status: 400, message: 'User already exists' };
    const encryptedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
    return await createUser({
        name,
        email,
        password: encryptedPassword,
        verification_code: uuidv4(),
        university,
        members,
    });
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

