import { Schema, model } from "mongoose";

const CommentSchema = Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    publicacion: {
        type: Schema.Types.ObjectId,
        ref: "publication",
        required: true
    },
    comentario: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);
export default model('comment', CommentSchema);