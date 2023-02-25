import prisma from "../utils/prisma";
import { imagesService } from "./imagesService";

class MenuService {
  async create(
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

  async get(userId: string, menuId?: string) {
    if (menuId) {
      return await prisma.menu.findUnique({ where: { id: menuId } });
    }

    return await prisma.menu.findMany({ where: { userId } });
  }

  async getWithBlocks(menuId: string) {
    return await prisma.menu.findUnique({
      where: { id: menuId },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        Blocks: true,
      },
    });
  }

  async delete(id: string) {
    return await prisma.menu.delete({ where: { id } });
  }
}

export const menuService = new MenuService();
