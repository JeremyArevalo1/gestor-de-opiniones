import { Router } from "express";
import { check } from "express-validator";
import { getCategories, getCategoryById, createCategories, updateCategory, deleteCategory } from './category.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get(
    '/',
    getCategories
);

router.get(
    '/:id',
    getCategoryById
);

router.post(
    '/',
    createCategories
);
router.put(
    '/:id',
    [
        validarJWT,
        check("id", "No es un id válido").isMongoId(),
        validarCampos
    ],
    updateCategory
);
router.delete(
    '/:id',
    [
        validarJWT,
        check("id", "No es un id valido"),
        validarCampos
    ],
    deleteCategory
)
export default router;