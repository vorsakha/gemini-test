import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "@/modules/support/sanitized-config";
import File from "@/modules/reading/domain/models/file.entity";

class GeminiService {
  private fileManager: GoogleAIFileManager;

  private genAI: GoogleGenerativeAI;

  constructor() {
    this.fileManager = new GoogleAIFileManager(config.GEMINI_API_KEY);
    this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  }

  async processInvoiceData(
    file: File,
    prompt = "Extract only the total amount due from this invoice and return it as a number."
  ): Promise<number> {
    const uploadResponse = await this.fileManager.uploadFile(file.image_url, {
      mimeType: file.mime_type,
      displayName: file.id,
    });

    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: prompt,
      },
    ]);

    const numericValue = parseFloat(
      result.response.text().replace(/[^0-9.-]+/g, "")
    );

    return numericValue;
  }
}

export default GeminiService;
