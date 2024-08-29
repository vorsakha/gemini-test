import ReadingDto from "@/modules/reading/domain/dto/reading.dto";

class ReadingPresenter {
  readonly image_url: string;

  readonly measure_value: number;

  readonly measure_uuid: string;

  constructor(dto: ReadingDto) {
    this.image_url = dto.image_url;
    this.measure_value = dto.measure_value;
    this.measure_uuid = dto.measure_uuid;
  }
}

export default ReadingPresenter;
