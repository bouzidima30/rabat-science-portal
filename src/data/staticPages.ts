export interface StaticPage {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  category: string;
}

export const STATIC_PAGES: StaticPage[] = [
  // Présentation
  { title: "Mot du Doyen", description: "Message du Doyen de la Faculté des Sciences de Rabat.", url: "/presentation/mot-doyen", category: "Présentation", keywords: ["doyen", "decanat", "benaini"] },
  { title: "Projet de Développement", description: "Projet de Développement de l'Établissement (PDE) 2025-2029.", url: "/presentation/projet-developpement", category: "Présentation", keywords: ["pde", "strategie", "developpement"] },
  { title: "Historique de la FSR", description: "Histoire de la Faculté des Sciences de Rabat.", url: "/presentation/historique", category: "Présentation", keywords: ["histoire", "fondation"] },
  { title: "Organisation", description: "Organigramme et organisation de la FSR.", url: "/presentation/organisation", category: "Présentation", keywords: ["organigramme", "structure"] },
  { title: "FSR en Chiffres", description: "Statistiques et chiffres clés de la Faculté.", url: "/presentation/fsr-chiffres", category: "Présentation", keywords: ["statistiques", "chiffres"] },
  { title: "Représentants", description: "Représentants étudiants et personnels.", url: "/presentation/representants", category: "Présentation" },

  // Formations
  { title: "Formations", description: "Toutes les formations proposées par la FSR.", url: "/formations", category: "Formations" },
  { title: "Guide LMD", description: "Guide du système Licence-Master-Doctorat.", url: "/formations/lmd-guide", category: "Formations", keywords: ["lmd", "guide"] },
  { title: "Formation Licence", description: "Formations en cycle Licence.", url: "/formations/formation-licence", category: "Formations" },
  { title: "Formation Master", description: "Formations en cycle Master.", url: "/formations/formation-master", category: "Formations" },
  { title: "Formation Doctorat", description: "Formations en cycle Doctorat.", url: "/formations/formation-doctorat", category: "Formations", keywords: ["these", "phd"] },
  { title: "Formation Continue", description: "Programmes de formation continue.", url: "/formations/formation-continue", category: "Formations" },

  // Recherche
  { title: "École Doctorale", description: "École doctorale de la FSR (CEDoc).", url: "/recherche/ecole-doctorale", category: "Recherche", keywords: ["doctorat", "these", "cedoc"] },
  { title: "CEDoc", description: "Centre d'Études Doctorales.", url: "/cedoc", category: "Recherche", keywords: ["centre", "doctorales"] },
  { title: "Valorisation de la Recherche", description: "Valorisation et transfert de la recherche.", url: "/recherche/valorisation-recherche", category: "Recherche" },
  { title: "Structures de Recherche", description: "Laboratoires et structures de recherche.", url: "/recherche/structures", category: "Recherche", keywords: ["laboratoires", "labos"] },
  { title: "Domaines de Recherche", description: "Domaines et axes de recherche.", url: "/recherche/domaines", category: "Recherche" },
  { title: "Plateformes Techniques", description: "Plateformes techniques et équipements scientifiques.", url: "/recherche/plateformes-techniques", category: "Recherche" },

  // Départements
  { title: "Département de Biologie", description: "Département de Biologie de la FSR.", url: "/departements/biologie", category: "Départements" },
  { title: "Département de Chimie", description: "Département de Chimie de la FSR.", url: "/departements/chimie", category: "Départements" },
  { title: "Département de Géologie", description: "Département de Géologie de la FSR.", url: "/departements/geologie", category: "Départements" },
  { title: "Département d'Informatique", description: "Département d'Informatique de la FSR.", url: "/departements/informatique", category: "Départements" },
  { title: "Département de Mathématiques", description: "Département de Mathématiques de la FSR.", url: "/departements/mathematiques", category: "Départements" },
  { title: "Département de Physique", description: "Département de Physique de la FSR.", url: "/departements/physique", category: "Départements" },

  // Espaces
  { title: "Espace Enseignants", description: "Espace dédié aux enseignants.", url: "/espace-enseignants", category: "Espaces" },
  { title: "Espace Étudiants", description: "Espace dédié aux étudiants.", url: "/espace-etudiants", category: "Espaces" },

  // Coopération
  { title: "Coopération Nationale", description: "Partenariats et coopération nationale.", url: "/cooperation-nationale", category: "Coopération" },
  { title: "Coopération Internationale", description: "Partenariats et coopération internationale.", url: "/cooperation-internationale", category: "Coopération" },

  // Bibliothèque
  { title: "Bibliothèque", description: "Bibliothèque de la FSR.", url: "/bibliotheque", category: "Bibliothèque" },
  { title: "Services de la Bibliothèque", description: "Services offerts par la bibliothèque.", url: "/bibliotheque/services", category: "Bibliothèque" },
  { title: "Ressources Électroniques", description: "Ressources électroniques et bases de données.", url: "/bibliotheque/ressources-electroniques", category: "Bibliothèque" },
  { title: "Plan d'Accès Bibliothèque", description: "Plan d'accès à la bibliothèque.", url: "/bibliotheque/plan-acces", category: "Bibliothèque" },

  // Scolarité
  { title: "Service Scolarité", description: "Service de la scolarité.", url: "/service-scolarite", category: "Scolarité" },
  { title: "Calendrier et Emploi du Temps", description: "Calendrier universitaire et emplois du temps.", url: "/calendrier-emploi-temps", category: "Scolarité", keywords: ["planning", "calendrier"] },
  { title: "Cours, TDs et TPs", description: "Supports de cours, TDs et TPs.", url: "/cours-tds-tps", category: "Scolarité" },
  { title: "Sections et Groupes", description: "Sections et groupes d'étudiants.", url: "/sections-groupes", category: "Scolarité" },
  { title: "Planning des Évaluations", description: "Planning des évaluations et examens.", url: "/planning-evaluations", category: "Scolarité", keywords: ["examens", "evaluations"] },
  { title: "Listes des Examens", description: "Listes des étudiants aux examens.", url: "/listes-examens", category: "Scolarité" },
  { title: "Résultats", description: "Résultats des examens.", url: "/resultats", category: "Scolarité", keywords: ["notes"] },
  { title: "Présélection", description: "Présélection des candidats.", url: "/preselection", category: "Scolarité" },

  // Procédures Numériques
  { title: "Procédures Numériques", description: "Procédures numériques pour les étudiants.", url: "/procedures-numeriques", category: "Procédures Numériques", keywords: ["numerique", "procedures"] },
  { title: "Récupérer mon mot de passe", description: "Comment récupérer son mot de passe institutionnel.", url: "/procedures-numeriques/recuperer-mot-de-passe", category: "Procédures Numériques", keywords: ["password", "compte"] },
  { title: "Difficulté mot de passe", description: "Aide en cas de difficulté avec le mot de passe.", url: "/procedures-numeriques/difficulte-mot-de-passe", category: "Procédures Numériques" },
  { title: "Demande Carte Étudiant", description: "Demande de la carte étudiant.", url: "/procedures-numeriques/recuperation-carte", category: "Procédures Numériques", keywords: ["carte"] },
  { title: "Suivi Impression Cartes", description: "Suivi de l'impression des cartes étudiant.", url: "/procedures-numeriques/suivi-impression-cartes", category: "Procédures Numériques" },
  { title: "Réclamation Carte", description: "Réclamations liées à la carte étudiant.", url: "/procedures-numeriques/reclamation-carte", category: "Procédures Numériques" },
  { title: "Tutoriel ENT", description: "Tutoriel sur l'Espace Numérique de Travail ETU 4.0.", url: "/procedures-numeriques/tutoriel-ent", category: "Procédures Numériques", keywords: ["ent", "etu"] },
  { title: "Plateforme Moodle", description: "Plateforme d'enseignement à distance Moodle.", url: "/procedures-numeriques/plateforme-moodle", category: "Procédures Numériques", keywords: ["moodle", "elearning"] },
  { title: "Activer compte Rosetta Stone", description: "Activation du compte Rosetta Stone.", url: "/procedures-numeriques/activer-compte-rosetta", category: "Procédures Numériques", keywords: ["rosetta", "langues"] },
  { title: "Problème Rosetta Stone", description: "Problèmes de configuration Rosetta Stone.", url: "/procedures-numeriques/probleme-rosetta", category: "Procédures Numériques" },
  { title: "Capsule Rosetta Stone", description: "Capsule vidéo Rosetta Stone.", url: "/procedures-numeriques/capsule-rosetta", category: "Procédures Numériques" },

  // Vie étudiante
  { title: "Activités Para-Universitaires", description: "Clubs et activités para-universitaires.", url: "/activites-parauniversitaire", category: "Vie Étudiante", keywords: ["clubs", "activites"] },

  // Divers
  { title: "Actualités", description: "Toutes les actualités de la FSR.", url: "/actualites", category: "Actualités" },
  { title: "Événements", description: "Tous les événements de la FSR.", url: "/evenements", category: "Événements" },
  { title: "Contact", description: "Nous contacter.", url: "/contact", category: "Contact" },
  { title: "Plan d'Accès", description: "Plan d'accès à la FSR.", url: "/plan-acces", category: "Contact" },
];

export function searchStaticPages(query: string, limit = 5): StaticPage[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const nq = norm(q);
  return STATIC_PAGES.filter((p) => {
    const haystack = norm(
      [p.title, p.description, p.category, ...(p.keywords ?? [])].join(" ")
    );
    return haystack.includes(nq);
  }).slice(0, limit);
}