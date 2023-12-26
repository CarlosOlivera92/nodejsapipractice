export default class CartsDto {
    constructor(cart) {
        this.id = cart.id;
        this.products = cart.products;
    } 
}