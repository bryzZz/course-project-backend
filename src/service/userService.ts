import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import prisma from "../utils/prisma";
import { tokenService } from "./tokenService";
import { UserDTO } from "../dtos/UserDTO";
import { ApiError } from "../exceptions/ApiError";
import { User } from "@prisma/client";

class UserService {
  async register(email: string, name: string, password: string) {
    const candidate = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (candidate) {
      throw ApiError.BadRequest("Email already in use");
    }

    const user = await prisma.user.create({
      data: { email, name, password: bcrypt.hashSync(password, 12) },
    });

    const userDTO = new UserDTO(user);
    const jti = uuidv4();
    const tokens = tokenService.generateTokens({ ...userDTO }, jti);

    await tokenService.saveToken(userDTO.id, tokens.refreshToken, jti);

    return { ...tokens, user: { ...userDTO } };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw ApiError.BadRequest("User not found");
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Incorrect password");
    }

    const userDTO = new UserDTO(user);
    const jti = uuidv4();
    const tokens = tokenService.generateTokens({ ...userDTO }, jti);

    await tokenService.saveToken(userDTO.id, tokens.refreshToken, jti);

    return { ...tokens, user: { ...userDTO } };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken: string) {
    const userData = tokenService.validateRefreshToken(refreshToken);

    if (!userData) {
      throw ApiError.Unauthorized();
    }

    console.log("==============", userData);

    const tokenFromDb = await tokenService.findToken(userData?.jti);

    if (!tokenFromDb) {
      throw ApiError.Unauthorized();
    }

    const user = await prisma.user.findUnique({ where: { id: userData.id } });
    const userDTO = new UserDTO(user as User);
    const jti = uuidv4();
    const tokens = tokenService.generateTokens({ ...userDTO }, jti);

    await tokenService.saveToken(userDTO.id, tokens.refreshToken, jti);

    return { ...tokens, user: { ...userDTO } };
  }

  async getAllUsers() {
    const users = await prisma.user.findMany();

    return users;
  }
}

export const userService = new UserService();
