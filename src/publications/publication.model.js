import { model, Schema } from "mongoose";

const PublicationSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    maintext: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "comment",
    }]
},  
    {
        timestamps: true,
        versionKey: false
    }

);
export default model('publication', PublicationSchema);