import jwt from "jsonwebtoken";

import prisma from "../utils/prisma";
import { UserDTO } from "../dtos/UserDTO";

class TokenService {
  generateTokens(payload: UserDTO, jti: string) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign(
      { ...payload, jti },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "15d",
      }
    );

    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): UserDTO | null {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      );

      return payload as UserDTO;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string): (UserDTO & { jti: string }) | null {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
      );

      return payload as UserDTO & { jti: string };
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId: string, refreshToken: string, jti: string) {
    const tokenData = await prisma.refreshToken.findFirst({
      where: { userId },
    });

    if (tokenData) {
      return await prisma.refreshToken.update({
        where: { id: tokenData.id },
        data: { id: jti, token: refreshToken },
      });
    }

    console.log("save Token", jti);

    const token = await prisma.refreshToken.create({
      data: { id: jti, token: refreshToken, userId },
    });

    return token;
  }

  async removeToken(refreshToken: string) {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;

    console.log("PAYLOAD===========", payload);

    const tokenData = await prisma.refreshToken.delete({
      where: { id: payload.jti as string },
    });

    return tokenData;
  }

  async findToken(id: string) {
    return await prisma.refreshToken.findUnique({ where: { id } });
  }
}

export const tokenService = new TokenService();
