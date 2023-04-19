import { Block, Dish, Separator } from "@prisma/client";
import { BlocksPatch } from "types";
import prisma from "../utils/prisma";
import { imagesService } from "./imagesService";

class BlockService {
  async createDish(
    menuId: string,
    blockId: string,
    dataId: string,
    name: string,
    image: string,
    description: string
  ) {
    const max = await prisma.block.aggregate({
      where: { menuId },
      _max: {
        place: true,
      },
    });

    const imageUrl = (await imagesService.upload(
      image,
      `${name}-avatar`
    )) as string;

    const block = await prisma.block.create({
      data: {
        id: blockId,
        menuId,
        place: (max._max.place ?? -1) + 1,
        type: "DISH",
        Dish: {
          create: { id: dataId, imageUrl, name, description },
        },
      },
    });

    const dish = await prisma.dish.findUnique({ where: { blockId: block.id } });

    return Object.assign(block, { data: dish });
  }

  async createSeparator(
    menuId: string,
    blockId: string,
    dataId: string,
    text: string
  ) {
    const max = await prisma.block.aggregate({
      where: { menuId },
      _max: {
        place: true,
      },
    });

    const block = await prisma.block.create({
      data: {
        id: blockId,
        menuId,
        place: (max._max.place ?? -1) + 1,
        type: "SEPARATOR",
        Separator: {
          create: { id: dataId, text },
        },
      },
    });

    const separator = await prisma.separator.findUnique({
      where: { blockId: block.id },
    });

    return Object.assign(block, { data: separator });
  }

  async get(menuId: string) {
    const blocks = await prisma.block.findMany({
      where: { menuId },
      orderBy: { place: "asc" },
    });

    const ids = blocks.map((block) => block.id);

    const dishes = await prisma.dish.findMany({
      where: { blockId: { in: ids } },
    });

    const separators = await prisma.separator.findMany({
      where: { blockId: { in: ids } },
    });

    const res = blocks as Array<Block & { data: Dish | Separator }>;

    dishes.forEach((dish) => {
      const block = res.find((block) => block.id === dish.blockId);

      if (block) {
        block.data = dish;
      }
    });

    separators.forEach((separator) => {
      const block = res.find((block) => block.id === separator.blockId);

      if (block) {
        block.data = separator;
      }
    });

    return res;
  }

  async update(updates: BlocksPatch) {
    for (const id in updates) {
      await prisma.block.update({
        where: { id },
        data: updates[id],
      });
    }
  }
}

export const blockService = new BlockService();
