import { ApiError } from "../exceptions/ApiError";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { menuService } from "../service/menuService";
import { MenusPatch, RequestWithUser } from "../types";

class MenuController {
  async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { title, description, footer, image } = req.body;

      const menu = await menuService.create(
        req.user?.id as string,
        title,
        description,
        footer,
        image
      );

      res.json(menu);
    } catch (error) {
      next(error);
    }
  }

  async get(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { id } = req.query;

      if (id && typeof id === "string") {
        const menu = await menuService.get(userId, id);

        return res.json(menu);
      }

      const menus = await menuService.get(userId);

      return res.json(menus);
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

  async update(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { updates } = req.body;

      const blocks = await menuService.update(updates as MenusPatch);

      return res.json(blocks);
    } catch (error) {
      next(error);
    }
  }

  async getPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;

      if (id && typeof id === "string") {
        const menu = await menuService.getWithBlocks(id);

        if (!menu?.isPublished) {
          throw new Error("Not found");
        }

        return res.json(menu);
      }

      throw new Error("boo");
    } catch (error) {
      next(error);
    }
  }
}

export const menuController = new MenuController();
