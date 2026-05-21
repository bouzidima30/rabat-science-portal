import DepartementLayout from "./_DepartementLayout";

const DepartementChimie = () => (
  <DepartementLayout
    titre="Département de Chimie"
    description={`La principale mission du département de Chimie consiste à préparer, organiser et coordonner les divers enseignements dispensés aux niveaux Licence, Master et Doctorat (LMD).\n\nLes structures de recherche adossées au département étudient et travaillent sur une panoplie de thématiques relevant de la chimie moléculaire, de l'électrochimie, de la chimie analytique, de la radiochimie, de la chimie des plantes, de la synthèse organique et bioorganique, etc. De nombreux travaux de recherche issus des structures du département se sont démarqués à l'échelle nationale et internationale, notamment ceux réalisés sur l'arganier et d'autres plantes aromatiques et thérapeutiques.`}
    sections={[
      {
        titre: "Centres",
        items: [
          { nom: "Eau, Ressources Naturelles, Changement Climatique, Matériaux, Nanomatériaux, Environnement, Développement Durable" },
          { nom: "Matériaux et Nanomatériaux, Valorisation des Ressources Naturelles, Biomatériaux, Corrosion, Caractérisation et Analyse" },
        ],
      },
      {
        titre: "Laboratoires",
        items: [
          { nom: "Matériaux, Nanotechnologies et Environnement" },
          { nom: "Chimie Appliquée des Matériaux" },
          { nom: "Spectroscopie, Modélisation Moléculaire, Matériaux, Nanomatériaux, Eau et Environnement" },
          { nom: "Géosciences, Eau et Environnement" },
        ],
      },
      {
        titre: "Équipes",
        items: [
          { nom: "Équipe de Chimie des Plantes et de Synthèse Organique et Bioorganique" },
        ],
      },
    ]}
  />
);

export default DepartementChimie;