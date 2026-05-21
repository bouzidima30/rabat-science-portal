import DepartementLayout from "./_DepartementLayout";

const DepartementBiologie = () => (
  <DepartementLayout
    titre="Département de Biologie"
    description={`Le Département de Biologie de la Faculté des Sciences de Rabat est fortement impliqué dans la formation d'étudiants et de chercheurs à travers la préparation aux diplômes de Licence, Master et de Doctorat. Depuis soixante ans, le département de Biologie a formé une grande partie des cadres et des enseignants marocains dans les disciplines de Biochimie, Physiologie animale, Physiologie végétale, Botanique, Biologie Animale, Biologie moléculaire, Génétique, Ecologie.\n\nActuellement, les thématiques de recherche couvrent plusieurs disciplines : la biologie des microorganismes, la génétique des populations, la génomique et la biodiversité, les pathologies humaines, la biotechnologie végétale, la neurophysiologie, les plantes médicinales, la cancérologie, l'océanologie, l'immunologie, la botanique et l'environnement.`}
    sections={[
      {
        titre: "Centres",
        items: [
          { nom: "Biodiversité, Biotechnologie Végétale et Microbienne, Biodiversité et Environnement" },
        ],
      },
      {
        titre: "Laboratoires",
        items: [
          { nom: "Laboratoire de Biodiversité, Écologie et Génome" },
          { nom: "Laboratoire de Biologie des Pathologies Humaines" },
        ],
      },
      {
        titre: "Équipes",
        items: [
          { nom: "Équipe de Microbiologie et Biologie Moléculaire" },
          { nom: "Équipe de Physiologie et Biotechnologie Végétale" },
          { nom: "Équipe de Botanique et Valorisation des Ressources Végétales et Fongiques" },
          { nom: "Équipe de Physiologie et Physiopathologie" },
          { nom: "Équipe Hémato-Oncologie Pédiatrique" },
        ],
      },
    ]}
  />
);

export default DepartementBiologie;