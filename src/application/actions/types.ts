/**
 * @file types.ts
 * @description Standardized action result pattern for all Next.js Server Actions.
 * Guarantees a strongly typed, discriminated union response that cleanly separates
 * successful domain outputs from operational and field-level validation errors.
 * @module application/actions
 */

export type ActionResult<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      error: string;
      errors?: Record<string, string[]>;
    };
