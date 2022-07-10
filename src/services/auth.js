import bcrypt from 'bcrypt';
import {createUser} from "../repository/user"

const authRegister = async (name, email, password, photo_url) => {
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
        photo_url,
    });
}

module.exports = {
    authRegister,
}