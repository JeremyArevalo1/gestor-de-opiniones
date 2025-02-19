import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutos
    max: 100, // 100 peticiones
    message: {
        succes: false,
        msg: "Demasiadas peditciones desde esta IP, por favor intente de nuevo despues de 15 minutos",
    }
})

export default limiter;