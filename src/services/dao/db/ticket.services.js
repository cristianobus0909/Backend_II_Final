import Ticket from "./models/ticket.models.js"

export default class TicketService {
    constructor(){
        console.log("Trabajando con tickets, persistiendo BD con MongoDb");
        
    }
    create = async (ticket) => {
        const result = await Ticket.create(ticket)
        return result;
    }
}