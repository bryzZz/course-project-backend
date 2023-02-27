import { UserDTO } from "./dtos/UserDTO";
import { Request } from "express";
import { Block, Menu } from "@prisma/client";

export interface RequestWithUser extends Request {
  user?: UserDTO;
}

export interface MenusPatch {
  [id: string]: Partial<Pick<Menu, "title" | "description" | "footer">>;
}

export interface BlocksPatch {
  [id: string]: Partial<Pick<Block, "imageUrl" | "place" | "text">>;
}
