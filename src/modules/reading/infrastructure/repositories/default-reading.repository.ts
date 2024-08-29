import { DateTime } from "luxon";
import MeasureType from "@/modules/reading/domain/models/measure-type.enum";
import ReadingRepository from "@/modules/reading/domain/repositories/reading.repository";
import Reading from "@/modules/reading/domain/models/reading.entity";

class DefaultReadingRepository implements ReadingRepository {
  private tempData: Reading[] = [];

  async findById(id: string): Promise<Reading | undefined> {
    return this.tempData.find((reading) => reading.measure_uuid === id);
  }

  async findByMonthAndType(
    date: Date,
    type: MeasureType
  ): Promise<Reading | undefined> {
    return this.tempData.find(
      (reading) =>
        reading.measure_type === type &&
        DateTime.fromISO(reading.measure_datetime.toISOString()).toFormat(
          "yyyy-MM"
        ) === DateTime.fromJSDate(date).toFormat("yyyy-MM")
    );
  }

  async findByCustomerCode(
    customerCode: string,
    measure_type?: MeasureType
  ): Promise<Reading[]> {
    if (measure_type) {
      return this.tempData.filter(
        (reading) =>
          reading.customer_code === customerCode &&
          reading.measure_type === measure_type
      );
    }

    return this.tempData.filter(
      (reading) => reading.customer_code === customerCode
    );
  }

  async create(reading: Reading): Promise<Reading> {
    this.tempData.push(reading);
    return reading;
  }

  async update(measure_uuid: string, measure_value: number) {
    this.tempData = this.tempData.map((r) => {
      if (r.measure_uuid === measure_uuid) {
        return new Reading(
          r.measure_uuid,
          r.image_url,
          measure_value,
          r.measure_type,
          r.measure_datetime,
          r.customer_code,
          true
        );
      }
      return r;
    });
  }
}

export default DefaultReadingRepository;
