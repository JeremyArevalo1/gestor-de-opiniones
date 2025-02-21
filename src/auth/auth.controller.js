import Usuario from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email && !username){
            return res.status(400).json({
                success: false,
                msg: "El email o username no existen en la base de datos"
            });
        }


        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });


        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            })
        }


        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: 'Inicio de sesion exitoso',
            userDetails: {
                email: user.email,
                username: user.username,
                token: token,
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'server error',
            error: e.message
        });
    }
}

export const register = async(req, res) => {
    try {
        const data = req.body;
        const encryptedPassword = await hash(data.password);
        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        });
    }
}