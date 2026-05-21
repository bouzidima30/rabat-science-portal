import DepartementLayout from "./_DepartementLayout";

const DepartementGeologie = () => (
  <DepartementLayout
    titre="Département de Géologie"
    description={`Le département des Sciences de la Terre s'investit aussi bien dans les formations Licence, Master et Doctorat que dans les divers domaines de recherche comme la sismologie, le climat, la lithologie, l'océanographie, l'environnement et les ressources hydriques.\n\nRiche d'une expérience qui se mesure à la hauteur des attentes des étudiants et des enseignants-chercheurs versés dans le domaine, le département dispose d'une multitude de moyens expérimentaux, techniques et pédagogiques, facilitant ainsi les formations et les travaux de recherche.`}
    sections={[
      {
        titre: "Laboratoires",
        items: [
          { nom: "Géosciences, Eau et Environnement" },
          { nom: "Ingénierie du Tourisme, Patrimoine et Développement Durable des Territoires" },
        ],
      },
      {
        titre: "Équipes",
        items: [
          { nom: "Géophysique et Risques Naturels" },
        ],
      },
    ]}
  />
);

export default DepartementGeologie;