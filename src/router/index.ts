import { Router } from "express";
import { body } from "express-validator";
import { isAuthenticated } from "../middlewares";
import {
  userController,
  menuController,
  blockController,
} from "../controllers";

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
router.delete("/menus", isAuthenticated, menuController.delete);
router.put("/menus", isAuthenticated, menuController.update);

router.post(
  "/blocks",
  isAuthenticated,
  body("menuId").isString(),
  blockController.create
);
router.get("/blocks", isAuthenticated, blockController.get);
router.put("/blocks", isAuthenticated, blockController.update);
router.delete("/blocks", isAuthenticated, blockController.delete);

router.get("/menus-public", menuController.getPublic);

export default router;
