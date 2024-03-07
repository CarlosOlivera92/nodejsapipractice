export default class UsersDto {
    constructor(user) {
        this.id = user.id;
        this.name = `${user.first_name} ${user.last_name}`;
        this.age = user.age;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.documents = user.documents; // Agregando la parte de documentos
    }
}