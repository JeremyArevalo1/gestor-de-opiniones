import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) =>{
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuario',
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {
 
        const { id } = req.params;
 
        const user = await User.findById(id);
 
        if(!user){
            return res.status(404).json({
                success: false,
                msg: 'Usuario not found'
            })
        }
 
        res.status(200).json({
            success: true,
            user
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const updateUser = async (req, res = response) =>{
    try {

        const { id } = req.params
        const { _id, password, email, role, ...data } = req.body;
        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Usuario actualizado',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar user',
            error
        })
    }
}


export const updatePassword = async (req, res) => {
    try {
        const { email, username, currentPassword, newPassword } = req.body;

        if ((!email && !username) || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                msg: "El email o username, la contraseña actual y la nueva contraseña son obligatorios"
            });
        }

        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "El usuario o email no existe en la base de datos"
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                success: false,
                msg: "El usuario no está activo"
            });
        }

        const validPassword = await verify(user.password, currentPassword);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: "La contraseña actual es incorrecta"
            });
        }

        const hashedNewPassword = await hash(newPassword);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la contraseña",
            error: error.message
        });
    }
};

