import { Block } from "@prisma/client";
import prisma from "../utils/prisma";
import { imagesService } from "./imagesService";

class BlockService {
  async create(menuId: string, text: string, image?: string) {
    const max = await prisma.block.aggregate({
      where: { menuId },
      _max: {
        place: true,
      },
    });

    const data: any = {
      menuId,
      place: (max._max.place ?? -1) + 1,
      text,
    };

    if (image) {
      const imageUrl = await imagesService.upload(image, `${text}-avatar`);

      data["imageUrl"] = imageUrl;
    }

    const block = await prisma.block.create({ data });

    return block;
  }

  async get(menuId: string) {
    return await prisma.block.findMany({
      where: { menuId },
      orderBy: { place: "asc" },
    });
  }

  async update(updates: Partial<Block>[]) {
    console.log("updates", updates);

    updates.forEach(async (value) => {
      if (value.id) {
        await prisma.block.update({
          where: { id: value.id },
          data: value,
        });
      }
    });

    // const ids = updates.map(({ id }) => id as string);

    // return await prisma.block.updateMany({
    //   where: { id: { in: ids } },
    //   data: {},
    // });

    // return await prisma.block.findMany({
    //   where: { menuId },
    //   orderBy: { place: "asc" },
    // });
  }
}

export const blockService = new BlockService();
