import { Router } from "express";
import { check } from "express-validator";
import { getComment, getCommentById, createComment, updateComment, deleteComment } from "./comment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get(
    "/",
    getComment
);

router.get(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        validarCampos
    ],
    getCommentById
);

router.post(
    "/",
    [
        validarJWT,
        check('username', 'Este no es un username valido').not().isEmpty(),
        validarCampos
    ],
    createComment
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un id válido").isMongoId(),
        validarCampos
    ],
    updateComment
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un id valido"),
        validarCampos
    ],
    deleteComment
)

export default router;