import ProcedureLayout from "./_ProcedureLayout";
import { Mail, AlertCircle } from "lucide-react";

const ReclamationCarte = () => {
  return (
    <ProcedureLayout
      title="Réclamation liée à la carte d'étudiant"
      sourceUrl="https://www.fsr.ac.ma/page/r%C3%A9clamation-li%C3%A9e-%C3%A0-la-carte-d%E2%80%99etudiant"
    >
      <p>
        Pour toute réclamation liée à la carte d'étudiant, veuillez contacter le
        Service Informatique à l'adresse suivante :
      </p>
      <p className="not-prose my-4">
        <a
          href="mailto:helpdesk@fsr.ac.ma"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#006be5] text-white hover:bg-[#006be5]/90 no-underline"
        >
          <Mail className="h-4 w-4" />
          helpdesk@fsr.ac.ma
        </a>
      </p>
      <p>
        Utilisez « <strong>Carte étudiants</strong> » comme objet de votre
        e-mail et fournissez les détails suivants dans le corps de votre
        message :
      </p>
      <ul>
        <li>Votre <strong>code Apogée</strong></li>
        <li>Un <strong>numéro de téléphone</strong> où l'on peut vous joindre</li>
        <li>Une description détaillée de votre problème</li>
      </ul>

      <div className="not-prose mt-6 p-4 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <p className="font-semibold mb-1">NB</p>
          <p>
            Tout e-mail ne contenant pas les informations demandées ne sera pas
            traité.
          </p>
        </div>
      </div>
    </ProcedureLayout>
  );
};

export default ReclamationCarte;