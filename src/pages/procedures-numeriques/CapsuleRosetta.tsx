import ProcedureLayout from "./_ProcedureLayout";
import LazyYouTubeEmbed from "@/components/LazyYouTubeEmbed";

const CapsuleRosetta = () => {
  return (
    <ProcedureLayout
      title="Capsule Rosetta Stone"
      intro="Vidéo de présentation et de prise en main de la plateforme d'apprentissage des langues Rosetta Stone."
      sourceUrl="https://www.fsr.ac.ma/content/plate-forme-rosetta-stone"
    >
      <p>
        Cette capsule vidéo de la Faculté des Sciences de Rabat vous accompagne
        dans la découverte de la plateforme Rosetta Stone et de ses
        fonctionnalités d'apprentissage des langues.
      </p>
      <div className="my-6 not-prose">
        <LazyYouTubeEmbed
          url="https://www.youtube.com/watch?v=GaLEhJGa7z4"
          title="Capsule Rosetta Stone"
        />
      </div>
    </ProcedureLayout>
  );
};

export default CapsuleRosetta;