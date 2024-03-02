import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
         
    }
},{
    versionKey: false
})

export default mongoose.model('Category', categorySchema);

 
