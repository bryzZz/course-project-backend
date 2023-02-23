import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { userService } from "../service/userService";
import { ApiError } from "../exceptions/ApiError";
import { RequestWithUser } from "../types";

class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { email, name, password } = req.body;

      const userData = await userService.register(email, name, password);

      res.cookie("refresh_token", userData.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const userData = await userService.login(email, password);

      res.cookie("refresh_token", userData.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refresh_token;

      const token = await userService.logout(refreshToken);

      res.clearCookie("refresh_token");

      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        throw ApiError.Unauthorized();
      }

      const userData = await userService.refresh(refreshToken);

      res.cookie("refresh_token", userData.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
