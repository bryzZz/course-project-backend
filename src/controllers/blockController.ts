import { ApiError } from "../exceptions/ApiError";
import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { blockService } from "../service/blockService";
import { RequestWithUser } from "../types";

class BlockController {
  async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { menuId, text, image } = req.body;

      const block = await blockService.create(menuId, text, image);

      res.json(block);
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

      const blocks = await blockService.update(updates as any);

      return res.json(blocks);
    } catch (error) {
      next(error);
    }
  }
}

export const blockController = new BlockController();
