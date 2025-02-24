import { model, Schema } from "mongoose";

const PublicationSchema = Schema({
    user: {
        type: String,
        ref: "user",
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    category: {
        type: String,
        ref: "category",
        required: true
    },
    text: {
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
export default model('publication', PublicationSchema);