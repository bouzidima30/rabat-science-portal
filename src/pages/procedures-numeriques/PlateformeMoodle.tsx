import ProcedureLayout from "./_ProcedureLayout";
import LazyYouTubeEmbed from "@/components/LazyYouTubeEmbed";

const PlateformeMoodle = () => {
  return (
    <ProcedureLayout
      title="Plate-forme Moodle"
      intro="Capsule vidéo expliquant comment accéder à la plateforme Moodle de la Faculté des Sciences de Rabat."
      sourceUrl="https://www.fsr.ac.ma/content/plate-forme-moodle"
    >
      <p>
        La plateforme Moodle de la FSR (hébergée par l'Université Mohammed V)
        regroupe l'ensemble de vos cours, ressources pédagogiques, devoirs et
        évaluations en ligne.
      </p>
      <div className="my-6 not-prose">
        <LazyYouTubeEmbed
          url="https://www.youtube.com/watch?v=0WAhnvkSeFw"
          title="Comment accéder à la plateforme Moodle"
        />
      </div>
      <p>
        Accédez à Moodle :{" "}
        <a
          href="https://moodle-fsr.um5.ac.ma/"
          target="_blank"
          rel="noopener noreferrer"
        >
          moodle-fsr.um5.ac.ma
        </a>
      </p>
    </ProcedureLayout>
  );
};

export default PlateformeMoodle;