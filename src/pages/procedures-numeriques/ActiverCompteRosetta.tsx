import ProcedureLayout from "./_ProcedureLayout";
import { FileText } from "lucide-react";

const ActiverCompteRosetta = () => {
  return (
    <ProcedureLayout
      title="Activer votre compte Rosetta Stone"
      intro="Procédure d'activation de votre compte Rosetta Stone pour l'enseignement des langues."
      sourceUrl="https://www.fsr.ac.ma/page/activer-votre-compte"
    >
      <p>
        En tant qu'étudiant concerné par l'enseignement des <strong>LANGUES</strong>{" "}
        sur la plateforme Rosetta Stone, vous devez activer votre compte et
        passer le <strong>test de positionnement</strong> en suivant les étapes
        ci-dessous :
      </p>

      <ol>
        <li>
          Connectez-vous à la plateforme Moodle de votre établissement :{" "}
          <a
            href="https://moodle-fsr.um5.ac.ma"
            target="_blank"
            rel="noopener noreferrer"
          >
            moodle-fsr.um5.ac.ma
          </a>{" "}
          en cliquant sur le bouton <strong>Microsoft</strong> sur la page
          d'accueil.
        </li>
        <li>
          Introduisez le <strong>login</strong> et le <strong>mot de passe</strong>{" "}
          de votre compte Microsoft institutionnel.
        </li>
        <li>
          Cliquez sur le cours <em>Rosetta Stone — Accès étudiants
          (2024/2025)</em>.
        </li>
        <li>Cliquez sur le lien Rosetta Stone proposé dans le cours.</li>
      </ol>

      <p>
        Pour plus d'aide, téléchargez le document complet ci-dessous :
      </p>
      <p className="not-prose my-4">
        <a
          href="http://www.fsr.ac.ma/DOC/Diffusion/si/Coonnexion_a_Rosetta_stone.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#006be5] text-white hover:bg-[#006be5]/90 no-underline"
        >
          <FileText className="h-4 w-4" />
          Document d'aide (PDF)
        </a>
      </p>
    </ProcedureLayout>
  );
};

export default ActiverCompteRosetta;