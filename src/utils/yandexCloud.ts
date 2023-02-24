import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

interface UploadArgs {
  file: any;
  path: string;
  fileName: string;
  contentType: string;
}

class YandexCloud {
  aws: S3Client;

  constructor() {
    this.aws = new S3Client({
      endpoint: "https://storage.yandexcloud.net",
      credentials: {
        accessKeyId: process.env.YDB_KEY_IDENTIFIER as string,
        secretAccessKey: process.env.YDB_KEY as string,
      },
      region: "ru-central1",

      // httpOptions: {
      //   timeout: 10000,
      //   connectTimeout: 10000,
      // },
    });
  }

  upload = async ({ file, path, fileName, contentType }: UploadArgs) => {
    try {
      const filePath = `${path}/${fileName}`;
      const bucketName = "course-project";

      const params = {
        Bucket: bucketName, // название созданного bucket
        Key: filePath, // путь и название файла в облаке (path без слэша впереди)
        Body: file, // сам файл
        ContentType: contentType, // тип файла
        ContentEncoding: "base64",
      };

      const result = await new Promise((resolve, reject) => {
        this.aws.send(new PutObjectCommand(params)).then(
          (data) => {
            console.log(data);
            resolve(data);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      });

      return `https://storage.yandexcloud.net/${bucketName}/${filePath}`;
    } catch (e) {
      console.error(e);
    }
  };
}

export const yandexCloud = new YandexCloud();
