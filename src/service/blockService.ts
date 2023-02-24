import prisma from "../utils/prisma";
import { imagesService } from "./imagesService";

class BlockService {
  async create(menuId: string, text: string, image?: string) {
    const data: any = {
      menuId,
      place: 0,
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
    return await prisma.block.findMany({ where: { menuId } });
  }
}

export const blockService = new BlockService();
