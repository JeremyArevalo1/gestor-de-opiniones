import { response, request } from "express";
import Category from "../category/category.model.js"
import Publication from "./publication.model.js";
import User from "../users/user.model.js";
import Comment from "../comments/comment.model.js"

export const getPublications = async (req = request, res = response) =>{
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, publication] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'author',
                        select: 'name email'
                    }
                })
        ])

        res.status(200).json({
            success: true,
            total,
            publication
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las publicaciones',
            error: error.message
        })
    }
}

export const getPublicationById = async (req, res) => {
    try {
 
        const { id } = req.params;
 
        const publication = await Publication.findById(id);
 
        if(!publication){
            return res.status(404).json({
                success: false,
                msg: 'publication not found'
            })
        }
 
        res.status(200).json({
            success: true,
            publication
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener la publicacion',
            error
        })
    }
}

export const createPublications = async (req, res) => {
    try {
        
        const data = req.body;
        const usuario = await User.findOne({ username: data.username });
        const categoria = await Category.findOne({ nameCategory: data.nameCategory });

        if (!usuario) {
            return res.status(404).json({
                success : false,
                message : 'Usuario no encontrado'
            })
        };

        if (!categoria) {
            return res.status(404).json({
                success : false,
                message : 'Categoria no encontrada'
            })
        }

        const publication = new Publication({
            ...data,
            user: usuario._id,
            category: categoria._id  
        });

        await publication.save();

        await Category.findByIdAndUpdate(categoria._id,{
            $push: {publications: publication._id}
        });

        res.status(200).json({
            success: true,
            publication
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar la publicacion',
            error
        })
    }
}

export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const {_id, ...data} = req.body;
        let { nameCategory } = req.body;

        if(nameCategory) {
            const category = await Category.findOne({ nameCategory });
 
            if (!category) {
                return res.status(400).json({
                    success: false,
                    msg: 'Categoria no encontrada o no existe',
                });
            }
           
            data.category = category.nameCategory;
        }   

        const publicacion = await Publication.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Publicacion actualizado',
            publicacion
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la publicacion',
            error,
        });
    }
}

export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        if (publication.user !== req.usuario.username) {
            return res.status(403).json({
                msg: 'No tienes permiso para eliminar esta publicación'
            });
        }

        const updatedPublication = await Publication.findByIdAndUpdate(id, { estado: false }, { new: true });
        
        await Comment.updateMany({ publicacion: id }, { estado: false });

        res.status(200).json({
            success: true,
            message: 'Publicación y sus comentarios eliminados exitosamente',
            publication: updatedPublication
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la publicación',
            error
        });
    }
};
