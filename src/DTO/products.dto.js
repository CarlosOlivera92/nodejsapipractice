export default class ProductsDTO {
    constructor(product) {
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.category = product.category;
        this.thumbnail = product.thumbnail;
    }
}