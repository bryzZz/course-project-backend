import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "./types";
import { ApiError } from "./exceptions/ApiError";
import { tokenService } from "./service/tokenService";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: "Unexpected error" });
}

export function isAuthenticated(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(ApiError.Unauthorized());
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return next(ApiError.Unauthorized());
    }

    const userData = tokenService.validateAccessToken(token);

    if (!userData) {
      return next(ApiError.Unauthorized());
    }

    req.user = userData;
  } catch (err: any) {
    return next(ApiError.Unauthorized());
  }

  return next();
}
