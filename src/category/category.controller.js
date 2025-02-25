import { response, request } from "express";
import Category from "./category.model.js";
import User from "../users/user.model.js";

export const getCategories = async (req = request, res = response) =>{
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate({
                    path: 'publications',
                })
        ])

        res.status(200).json({
            success: true,
            total,
            categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las categorias',
            error
        })
    }
}

export const getCategoryById = async (req, res) => {
    try {
 
        const { id } = req.params;
 
        const category = await Category.findById(id);
 
        if(!category){
            return res.status(404).json({
                success: false,
                msg: 'categoria not found'
            })
        }
 
        res.status(200).json({
            success: true,
            category
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener la categoria',
            error
        })
    }
}

export const createCategories = async (req, res) => {
    try {
        const data = req.body;
        const { nameCategory } = req.body;
        const admin = await User.findOne({ name: data.name });

        if (!admin || admin.role !== 'ADMIN_ROLE') {
            return res.status(400).json({
                success: false,
                message: 'El usuario debe tener el rol ADMIN_ROLE o no existe el usuario con ese nombre.'
            });
        }


        const normalizedCategoryName = nameCategory.toLowerCase();
        const existingCategory = await Category.findOne({ nameCategory: normalizedCategoryName });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre.'
            });
        }

        const newCategory = new Category({
            admin: admin._id,
            nameCategory
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Categoría creada con éxito',
            newCategory,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la categoría',
            error: error.message,
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nameCategory } = req.body;

        if (req.usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para actualizar categorías.',
            });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { nameCategory },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoría actualizada con éxito.',
            updatedCategory,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la categoría.',
            error: error.message,
        });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar categorías.',
            });
        }

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoría eliminada con éxito.',
            deletedCategory,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la categoría.',
            error: error.message,
        });
    }
};


