import { v4 as guid } from "uuid";
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

class ReadingService {
  private readingRepository: ReadingRepository;

  private geminiService: GeminiService;

  private storageService: StorageService;

  constructor(
    readingRepository: ReadingRepository,
    geminiService: GeminiService,
    storageService: StorageService
  ) {
    this.readingRepository = readingRepository;
    this.geminiService = geminiService;
    this.storageService = storageService;
  }

  async create(reading: FileDto): Promise<Reading> {
    const existingReading = await this.readingRepository.findByMonthAndType(
      reading.measure_datetime,
      reading.measure_type
    );

    if (existingReading) {
      throw new DoubleReportException("Leitura do mês já realizada");
    }

    const file = await this.storageService.saveBase64Image(
      reading.image,
      reading.measure_datetime.toISOString()
    );

    const measure_value = await this.geminiService.processInvoiceData(file);

    const newReading = new Reading(
      guid(),
      file.image_url,
      measure_value,
      reading.measure_type,
      reading.measure_datetime,
      reading.customer_code
    );

    return this.readingRepository.create(newReading);
  }

  async confirm(measure_uuid: string, confirmed_value: number) {
    const reading = await this.readingRepository.findById(measure_uuid);

    if (!reading) {
      throw new MeasureNotFoundException("Leitura não encontrada");
    }

    if (reading.has_confirmed) {
      throw new ConfirmationDuplicateException("Leitura já confirmada");
    }

    this.readingRepository.update(measure_uuid, confirmed_value);
  }

  async findByCustomerCode(
    customerCode: string,
    measure_type?: MeasureType
  ): Promise<Reading[]> {
    const readings = await this.readingRepository.findByCustomerCode(
      customerCode,
      measure_type
    );

    if (!readings.length) {
      throw new MeasuresNotFoundException("Nenhuma leitura encontrada");
    }

    return readings;
  }
}

export default ReadingService;
