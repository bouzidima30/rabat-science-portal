import DepartementLayout from "./_DepartementLayout";

const DepartementMathematiques = () => (
  <DepartementLayout
    titre="Département de Mathématiques"
    description={`Parmi les six départements de la Faculté des Sciences, le département des Mathématiques et Statistiques s'implique dans la formation des étudiants dans les cycles Licence, Master et Doctorat.\n\nIl dénombre des structures de recherche couvrant les branches de l'analyse, de l'algèbre et des mathématiques appliquées. À travers ces structures, une étroite collaboration s'est tissée avec les autres départements (informatique, physique, chimie, géologie...) renforçant ainsi l'esprit d'interdisciplinarité au sein de l'établissement.`}
    sections={[
      {
        titre: "Centres",
        items: [
          { nom: "Analyse, Algèbre, Géométrie, Probabilité, Statistique, Calcul Scientifique, Systèmes d'Information et Applications" },
        ],
      },
      {
        titre: "Laboratoires",
        items: [
          { nom: "Mathématiques, Informatique et Applications, Sécurité de l'Information" },
          { nom: "Analyse Mathématique et Applications" },
          { nom: "Mathématiques, Statistique et Applications" },
        ],
      },
      {
        titre: "Équipes",
        items: [
          { nom: "Groupe d'Algèbre et d'Analyse Fonctionnelle" },
          { nom: "Calcul Stochastique, Statistique et Numérique" },
          { nom: "Analyse Non Linéaire, Modélisation et Aide à la Décision" },
          { nom: "Analyse et Géométrie Spectrale" },
          { nom: "Algèbre, Géométrie et Applications" },
          { nom: "Codes, Cryptologie et Sécurité de l'Information" },
          { nom: "Modélisation, Simulation et Optimisation" },
          { nom: "Informatique, Mathématiques Appliquées, Intelligence Artificielle et Reconnaissance de Formes" },
        ],
      },
    ]}
  />
);

export default DepartementMathematiques;