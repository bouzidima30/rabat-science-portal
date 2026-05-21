import DepartementLayout from "./_DepartementLayout";

const DepartementPhysique = () => (
  <DepartementLayout
    titre="Département de Physique"
    description={`Le Département de Physique de la Faculté des Sciences de Rabat a pour rôle de coordonner toutes les formations fondamentales, professionnelles et spécialisées qui relèvent des sciences de la matière physique.\n\nÀ travers ses structures de recherche — un centre, trois laboratoires et deux équipes —, le département est fortement impliqué dans des projets de recherche de grande envergure, couvrant diverses branches des sciences de la physique, aussi bien disciplinaires qu'interdisciplinaires : les énergies renouvelables, les sciences des matériaux, la physique de la matière condensée, l'électronique et les télécommunications, la physique des hautes énergies, la physique des particules élémentaires, la spectroscopie, la mécanique et l'énergétique, la biomécanique, la cryptographie quantique, etc.`}
    sections={[
      {
        titre: "Centres",
        items: [
          { nom: "Matériaux et Nanomatériaux, Composites, Nanocomposites, Couches Minces, Mécanique, Énergétique et Énergies Renouvelables, Matériaux à Haute Température, Modélisation et Simulation" },
        ],
      },
      {
        titre: "Laboratoires",
        items: [
          { nom: "Matière Condensée et Sciences Interdisciplinaires" },
          { nom: "Conception et Systèmes (Électronique, Signaux et Informatique)" },
        ],
      },
      {
        titre: "Équipes",
        items: [
          { nom: "Matériaux, Nanomatériaux pour la Conversion Photovoltaïque et le Stockage Électrochimique" },
          { nom: "Modélisation et Simulation en Mécanique et Énergétique" },
          { nom: "Mécanique et des Matériaux" },
          { nom: "Énergétique et Physique des Réacteurs Nucléaires, Sécurité Nucléaire et Environnement" },
          { nom: "Semi-conducteurs et Technologie des Capteurs pour l'Environnement" },
          { nom: "Thermodynamique-Énergétique" },
          { nom: "Physique des Hautes Énergies — Modélisation et Simulation" },
          { nom: "Énergie Solaire et Environnement" },
          { nom: "Science de la Matière et du Rayonnement" },
        ],
      },
    ]}
  />
);

export default DepartementPhysique;