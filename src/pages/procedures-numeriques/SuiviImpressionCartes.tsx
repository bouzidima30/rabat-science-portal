import ProcedureLayout from "./_ProcedureLayout";
import { FileText } from "lucide-react";

const annees = [
  {
    annee: "2022-2023",
    url: "http://www.fsr.ac.ma/DOC/Etat_Avancement_Carte_Etudiant/Demandes_Traitees_22-23.pdf",
  },
  {
    annee: "2023-2024",
    url: "http://www.fsr.ac.ma/DOC/Etat_Avancement_Carte_Etudiant/Demandes_Traitees_23_24.pdf",
  },
  {
    annee: "2024-2025",
    url: "http://www.fsr.ac.ma/DOC/Etat_Avancement_Carte_Etudiant/Demandes_Traitees_24_25.pdf",
  },
  {
    annee: "2025-2026",
    url: "http://www.fsr.ac.ma/DOC/Etat_Avancement_Carte_Etudiant/Demandes_Trait%c3%a9e_25_26.pdf",
  },
];

const SuiviImpressionCartes = () => {
  return (
    <ProcedureLayout
      title="Suivi d'impression des cartes"
      intro="Veuillez choisir l'année universitaire pour consulter l'état d'avancement du traitement de votre carte d'étudiant."
      sourceUrl="https://www.fsr.ac.ma/page/suivie-d%E2%80%99impression-des-cartes"
    >
      <div className="not-prose grid sm:grid-cols-2 gap-4">
        {annees.map((a) => (
          <a
            key={a.annee}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#006be5] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <FileText className="h-6 w-6 text-[#006be5] flex-shrink-0" />
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Année universitaire {a.annee}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Document PDF
              </div>
            </div>
          </a>
        ))}
      </div>
    </ProcedureLayout>
  );
};

export default SuiviImpressionCartes;