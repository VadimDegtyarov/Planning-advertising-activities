import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Bank: {
        type: Number,
        required: true,


    },
    Following: {
        type: Number,
        required: true,

    },
    Purchases: {
        type: Number,
        required: true,

    },
    CAge: {
        type: Number,
        required: true,

    },
    Country: {
        type: String,
        default: "Все страны",

    },
    Cost: {
        type: Number,
        default: 0,
    },
    profit: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        
    },
    imageUrl: 
    {
        type:String,
        
    }

},
    {
        timestamps: true,
    },);
export default mongoose.model('Request', RequestSchema);