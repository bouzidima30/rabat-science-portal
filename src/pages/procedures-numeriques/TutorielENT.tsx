import ProcedureLayout from "./_ProcedureLayout";
import LazyYouTubeEmbed from "@/components/LazyYouTubeEmbed";

const TutorielENT = () => {
  return (
    <ProcedureLayout
      title="Tutoriel : Nouvel Espace Numérique de Travail « ETU 4.0 »"
      intro="Tutoriel officiel de l'Université Mohammed V dédié aux étudiants pour la prise en main du nouvel ENT « ETU 4.0 »."
      sourceUrl="https://www.fsr.ac.ma/content/tutoriel-nouvel-espace-num%C3%A9rique-de-travail-%C2%AB-etu-40-%C2%BB-pour-les-%C3%A9tudiants"
    >
      <p>
        Découvrez dans cette vidéo l'ensemble des fonctionnalités du nouvel
        Espace Numérique de Travail mis à votre disposition par l'Université
        Mohammed V de Rabat.
      </p>
      <div className="my-6 not-prose">
        <LazyYouTubeEmbed
          url="https://www.youtube.com/watch?v=RaS_IBZ30cw"
          title="Tutoriel ETU 4.0 pour les étudiants"
        />
      </div>
      <p>
        Accédez directement à votre ENT :{" "}
        <a href="http://etu.um5.ac.ma/" target="_blank" rel="noopener noreferrer">
          etu.um5.ac.ma
        </a>
      </p>
    </ProcedureLayout>
  );
};

export default TutorielENT;