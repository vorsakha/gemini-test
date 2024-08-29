import { promises as fs } from "fs";
import path from "path";
import os from "os";
import File from "@/modules/reading/domain/models/file.entity";
import StorageService from "@/modules/storage/application/storage.service";

jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(),
  },
}));

describe("StorageService", () => {
  let storageService: StorageService;

  beforeEach(() => {
    storageService = new StorageService();
  });

  describe("saveBase64Image", () => {
    it("should save a base64 image to a file and return a File object", async () => {
      const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
      const fileName = "test_image";

      const tempDir = os.tmpdir();
      const expectedPath = path.join(tempDir, `${fileName}.png`);
      const expectedMimeType = "image/png";

      const file = await storageService.saveBase64Image(base64Image, fileName);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expectedPath,
        expect.any(Buffer)
      );
      expect(file).toBeInstanceOf(File);
      expect(file.id).toBe(fileName);
      expect(file.mime_type).toBe(expectedMimeType);
      expect(file.image_url).toBe(expectedPath);
    });

    it("should correctly handle JPEG base64 image input", async () => {
      const base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/";
      const fileName = "test_image_jpeg";

      const tempDir = os.tmpdir();
      const expectedPath = path.join(tempDir, `${fileName}.jpg`);
      const expectedMimeType = "image/jpeg";

      const file = await storageService.saveBase64Image(base64Image, fileName);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expectedPath,
        expect.any(Buffer)
      );
      expect(file).toBeInstanceOf(File);
      expect(file.id).toBe(fileName);
      expect(file.mime_type).toBe(expectedMimeType);
      expect(file.image_url).toBe(expectedPath);
    });

    it("should save a base64 image with a default .png extension if no extension is detected", async () => {
      const base64Image = "data:image;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
      const fileName = "test_image_unknown";

      const tempDir = os.tmpdir();
      const expectedPath = path.join(tempDir, `${fileName}.png`);
      const expectedMimeType = "image/png";

      const file = await storageService.saveBase64Image(base64Image, fileName);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expectedPath,
        expect.any(Buffer)
      );
      expect(file).toBeInstanceOf(File);
      expect(file.id).toBe(fileName);
      expect(file.mime_type).toBe(expectedMimeType);
      expect(file.image_url).toBe(expectedPath);
    });
  });
});
