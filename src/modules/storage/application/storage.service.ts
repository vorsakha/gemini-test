import { promises as fs } from "fs";
import path from "path";
import os from "os";
import File from "@/modules/reading/domain/models/file.entity";

class StorageService {
  private readonly tempDir: string;

  constructor() {
    this.tempDir = os.tmpdir();
  }

  async saveBase64Image(base64Image: string, fileName: string): Promise<File> {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const fileExtension = this.getImageExtension(base64Image) || ".png";

    const image_url = path.join(this.tempDir, `${fileName}${fileExtension}`);
    const mime_type = this.getMimeTypeFromPath(image_url);

    await fs.writeFile(image_url, buffer);

    return new File(fileName, mime_type, image_url);
  }

  private getImageExtension(base64Image: string): string | null {
    const matches = base64Image.match(/^data:image\/(\w+);base64,/);
    if (matches && matches[1]) {
      switch (matches[1].toLowerCase()) {
        case "png":
          return ".png";
        case "jpeg":
        case "jpg":
          return ".jpg";
        default:
          return `.${matches[1]}`;
      }
    }
    return null;
  }

  private getMimeTypeFromPath(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case ".png":
        return "image/png";
      case ".jpg":
      case ".jpeg":
        return "image/jpeg";
      default:
        return "image/png";
    }
  }
}

export default StorageService;
