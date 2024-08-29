import { mock, MockProxy } from "jest-mock-extended";
import {
  FileMetadataResponse,
  FileState,
  GoogleAIFileManager,
} from "@google/generative-ai/server";
import {
  EnhancedGenerateContentResponse,
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import File from "@/modules/reading/domain/models/file.entity";
import GeminiService from "@/modules/reading/application/gemini.service";

jest.mock("@google/generative-ai/server");
jest.mock("@google/generative-ai");

describe("GeminiService", () => {
  let geminiService: GeminiService;
  let mockFileManager: MockProxy<GoogleAIFileManager>;
  let mockGenAI: MockProxy<GoogleGenerativeAI>;
  let mockFile: File;
  let mockFileResponse: FileMetadataResponse;
  let mockModel: MockProxy<GenerativeModel>;

  beforeEach(() => {
    mockFileManager = mock<GoogleAIFileManager>();
    mockGenAI = mock<GoogleGenerativeAI>();
    mockModel = mock<GenerativeModel>();

    (GoogleAIFileManager as jest.Mock).mockImplementation(
      () => mockFileManager
    );
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => mockGenAI);

    geminiService = new GeminiService();

    mockFile = new File(
      "test-file-id",
      "application/pdf",
      "https://example.com/invoice.pdf"
    );

    mockFileResponse = {
      mimeType: mockFile.mime_type,
      uri: "gs://bucket/invoice.pdf",
      name: mockFile.id,
      sizeBytes: "1024",
      createTime: "2023-01-01T00:00:00Z",
      updateTime: "2023-01-01T00:00:00Z",
      expirationTime: "2023-01-01T00:00:00Z",
      sha256Hash: "hash",
      state: FileState.ACTIVE,
    };
  });

  it("should process invoice data and return the total amount due as a number", async () => {
    mockFileManager.uploadFile.mockResolvedValue({
      file: mockFileResponse,
    });

    mockGenAI.getGenerativeModel.mockReturnValueOnce(mockModel);

    mockModel.generateContent.mockResolvedValue({
      response: {
        text: () => "R$123.45",
      } as unknown as EnhancedGenerateContentResponse,
    });

    const totalAmount = await geminiService.processInvoiceData(mockFile);

    expect(mockFileManager.uploadFile).toHaveBeenCalledWith(
      mockFile.image_url,
      {
        mimeType: mockFile.mime_type,
        displayName: mockFile.id,
      }
    );
    expect(mockModel.generateContent).toHaveBeenCalledWith([
      {
        fileData: {
          mimeType: mockFile.mime_type,
          fileUri: "gs://bucket/invoice.pdf",
        },
      },
      {
        text: "Extract only the total amount due from this invoice and return it as a number.",
      },
    ]);
    expect(totalAmount).toBe(123.45);
  });

  it("should return NaN (albeit falsy) if the generated content does not contain a valid number", async () => {
    mockFileManager.uploadFile.mockResolvedValue({
      file: mockFileResponse,
    });

    mockGenAI.getGenerativeModel.mockReturnValueOnce(mockModel);

    mockModel.generateContent.mockResolvedValue({
      response: {
        text: () => "No valid number here",
      } as unknown as EnhancedGenerateContentResponse,
    });

    const totalAmount = await geminiService.processInvoiceData(mockFile);

    expect(totalAmount).toBeNaN();
  });
});
