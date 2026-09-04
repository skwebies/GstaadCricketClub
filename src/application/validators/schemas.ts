import { z } from "zod";

export const RegistrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  email: z.string().email("Please provide a valid email address"),
  phone: z
    .string()
    .min(7, "Please provide a valid phone number")
    .max(30, "Phone number is too long"),
  registrationType: z.enum(["playing_member", "spectator", "vip_patron"], {
    message: "Please choose a valid participation type",
  }),
  partySize: z.coerce.number().int().min(1).max(20).default(1),
  dietaryRequirements: z.string().max(300).optional().or(z.literal("")),
  emergencyContact: z
    .string()
    .min(3, "Emergency contact name or phone is required")
    .max(120),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;

export const ContactMessageSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please provide a valid email address"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export type ContactMessageFormData = z.infer<typeof ContactMessageSchema>;

export const MemberApplicationSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone number required").max(30),
  tier: z.enum(["Full Playing", "Social Member", "Junior", "Patron"]),
  handicapOrExperience: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type MemberApplicationFormData = z.infer<typeof MemberApplicationSchema>;
