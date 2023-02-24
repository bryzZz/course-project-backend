import { ApiError } from "../exceptions/ApiError";
import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { menuService } from "../service/menuService";
import { RequestWithUser } from "../types";

class MenuController {
  async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { title, description, image } = req.body;

      const menu = await menuService.createMenu(
        req.user?.id as string,
        title,
        description,
        image
      );

      res.json(menu);
    } catch (error) {
      next(error);
    }
  }

  async get(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const menus = await menuService.get(req.user?.id as string);

      res.json(menus);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;

      if (typeof id !== "string") {
        throw ApiError.BadRequest("bla");
      }

      const menu = await menuService.delete(id);

      res.json(menu);
    } catch (error) {
      next(error);
    }
  }
}

export const menuController = new MenuController();
