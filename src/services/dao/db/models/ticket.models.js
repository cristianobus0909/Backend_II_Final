import mongoose from "mongoose";

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: function () {
            return `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    purchaser: {
        type: String,
        required: true
    }
});

const Ticket = mongoose.model(ticketCollection, ticketSchema);
export default Ticket;