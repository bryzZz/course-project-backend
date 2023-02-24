import prisma from "../utils/prisma";
import { imagesService } from "./imagesService";

class MenuService {
  async createMenu(
    userId: string,
    title: string,
    description?: string,
    image?: string
  ) {
    const data: any = {
      userId,
      title,
      description,
    };

    if (image) {
      const imageUrl = await imagesService.upload(image, `${title}-avatar`);

      data["imageUrl"] = imageUrl;
    }

    const menu = await prisma.menu.create({ data });

    return menu;
  }

  async get(userId: string) {
    const menus = await prisma.menu.findMany({
      where: { userId },
    });

    return menus;
  }

  async delete(id: string) {
    const menu = await prisma.menu.delete({
      where: { id },
    });

    return menu;
  }
}

export const menuService = new MenuService();
