import Reading from "@/modules/reading/domain/models/reading.entity";

interface PartialReading {
  measure_uuid: string;
  image_url: string;
  measure_type: string;
  measure_datetime: string;
  has_confirmed: boolean;
}

class ReadingListPresenter {
  readonly customer_code: string;

  readonly measures: PartialReading[];

  constructor(customer_code: string, measures: Reading[]) {
    this.customer_code = customer_code;
    this.measures = measures.map((measure) => ({
      measure_uuid: measure.measure_uuid,
      image_url: measure.image_url,
      measure_type: measure.measure_type,
      measure_datetime: measure.measure_datetime.toISOString(),
      has_confirmed: measure.has_confirmed,
    }));
  }
}

export default ReadingListPresenter;
