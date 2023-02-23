import { UserDTO } from "./dtos/UserDTO";
import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: UserDTO;
}
