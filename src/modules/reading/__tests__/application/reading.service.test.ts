import {
  ConfirmationDuplicateException,
  DoubleReportException,
  MeasureNotFoundException,
  MeasuresNotFoundException,
} from "@/exceptions";
import StorageService from "@/modules/storage/application/storage.service";
import ReadingRepository from "@/modules/reading/domain/repositories/reading.repository";
import GeminiService from "@/modules/reading/application/gemini.service";
import { FileDto } from "@/modules/reading/validations/file.validation";
import Reading from "@/modules/reading/domain/models/reading.entity";
import MeasureType from "@/modules/reading/domain/models/measure-type.enum";
import { mock, MockProxy } from "jest-mock-extended";
import ReadingService from "@/modules/reading/application/reading.service";
import File from "@/modules/reading/domain/models/file.entity";

describe("ReadingService", () => {
  let readingService: ReadingService;
  let mockReadingRepository: MockProxy<ReadingRepository>;
  let mockGeminiService: MockProxy<GeminiService>;
  let mockStorageService: MockProxy<StorageService>;

  beforeEach(() => {
    mockReadingRepository = mock<ReadingRepository>();
    mockGeminiService = mock<GeminiService>();
    mockStorageService = mock<StorageService>();

    readingService = new ReadingService(
      mockReadingRepository,
      mockGeminiService,
      mockStorageService
    );
  });

  describe("create", () => {
    it("should create a new reading successfully", async () => {
      const mockFile: FileDto = {
        image: "base64-image-string",
        measure_datetime: new Date("08-29-2024"),
        measure_type: MeasureType.GAS,
        customer_code: "customer123",
      };

      const mockSavedFile = new File(
        "image-id",
        "image/png",
        "https://example.com/image.png"
      );

      const mockReading = new Reading(
        "uuid",
        mockSavedFile.image_url,
        123.45,
        MeasureType.GAS,
        new Date("08-29-2024"),
        "customer123",
        false
      );
      const mockMeasureValue = 123.45;

      mockReadingRepository.findByMonthAndType.mockResolvedValueOnce(undefined);
      mockStorageService.saveBase64Image.mockResolvedValueOnce(mockSavedFile);
      mockGeminiService.processInvoiceData.mockResolvedValueOnce(
        mockMeasureValue
      );
      mockReadingRepository.create.mockResolvedValueOnce(mockReading);

      const result = await readingService.create(mockFile);

      expect(mockReadingRepository.findByMonthAndType).toHaveBeenCalledWith(
        mockFile.measure_datetime,
        mockFile.measure_type
      );
      expect(mockStorageService.saveBase64Image).toHaveBeenCalledWith(
        mockFile.image,
        mockFile.measure_datetime.toISOString()
      );
      expect(mockGeminiService.processInvoiceData).toHaveBeenCalledWith(
        mockSavedFile
      );
      expect(mockReadingRepository.create).toHaveBeenCalled();
      expect(result.measure_value).toBe(mockMeasureValue);
      expect(result.customer_code).toBe(mockFile.customer_code);
    });

    it("should throw DoubleReportException if reading already exists for the month and type", async () => {
      const mockFile: FileDto = {
        image: "base64-image-string",
        measure_datetime: new Date("08-29-2024"),
        measure_type: MeasureType.GAS,
        customer_code: "customer123",
      };

      mockReadingRepository.findByMonthAndType.mockResolvedValueOnce(
        new Reading(
          "uuid",
          "image-url",
          123.45,
          MeasureType.GAS,
          new Date("08-29-2024"),
          "customer123",
          false
        )
      );

      await expect(readingService.create(mockFile)).rejects.toThrow(
        new DoubleReportException("Leitura do mês já realizada")
      );

      expect(mockReadingRepository.findByMonthAndType).toHaveBeenCalledWith(
        mockFile.measure_datetime,
        mockFile.measure_type
      );
      expect(mockStorageService.saveBase64Image).not.toHaveBeenCalled();
      expect(mockGeminiService.processInvoiceData).not.toHaveBeenCalled();
    });
  });

  describe("confirm", () => {
    it("should confirm a reading successfully", async () => {
      const measure_uuid = "measure-uuid";
      const confirmed_value = 200;
      const mockReading = new Reading(
        "uuid",
        "image-url",
        123.45,
        MeasureType.GAS,
        new Date("08-29-2024"),
        "customer123",
        false
      );

      mockReadingRepository.findById.mockResolvedValueOnce(mockReading);

      await readingService.confirm(measure_uuid, confirmed_value);

      expect(mockReadingRepository.findById).toHaveBeenCalledWith(measure_uuid);
      expect(mockReadingRepository.update).toHaveBeenCalledWith(
        measure_uuid,
        confirmed_value
      );
    });

    it("should throw MeasureNotFoundException if reading is not found", async () => {
      const measure_uuid = "non-existent-uuid";
      const confirmed_value = 200;

      mockReadingRepository.findById.mockResolvedValueOnce(undefined);

      await expect(
        readingService.confirm(measure_uuid, confirmed_value)
      ).rejects.toThrow(new MeasureNotFoundException("Leitura não encontrada"));

      expect(mockReadingRepository.findById).toHaveBeenCalledWith(measure_uuid);
      expect(mockReadingRepository.update).not.toHaveBeenCalled();
    });

    it("should throw ConfirmationDuplicateException if reading is already confirmed", async () => {
      const measure_uuid = "measure-uuid";
      const confirmed_value = 200;
      const mockReading = new Reading(
        measure_uuid,
        "image-url",
        123.45,
        MeasureType.GAS,
        new Date("08-29-2024"),
        "customer123",
        true
      );

      mockReadingRepository.findById.mockResolvedValueOnce(mockReading);

      await expect(
        readingService.confirm(measure_uuid, confirmed_value)
      ).rejects.toThrow(
        new ConfirmationDuplicateException("Leitura já confirmada")
      );

      expect(mockReadingRepository.findById).toHaveBeenCalledWith(measure_uuid);
      expect(mockReadingRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("findByCustomerCode", () => {
    it("should return readings by customer code", async () => {
      const customerCode = "customer123";
      const measureType = MeasureType.GAS;
      const mockReadings = [
        new Reading(
          "uuid",
          "image-url",
          123.45,
          MeasureType.GAS,
          new Date("08-29-2024"),
          "customer123",
          false
        ),
        new Reading(
          "uuid2",
          "image-url2",
          125,
          MeasureType.GAS,
          new Date("08-29-2024"),
          "customer1234",
          false
        ),
      ];

      mockReadingRepository.findByCustomerCode.mockResolvedValueOnce(
        mockReadings
      );

      const result = await readingService.findByCustomerCode(
        customerCode,
        measureType
      );

      expect(mockReadingRepository.findByCustomerCode).toHaveBeenCalledWith(
        customerCode,
        measureType
      );
      expect(result).toEqual(mockReadings);
    });

    it("should throw MeasuresNotFoundException if no readings are found", async () => {
      const customerCode = "customer123";
      const measureType = MeasureType.WATER;

      mockReadingRepository.findByCustomerCode.mockResolvedValueOnce([]);

      await expect(
        readingService.findByCustomerCode(customerCode, measureType)
      ).rejects.toThrow(
        new MeasuresNotFoundException("Nenhuma leitura encontrada")
      );

      expect(mockReadingRepository.findByCustomerCode).toHaveBeenCalledWith(
        customerCode,
        measureType
      );
    });
  });
});
