
import { z } from 'zod';

export const emailSchema = z.string()
  .email("Format d'email invalide")
  .min(1, "L'email est requis");

export const passwordSchema = z.string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

export const titleSchema = z.string()
  .min(1, "Le titre est requis")
  .max(200, "Le titre ne peut pas dépasser 200 caractères")
  .trim();

export const contentSchema = z.string()
  .min(1, "Le contenu est requis")
  .max(10000, "Le contenu ne peut pas dépasser 10 000 caractères");

export const nameSchema = z.string()
  .min(1, "Le nom est requis")
  .max(100, "Le nom ne peut pas dépasser 100 caractères")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets")
  .trim();

export const fileNameSchema = z.string()
  .min(1, "Le nom du fichier est requis")
  .max(255, "Le nom du fichier ne peut pas dépasser 255 caractères")
  .regex(/^[^<>:"/\\|?*]+$/, "Le nom du fichier contient des caractères non autorisés");

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};
