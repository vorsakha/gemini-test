import MeasureType from "@/modules/reading/domain/models/measure-type.enum";
import Reading from "@/modules/reading/domain/models/reading.entity";

interface ReadingRepository {
  findById(id: string): Promise<Reading | undefined>;
  findByMonthAndType(
    date: Date,
    type: MeasureType
  ): Promise<Reading | undefined>;
  findByCustomerCode(
    custome_code: string,
    measure_type?: MeasureType
  ): Promise<Reading[]>;
  create(reading: Reading): Promise<Reading>;
  update(measure_uuid: string, measure_value: number): void;
}

export default ReadingRepository;
