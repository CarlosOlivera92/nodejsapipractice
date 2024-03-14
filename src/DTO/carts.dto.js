export default class CartsDto {
    constructor(cart) {
        this.id = cart.id;
        this.products = cart.products.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));
        this.user = cart.user;
    } 
}