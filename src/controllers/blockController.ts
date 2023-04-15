import { ApiError } from "../exceptions/ApiError";
import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { blockService } from "../service/blockService";
import { BlocksPatch, RequestWithUser } from "../types";

class BlockController {
  async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { menuId, type } = req.body;

      if (type === "DISH") {
        const { name, image, description } = req.body.data;

        const block = await blockService.createDish(
          menuId,
          name,
          image,
          description
        );

        return res.json(block);
      }

      if (type === "SEPARATOR") {
        const { text } = req.body.data;

        const block = await blockService.createSeparator(menuId, text);

        return res.json(block);
      }
    } catch (error) {
      next(error);
    }
  }

  async get(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { menuId } = req.query;

      const blocks = await blockService.get(menuId as string);

      return res.json(blocks);
    } catch (error) {
      next(error);
    }
  }

  async update(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { updates } = req.body;

      const blocks = await blockService.update(updates as BlocksPatch);

      return res.json(blocks);
    } catch (error) {
      next(error);
    }
  }
}

export const blockController = new BlockController();
