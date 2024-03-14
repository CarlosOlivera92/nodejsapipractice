
export default class TicketRepository{
    constructor(dao) {
        this.dao = dao;
    }
    async createTicket(ticketData) {
        try{
            return await this.dao.create(ticketData);
        } catch(error) {
            throw new Error(error)
        }
    }
}