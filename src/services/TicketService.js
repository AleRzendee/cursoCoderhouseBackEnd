import Ticket from '../models/Ticket.js';

export const purchaseCart = async (cartId, userEmail) => {
  return Ticket.create({
    code: 'ABC123',
    purchase_datetime: new Date(),
    amount: 100,
    purchaser: userEmail
  });
};
