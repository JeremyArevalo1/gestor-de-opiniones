import { Schema, model } from "mongoose";
import User from "../users/user.model.js"

const CategorySchema = Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        validate: {
            validator: async function(value) {
                const user = await User.findById(value);
                return user && user.role === 'ADMIN_ROLE';
            },
            message: 'Solo el Admin puede crear categorias.'
        }
    },
    nameCategory: {
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

export default model('category', CategorySchema);