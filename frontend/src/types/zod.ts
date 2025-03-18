import { z } from "zod";

export interface ZodValidationError {
  errors: Array<{
    path: string[];
    message: string;
  }>;
}

export function isZodError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError;
}
