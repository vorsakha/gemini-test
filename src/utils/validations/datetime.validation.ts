import z from "zod";
import { DateTime } from "luxon";

const dateTimeValidation = () =>
  z
    .string()
    .refine((value) => {
      const utcDate = DateTime.fromISO(value, { zone: "utc" });

      if (!utcDate.isValid) {
        return false;
      }

      return true;
    })
    .transform((value) => new Date(value));

export default dateTimeValidation;
