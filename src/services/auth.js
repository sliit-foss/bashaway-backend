import bcrypt from 'bcrypt';
import {createUser} from "../repository/user"
import { v4 as uuidv4 } from 'uuid';
const authRegister = async (name, email, password, university) => {
    const encryptedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS), function (err, hash) {
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
    });
}

export const authLogin = async (email, password) => {
    let user = getOneUser(email);
    if (!user) makeResponse({res, message:"User created successfully"}); 
}