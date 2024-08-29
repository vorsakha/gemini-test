import z from "zod";
import MeasureType from "@/modules/reading/domain/models/measure-type.enum";

const findByCustomerCodeSchema = z.object({
  customer_code: z.string(),
});

const confirmSchema = z.object({
  measure_uuid: z.string().uuid(),
  confirmed_value: z.number(),
});

const querySchema = z.object({
  measure_type: z.nativeEnum(MeasureType).optional(),
});

type FindByCustomerCodeSchema = z.infer<typeof findByCustomerCodeSchema>;
type ConfirmSchema = z.infer<typeof confirmSchema>;
type QuerySchema = z.infer<typeof querySchema>;

export {
  findByCustomerCodeSchema,
  FindByCustomerCodeSchema,
  confirmSchema,
  ConfirmSchema,
  querySchema,
  QuerySchema,
};
