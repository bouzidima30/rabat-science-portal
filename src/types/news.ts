
export type NewsCategory = 
  | "reunion_travail"
  | "nouvelles_informations" 
  | "activites_parauniversitaire"
  | "avis_etudiants"
  | "avis_enseignants"
  | "evenements_scientifique";

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: NewsCategory;
  image_url: string | null;
  document_url: string | null;
  document_name: string | null;
  published: boolean;
  created_at: string;
  author_id: string | null;
}
