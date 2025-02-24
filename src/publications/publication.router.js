import { Router } from 'express';
import { check } from 'express-validator';
import { getPublications, getPublicationById, createPublications, updatePublication, deletePublication } from './publication.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get(
    '/',
    getPublications
);

router.get(
    '/:id',
    [
        check("id", "No es un ID valido").isMongoId(),
        validarCampos
    ],
    getPublicationById
)

router.post(
    '/',
    [
        validarJWT,
        check('username', 'Este no es un username valido').not().isEmpty(),
        validarCampos
    ],
    createPublications
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'Este no es un id valido').isMongoId(),
        validarCampos
    ],
    updatePublication
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un id valido").isMongoId(),
        validarCampos
    ],
    deletePublication
)

export default router;