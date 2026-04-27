import ProcedureLayout from "./_ProcedureLayout";
import { Mail, AlertCircle } from "lucide-react";

const objets = [
  {
    objet: "Réinitialisation Mot de Passe",
    description: "pour la réinitialisation du mot de passe.",
  },
  {
    objet: "Blocage du compte",
    description: "pour le déblocage du compte.",
  },
  {
    objet: "Création d'un nouveau compte",
    description: "pour la création d'un nouveau compte.",
  },
  {
    objet: "Réinitialisation du numéro de téléphone",
    description: "pour la réinitialisation du numéro de téléphone.",
  },
  {
    objet: "Réinitialisation MFA microsoft",
    description: "pour la réinitialisation de l'authentification multi facteur.",
  },
];

const DifficulteMotDePasse = () => {
  return (
    <ProcedureLayout
      title="Difficulté liée au mot de passe"
      sourceUrl="https://www.fsr.ac.ma/page/difficult%C3%A9-li%C3%A9e-au-mot-de-passe"
    >
      <p>
        Pour toute difficulté liée à votre e-mail institutionnel Microsoft
        (<strong>@um5.ac.ma</strong>), veuillez contacter le Service Informatique
        à l'adresse suivante :
      </p>
      <p className="not-prose my-4">
        <a
          href="mailto:si_fsr@fsr.ac.ma"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#006be5] text-white hover:bg-[#006be5]/90 no-underline"
        >
          <Mail className="h-4 w-4" />
          si_fsr@fsr.ac.ma
        </a>
      </p>

      <h2>Objets d'e-mail à utiliser</h2>
      <ul>
        {objets.map((o) => (
          <li key={o.objet}>
            Utilisez « <strong>{o.objet}</strong> » comme objet de votre email{" "}
            {o.description}
          </li>
        ))}
      </ul>

      <h2>Authentification Multi Facteur (MFA)</h2>
      <p>
        L'activation récente de l'<strong>authentification multi facteur (MFA)</strong>{" "}
        sur les comptes de messagerie institutionnels UM5 a été mise en place
        afin de renforcer la sécurité des accès aux services numériques de
        l'Université et de se conformer aux exigences de sécurité de Microsoft.
      </p>
      <p>
        Les étudiants rencontrant des difficultés d'accès doivent
        impérativement finaliser la validation de la MFA en procédant comme
        suit :
      </p>
      <ol>
        <li>
          Se connecter à l'adresse :{" "}
          <a
            href="https://outlook.office.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://outlook.office.com
          </a>
        </li>
        <li>S'authentifier avec son adresse institutionnelle UM5.</li>
        <li>
          Configurer et valider l'authentification multi facteur à l'aide de
          l'application Microsoft Authenticator (ou via la méthode de
          vérification proposée).
        </li>
        <li>
          Une fois la MFA validée, réessayer l'accès aux plateformes concernées
          (Moodle, etu.um5.ac.ma, Elogha-Sup, etc.).
        </li>
      </ol>
      <p>
        Cette opération est <strong>obligatoire</strong> lors de la première
        connexion après l'activation de la MFA et conditionne l'accès à
        l'ensemble des services numériques de l'Université.
      </p>

      <div className="not-prose mt-6 p-4 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <p className="font-semibold mb-1">NB</p>
          <p>
            Tout e-mail ne contenant pas les informations demandées ne sera pas
            traité. Nous répondons à tous les e-mails ; en cas d'absence de
            réponse dans votre boîte de réception, veuillez consulter le dossier
            des courriers indésirables (spam).
          </p>
        </div>
      </div>
    </ProcedureLayout>
  );
};

export default DifficulteMotDePasse;