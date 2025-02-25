import { response, request } from "express";
import Publication from "../publications/publication.model.js";
import User from "../users/user.model.js";
import Comment from "./comment.model.js";

export const getComment = async (req = request, res = response) =>{
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, comment] = await Promise.all([
            Comment.countDocuments(query),
            Comment.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            comment
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los commentarios',
            error
        })
    }
}

export const getCommentById = async (req, res) => {
    try {
 
        const { id } = req.params;
 
        const comment = await Comment.findById(id);
 
        if(!comment){
            return res.status(404).json({
                success: false,
                msg: 'comment not found'
            })
        }
 
        res.status(200).json({
            success: true,
            comment
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener la publicacion',
            error
        })
    }
}

export const createComment = async (req, res) => {
    try {
        const data = req.body;
        const usuario = await User.findOne({ username: data.username });
        const publicacion = await Publication.findById(data.publicacionId);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (!publicacion) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        const comment = new Comment({
            ...data,
            author: usuario._id,
            publicacion: publicacion._id
        });

        await comment.save();
        
        await Publication.findByIdAndUpdate(publicacion._id,{
        $push: { comments: comment._id }
        })
        res.status(200).json({
            success: true,
            comment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar el comentario',
            error
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params; 
        const { _id, usuario, publicacion, ...data } = req.body;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado',
            comment: updatedComment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el comentario',
            error
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'comentario no encontrado'
            });
        }

        if (comment.author !== req.usuario.username) {
            return res.status(403).json({
                msg: 'No tienes permiso para eliminar este comentario'
            });
        }
        const updatedComment = await Comment.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            message: 'comentario eliminado exitosamente',
            comment: updatedComment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el comentario',
            error
        });
    }
};