import ProcedureLayout from "./_ProcedureLayout";
import { UserCheck } from "lucide-react";

const ProblemeRosetta = () => {
  return (
    <ProcedureLayout
      title="Problèmes liés au compte Rosetta Stone"
      sourceUrl="https://www.fsr.ac.ma/page/compte-%C2%AB-rosetta-stone-%C2%BB"
    >
      <p>
        Si votre adresse e-mail institutionnelle fonctionne correctement mais
        que vous rencontrez un problème lié à la <strong>configuration de votre
        compte Rosetta Stone</strong>, veuillez contacter le contact ci-dessous.
      </p>

      <div className="not-prose my-6 p-5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-4">
        <UserCheck className="h-8 w-8 text-[#006be5] flex-shrink-0 mt-1" />
        <div>
          <p className="text-sm text-blue-900 dark:text-blue-100 mb-1">
            Personne à contacter
          </p>
          <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Pr. TRIQUI Zine-El-Abidine
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Département de Biologie — Faculté des Sciences de Rabat
          </p>
        </div>
      </div>
    </ProcedureLayout>
  );
};

export default ProblemeRosetta;