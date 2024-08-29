import MeasureType from "@/modules/reading/domain/models/measure-type.enum";
import Reading from "@/modules/reading/domain/models/reading.entity";
import DefaultReadingRepository from "@/modules/reading/infrastructure/repositories/default-reading.repository";

describe("DefaultReadingRepository", () => {
  let repository: DefaultReadingRepository;

  beforeEach(() => {
    repository = new DefaultReadingRepository();
  });

  describe("findById", () => {
    it("should return the reading by id if it exists", async () => {
      const reading = new Reading(
        "123",
        "https://example.com/image.png",
        100,
        MeasureType.GAS,
        new Date("08-29-2024"),
        "customer123"
      );

      await repository.create(reading);

      const result = await repository.findById("123");
      expect(result).toEqual(reading);
    });

    it("should return undefined if the reading does not exist", async () => {
      const result = await repository.findById("non-existent-id");
      expect(result).toBeUndefined();
    });
  });

  describe("findByMonthAndType", () => {
    it("should return the reading by month and type if it exists", async () => {
      const reading = new Reading(
        "123",
        "https://example.com/image.png",
        100,
        MeasureType.GAS,
        new Date("08-28-2024"),
        "customer123"
      );

      await repository.create(reading);

      const result = await repository.findByMonthAndType(
        new Date("08-01-2024"),
        MeasureType.GAS
      );
      expect(result).toEqual(reading);
    });

    it("should return undefined if no reading matches the month and type", async () => {
      const reading = new Reading(
        "123",
        "https://example.com/image.png",
        100,
        MeasureType.WATER,
        new Date("08-29-2024"),
        "customer123"
      );

      await repository.create(reading);

      const result = await repository.findByMonthAndType(
        new Date("08-01-2024"),
        MeasureType.GAS
      );
      expect(result).toBeUndefined();
    });
  });

  describe("findByCustomerCode", () => {
    it("should return all readings by customer code", async () => {
      const reading1 = new Reading(
        "123",
        "https://example.com/image1.png",
        100,
        MeasureType.GAS,
        new Date("08-29-2024"),
        "customer123"
      );
      const reading2 = new Reading(
        "456",
        "https://example.com/image2.png",
        150,
        MeasureType.WATER,
        new Date("07-15-2024"),
        "customer123"
      );

      await repository.create(reading1);
      await repository.create(reading2);

      const result = await repository.findByCustomerCode("customer123");
      expect(result).toEqual([reading1, reading2]);
    });

    it("should return all readings by customer code and measure type", async () => {
      const reading1 = new Reading(
        "123",
        "https://example.com/image1.png",
        100,
        MeasureType.GAS,
        new Date("08-29-2024"),
        "customer123"
      );
      const reading2 = new Reading(
        "456",
        "https://example.com/image2.png",
        150,
        MeasureType.WATER,
        new Date("07-15-2024"),
        "customer123"
      );

      await repository.create(reading1);
      await repository.create(reading2);

      const result = await repository.findByCustomerCode(
        "customer123",
        MeasureType.WATER
      );
      expect(result).toEqual([reading2]);
    });

    it("should return an empty array if no readings match the criteria", async () => {
      const result = await repository.findByCustomerCode(
        "non-existent-customer"
      );
      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("should add a new reading to the repository", async () => {
      const reading = new Reading(
        "123",
        "https://example.com/image.png",
        100,
        MeasureType.GAS,
        new Date("08-29-2024"),
        "customer123"
      );

      const result = await repository.create(reading);
      expect(result).toEqual(reading);

      const storedReading = await repository.findById("123");
      expect(storedReading).toEqual(reading);
    });
  });

  describe("update", () => {
    it("should update the measure value of an existing reading", async () => {
      const reading = new Reading(
        "123",
        "https://example.com/image.png",
        100,
        MeasureType.GAS,
        new Date("08-29-2024"),
        "customer123"
      );

      await repository.create(reading);

      await repository.update("123", 200);

      const updatedReading = await repository.findById("123");
      expect(updatedReading?.measure_value).toBe(200);
      expect(updatedReading?.has_confirmed).toBe(true);
    });

    it("should not update any reading if the measure_uuid does not exist", async () => {
      const reading = new Reading(
        "123",
        "https://example.com/image.png",
        100,
        MeasureType.GAS,
        new Date("08-29-2024"),
        "customer123"
      );

      await repository.create(reading);

      await repository.update("non-existent-uuid", 200);

      const unchangedReading = await repository.findById("123");
      expect(unchangedReading?.measure_value).toBe(100);
      expect(unchangedReading?.has_confirmed).toBe(false);
    });
  });
});
