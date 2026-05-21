import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FlaskConical, Users, ExternalLink } from "lucide-react";

export interface DepartementStructure {
  nom: string;
  url?: string;
}

export interface DepartementSection {
  titre: string;
  items: DepartementStructure[];
}

interface DepartementLayoutProps {
  titre: string;
  description: string;
  sections: DepartementSection[];
}

const sectionIcon = (titre: string) => {
  if (titre.toLowerCase().startsWith("centre")) return Building2;
  if (titre.toLowerCase().startsWith("laboratoire")) return FlaskConical;
  return Users;
};

const DepartementLayout = ({ titre, description, sections }: DepartementLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <Badge variant="outline" className="mb-4">Départements</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {titre}
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 sm:py-12 space-y-10">
        <Card>
          <CardHeader>
            <CardTitle>Présentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
              {description}
            </p>
          </CardContent>
        </Card>

        {sections.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Structures de recherche
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {sections.map((section) => {
                const Icon = sectionIcon(section.titre);
                return (
                  <Card key={section.titre}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className="h-5 w-5 text-primary" />
                        {section.titre}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {item.url ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                              >
                                <span>{item.nom}</span>
                                <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                              </a>
                            ) : (
                              <span className="text-foreground">{item.nom}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DepartementLayout;