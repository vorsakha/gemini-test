import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST } from "http-status";
import { ZodSchema, z } from "zod";

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = { ...req.query, ...schema.parse(req.query) };
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { fieldErrors: error_description } = error.flatten();

        res.status(BAD_REQUEST).send({
          error_code: "INVALID_DATA",
          error_description,
        });
      } else {
        next(error);
      }
    }
  };
};

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { fieldErrors: error_description } = error.flatten();

        res.status(BAD_REQUEST).send({
          error_code: "INVALID_DATA",
          error_description,
        });
      } else {
        next(error);
      }
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { fieldErrors: error_description } = error.flatten();

        res.status(BAD_REQUEST).send({
          error_code: "INVALID_DATA",
          error_description,
        });
      } else {
        next(error);
      }
    }
  };
};
