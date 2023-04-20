import { MenusPatch } from "types";
import prisma from "../utils/prisma";
import { imagesService } from "./imagesService";
import { blockService } from "./blockService";

class MenuService {
  async create(
    userId: string,
    title: string,
    description?: string,
    footer?: string,
    image?: string
  ) {
    const data: any = {
      userId,
      title,
      description,
      footer,
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

    return await prisma.menu.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async getWithBlocks(menuId: string) {
    const menu = await prisma.menu.findUnique({ where: { id: menuId } });

    const blocks = await blockService.get(menuId);

    return menu ? Object.assign(menu, { blocks }) : null;
  }

  async delete(id: string) {
    return await prisma.menu.delete({ where: { id } });
  }

  async update(updates: MenusPatch) {
    for (const id in updates) {
      if (updates[id]?.imageUrl) {
        const menu = await prisma.menu.findUnique({
          where: { id },
          select: { title: true },
        });

        if (!menu) return;

        const imageUrl = await imagesService.upload(
          updates[id].imageUrl as string,
          `${menu.title}-avatar`
        );

        updates[id].imageUrl = imageUrl;
      }

      await prisma.menu.update({
        where: { id },
        data: updates[id],
      });
    }
  }
}

export const menuService = new MenuService();
