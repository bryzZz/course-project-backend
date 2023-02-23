import prisma from "../utils/prisma";

class MenuService {
  async createMenu(userId: string, title: string) {
    const menu = await prisma.menu.create({
      data: {
        userId,
        title,
      },
    });

    return menu;
  }

  async get(userId: string) {
    const menus = await prisma.menu.findMany({
      where: { userId },
    });

    return menus;
  }
}

export const menuService = new MenuService();
