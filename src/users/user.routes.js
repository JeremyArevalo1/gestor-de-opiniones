import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, updatePassword } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.get("/", getUsers);

router.get(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.put(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.put(
    "/password/:id",
    [ 
        check("id", "No es un id válido").isMongoId(),
        validarCampos
    ],
    updatePassword
)

export default router;
