import prisma from "../utils/prisma";
import { yandexCloud } from "../utils/yandexCloud";

class ImagesService {
  async upload(imageBase64: string, name: string) {
    const buf = Buffer.from(
      imageBase64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = imageBase64.split(";")[0].split("/")[1];
    const fileName = `${name}.${type}`;

    return await yandexCloud.upload({
      file: buf,
      path: "images",
      contentType: `image/${type}`,
      fileName,
    });
  }
}

export const imagesService = new ImagesService();
