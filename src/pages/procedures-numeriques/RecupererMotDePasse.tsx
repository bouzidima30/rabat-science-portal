import ProcedureLayout from "./_ProcedureLayout";
import LazyYouTubeEmbed from "@/components/LazyYouTubeEmbed";

const RecupererMotDePasse = () => {
  return (
    <ProcedureLayout
      title="Comment récupérer mon mot de passe"
      intro="Vidéo officielle de la Faculté des Sciences de Rabat expliquant la procédure de récupération de votre compte académique étudiant."
      sourceUrl="https://www.fsr.ac.ma/content/comment-r%C3%A9cuperer-mon-mot-de-passe"
    >
      <h2>Récupérer votre compte académique étudiant</h2>
      <p>
        Suivez les étapes présentées dans la vidéo ci-dessous pour récupérer votre
        compte institutionnel Microsoft (UM5) :
      </p>
      <div className="my-6 not-prose">
        <LazyYouTubeEmbed
          videoId="ji9W64HmYCs"
          title="Récupérer votre compte académique étudiant"
        />
      </div>
      <p>
        En cas de difficulté persistante, consultez la page{" "}
        <a href="/procedures-numeriques/difficulte-mot-de-passe">
          Difficulté liée au mot de passe
        </a>
        .
      </p>
    </ProcedureLayout>
  );
};

export default RecupererMotDePasse;