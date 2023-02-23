"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
class UserDTO {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
    }
}
exports.UserDTO = UserDTO;
