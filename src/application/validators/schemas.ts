import { z } from "zod";

export const RegistrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long")
    .refine((val) => !/[<>{}\\]/.test(val), {
      message: "Full name contains invalid characters",
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Please provide a valid phone number (minimum 7 characters)")
    .max(30, "Phone number is too long")
    .regex(/^[0-9+\s()./-]+$/, "Please enter a valid phone number format"),
  registrationType: z.enum(["playing_member", "spectator", "vip_patron"], {
    message: "Please choose a valid participation type",
  }),
  partySize: z.coerce.number().int().min(1, "Party size must be at least 1").max(20, "Party size cannot exceed 20").default(1),
  dietaryRequirements: z.string().max(500, "Notes cannot exceed 500 characters").optional().or(z.literal("")),
  emergencyContact: z
    .string()
    .max(120)
    .optional()
    .or(z.literal(""))
    .transform((val) => (val && val.trim().length >= 3 ? val.trim() : "Self / Attendee")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;

export const ContactMessageSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please provide a valid email address"),
  phone: z
    .string()
    .max(35, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  organization: z
    .string()
    .max(100, "Organisation name is too long")
    .optional()
    .or(z.literal("")),
  inquiryType: z
    .enum(["sponsor", "donor", "general", "membership", "other"])
    .default("general"),
  membershipPackage: z
    .string()
    .max(50, "Package identifier is too long")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(3000, "Message is too long"),
});

export type ContactMessageFormData = z.infer<typeof ContactMessageSchema>;

export const MemberApplicationSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Valid phone number required").max(30),
  tier: z.string().min(1, "Membership package/tier is required").max(100),
  handicapOrExperience: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type MemberApplicationFormData = z.infer<typeof MemberApplicationSchema>;
