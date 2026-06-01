import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, BookOpen, Database, ExternalLink } from "lucide-react";

type Resource = {
  nom: string;
  presentation: string;
  site?: string;
};

const resources: Resource[] = [
  {
    nom: "ScienceDirect",
    presentation:
      "Couvre tous les domaines de la science : Sciences Physiques et Technologie, Sciences de la Vie, Sciences de la Santé, Sciences Humaines et Sociales.",
    site: "http://www.sciencedirect.com/",
  },
  {
    nom: "Web of Science",
    presentation:
      "La plate-forme Web of Science permet d'accéder à une quantité inégalée d'ouvrages de recherche grâce à des métadonnées et des liens de citations méticuleusement saisis. Elle connecte la collection Web of Science Core à des index de citations régionaux, des données de brevets, des index de sujets spécialisés, pour un total de plus de 33 000 revues.",
    site: "http://www.webofknowledge.com/",
  },
  {
    nom: "Cairn",
    presentation:
      "Base de données en Sciences Humaines et Sociales donnant accès à plus de 412 revues francophones en texte intégral.",
  },
  {
    nom: "Scopus",
    presentation:
      "La plus grande base de données de références bibliographiques et de citations avec 15 000 titres de revues issues de plus de 4 000 éditeurs internationaux, dans les domaines de la science, de la technologie, de la médecine, des sciences sociales, des arts et des sciences humaines.",
    site: "https://www.scopus.com/",
  },
  {
    nom: "MathSciNet",
    presentation: "Base de données des références bibliographiques en Mathématiques.",
    site: "http://www.ams.org/mathscinet/",
  },
  {
    nom: "SpringerLink",
    presentation:
      "Regroupe des milliers d'ouvrages électroniques en texte intégral dans les domaines de la science, de la technologie, de la médecine, des sciences sociales, des arts et des sciences humaines.",
    site: "http://link.springer.com/",
  },
  {
    nom: "Aluka",
    presentation:
      "Couvre les domaines de : Botanique, Ethnobotanique, Science Politique, développement international. Elle inclut trois collections : Les plantes d'Afrique, sites et paysages du patrimoine culturel Africain et lutte pour la liberté en Afrique australe.",
    site: "https://www.aluka.org/",
  },
  {
    nom: "JSTOR",
    presentation:
      "Donne accès aux archives électroniques de près de 700 périodiques : les mathématiques, la biologie, sciences humaines et sociales.",
    site: "https://www.jstor.org/",
  },
  {
    nom: "Catalogue national des thèses",
    presentation:
      "Comporte un nombre considérable de thèses soutenues dans l'ensemble des universités marocaines.",
    site: "http://toubkal.imist.ma/",
  },
];

const RessourcesElectroniques = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10 border-l-4 border-primary pl-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Ressources électroniques</h1>
          <p className="text-muted-foreground mt-2">
            Accès aux catalogues et bases de données de la bibliothèque de la FSR
          </p>
        </div>

        <div className="space-y-8">
          {/* Catalogue des thèses */}
          <Card className="shadow-md">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Catalogue des thèses et des mémoires
              </h2>
              <p className="text-foreground/80">
                La recherche d'une thèse ou d'un mémoire se fait uniquement en{" "}
                <strong>intranet</strong> en interrogeant :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                <li>
                  Le catalogue de :{" "}
                  <a
                    href="http://sdic.fsr.ac.ma/opac_css/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    http://sdic.fsr.ac.ma/opac_css/
                  </a>
                </li>
              </ul>
              <p className="text-foreground/80">
                Le catalogue national des thèses est consultable via internet sur :{" "}
                <a
                  href="http://toubkal.imist.ma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  http://toubkal.imist.ma/
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Catalogue de la bibliothèque */}
          <Card className="shadow-md">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Catalogue de la bibliothèque
              </h2>
              <p className="text-foreground/80">
                Accessible uniquement au niveau de la faculté, le catalogue de la bibliothèque
                centrale contient les références bibliographiques de l'ensemble du fond documentaire
                (ouvrages, thèses et mémoires). Il permet d'effectuer une recherche simple ou
                avancée, de repérer les documents et de vérifier leur disponibilité dans la
                bibliothèque. Ce catalogue regroupe également les références de la bibliothèque du
                département de mathématiques.
              </p>
            </CardContent>
          </Card>

          {/* Ressources électroniques */}
          <Card className="shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Ressources électroniques
              </h2>
              <p className="text-foreground/80">
                La bibliothèque de la Faculté des Sciences met à la disposition de ses usagers les
                différentes bases de données à accès restreint auxquelles la Faculté et le
                Consortium CNRST-Universités sont abonnés.
              </p>

              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-semibold text-foreground w-1/5">Ressources</th>
                      <th className="text-left p-3 font-semibold text-foreground">Présentation</th>
                      <th className="text-left p-3 font-semibold text-foreground w-1/5">Site</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) => (
                      <tr key={r.nom} className="border-t border-border align-top">
                        <td className="p-3 font-medium text-foreground">{r.nom}</td>
                        <td className="p-3 text-foreground/80">{r.presentation}</td>
                        <td className="p-3">
                          {r.site ? (
                            <a
                              href={r.site}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1 break-all"
                            >
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              <span>{r.site}</span>
                            </a>
                          ) : (
                            <span className="text-muted-foreground italic">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RessourcesElectroniques;
