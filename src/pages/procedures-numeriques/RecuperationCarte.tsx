import ProcedureLayout from "./_ProcedureLayout";
import { Link } from "react-router-dom";

const RecuperationCarte = () => {
  return (
    <ProcedureLayout
      title="Récupération de la carte d'étudiant"
      sourceUrl="https://www.fsr.ac.ma/page/r%C3%A9cup%C3%A9ration-de-la-carte"
    >
      <h2>Étape 1 : Dépôt de la demande</h2>
      <p>
        Les cartes d'étudiant sont délivrées sur demande en remplissant le
        formulaire téléchargeable depuis le site de la Faculté des Sciences de
        Rabat et en y joignant l'<strong>attestation de dépôt du dossier</strong>.
        Les deux documents doivent être déposés au <strong>service de la
        scolarité</strong>.
      </p>
      <p>
        Lien : <em>Espace Étudiants → Service de Scolarité → Formulaire carte
        d'étudiant</em>
      </p>

      <h2>Étape 2 : Récupération de la carte</h2>
      <p>
        Une fois la demande déposée, les étudiants doivent consulter le fichier
        de traitement des cartes d'étudiant pour suivre l'avancement de leur
        demande :
      </p>
      <p>
        →{" "}
        <Link to="/procedures-numeriques/suivi-impression-cartes">
          Suivi de l'impression des cartes
        </Link>
      </p>
      <p>
        Seuls les étudiants dont le statut de la carte est{" "}
        <strong>« imprimée »</strong> peuvent se rendre au service de la
        scolarité pour la récupérer.
      </p>
    </ProcedureLayout>
  );
};

export default RecuperationCarte;