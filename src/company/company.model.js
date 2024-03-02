import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    registeredby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    impactLevel: {
        type: String,
        required: true
    },
    yearsInBusiness: {
        type: Number,
        required: true
    },
    businessCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
},{
    versionKey: false
})

export default mongoose.model('Company', companySchema);
