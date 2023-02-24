import { Router } from "express";
import { body } from "express-validator";
import { isAuthenticated } from "../middlewares";
import { userController, menuController } from "../controllers";

const router = Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("name").isLength({ min: 6, max: 32 }),
  body("password").isLength({ min: 6, max: 32 }),
  userController.register
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);

router.post(
  "/menus",
  isAuthenticated,
  body("title").isString(),
  menuController.create
);
router.get("/menus", isAuthenticated, menuController.get);

export default router;