import MeasureType from "@/modules/reading/domain/models/measure-type.enum";

interface ReadingDto {
  measure_uuid: string;
  image_url: string;
  measure_value: number;
  measure_type: MeasureType;
  measure_datetime: Date;
}

export default ReadingDto;
