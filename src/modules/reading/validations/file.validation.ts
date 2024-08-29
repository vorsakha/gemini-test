import z from "zod";
import dateTimeValidation from "@/utils/validations/datetime.validation";
import MeasureType from "@/modules/reading/domain/models/measure-type.enum";

const fileValidation = z.object({
  customer_code: z.string(),
  measure_datetime: dateTimeValidation(),
  measure_type: z.nativeEnum(MeasureType),
  image: z
    .string()
    .refine(
      (value) => {
        try {
          const base64Pattern =
            /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
          const isValidBase64 = base64Pattern.test(value.split(",")[1] || "");
          if (!isValidBase64) return false;

          const buffer = Buffer.from(value.split(",")[1], "base64");

          return buffer.toString("base64") === (value.split(",")[1] || "");
        } catch (e) {
          return false;
        }
      },
      {
        message: "Must be a valid base64 string",
      }
    )
    .refine(
      (base64Str) => {
        const imagePrefixes = [
          "data:image/jpeg;base64,",
          "data:image/png;base64,",
        ];

        return imagePrefixes.some((prefix) => base64Str.startsWith(prefix));
      },
      {
        message: "The base64 string must represent an image",
      }
    ),
});

export type FileDto = z.infer<typeof fileValidation>;

export default fileValidation;
