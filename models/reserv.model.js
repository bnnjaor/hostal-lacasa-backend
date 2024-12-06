import mongoose from "mongoose"
const Schema = mongoose.Schema

const reservSchema = new Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
    
    
})

const Reserv = mongoose.model('Reserv', reservSchema)

export default Reserv