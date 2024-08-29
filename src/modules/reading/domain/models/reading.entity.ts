import MeasureType from "@/modules/reading/domain/models/measure-type.enum";

class Reading {
  measure_uuid: string;

  image_url: string;

  measure_value: number;

  measure_type: MeasureType;

  measure_datetime: Date;

  customer_code: string;

  has_confirmed: boolean;

  constructor(
    measure_uuid: string,
    image_url: string,
    measure_value: number,
    measure_type: MeasureType,
    measure_datetime: Date,
    customer_code: string,
    has_confirmed = false
  ) {
    this.measure_uuid = measure_uuid;
    this.image_url = image_url;
    this.measure_value = measure_value;
    this.measure_type = measure_type;
    this.measure_datetime = measure_datetime;
    this.customer_code = customer_code;
    this.has_confirmed = has_confirmed;
  }
}

export default Reading;
