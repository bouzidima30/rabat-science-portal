
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, FlaskConical, Building2, GraduationCap } from "lucide-react";

type Membre = {
  role?: string;
  nom: string;
  prenom?: string;
  departement?: string;
  grade?: string;
  email: string;
};

const conseilFaculte: Membre[] = [
  { role: "Doyen", nom: "BENAINI", prenom: "Redouane", email: "redouane.benaini@fsr.um5.ac.ma" },
  { role: "Vice-doyen", nom: "TEBYAOUI", prenom: "Mohammed", email: "h.tabyaoui@um5r.ac.ma" },
  { role: "Vice-doyenne", nom: "ELHAJJAJI", prenom: "Souad", email: "s.elhajjaji@um5r.ac.ma" },
  { role: "Professeur de l'Enseignement Supérieur", nom: "ABDELALI", prenom: "Zine El Abidine", email: "zine-el-abidine.abdelali@fsr.um5.ac.ma" },
  { role: "Professeur de l'Enseignement Supérieur", nom: "KASSOU OU ALI", prenom: "Ahmed", email: "ahmed.kassou-ou-ali@fsr.um5.ac.ma" },
  { role: "Professeur de l'Enseignement Supérieur", nom: "KHACHANI", prenom: "Nacer", email: "nacer.khachani@fsr.um5.ac.ma" },
  { role: "Professeur de l'Enseignement Supérieur", nom: "MINAOUI", prenom: "Khalid", email: "khalid.minaoui@fsr.um5.ac.ma" },
  { role: "Maître de Conférences habilité", nom: "EL HAMMARI", prenom: "Larbi", email: "larbi.elhammari@fsr.um5.ac.ma" },
  { role: "Maître de Conférences habilité", nom: "DAHHOU", prenom: "Mohammed", email: "mohammed.dahhou@fsr.um5.ac.ma" },
  { role: "Maître de Conférences habilité", nom: "DRISSI EL MALIANI", prenom: "Ahmed", email: "ahmed.drissi-elmaliani@fsr.um5.ac.ma" },
  { role: "Maître de Conférences habilité", nom: "ZAID", prenom: "Younes", email: "younes.zaid@fsr.um5.ac.ma" },
  { role: "Maître de Conférences", nom: "AIT-AHSAINE", prenom: "Hassan", email: "hassan.ait-ahsaine@fsr.um5.ac.ma" },
  { role: "Maître de Conférences", nom: "BOUHADDOU", prenom: "Nezha", email: "nezha.bouhaddou@fsr.um5.ac.ma" },
  { role: "Maître de Conférences", nom: "CHRAFIH", prenom: "Younes", email: "younes.chrafih@fsr.um5.ac.ma" },
  { role: "Maître de Conférences", nom: "ELAFI", prenom: "Issam", email: "issam.elafi@fsr.um5.ac.ma" },
  { role: "Représentant du corps administratif", nom: "ZINE", prenom: "Ahmed", email: "ahmed.zine@fsr.um5.ac.ma" },
  { role: "Représentant du corps administratif", nom: "NFISSI", prenom: "Ayoub", email: "ayoub.nfissi@fsr.um5.ac.ma" },
  { role: "Représentant des étudiants (Doctorat, Master, Licence)", nom: "AMAHOUCH", prenom: "Abdelhamid", email: "abdelhamid_amahouch@um5.ac.ma" },
  { role: "Représentant des étudiants (Doctorat, Master, Licence)", nom: "MOUSSAOUI", prenom: "Salaheddine", email: "salaheddine_moussaoui@um5.ac.ma" },
  { role: "Représentant des étudiants (Doctorat, Master, Licence)", nom: "NENIA", prenom: "Elmehdi", email: "elmehdi_nenia@um5.ac.ma" },
];

const commissionScientifique: Membre[] = [
  { nom: "ZITI", prenom: "Soumia", departement: "Informatique", email: "soumia.ziti@fsr.um5.ac.ma" },
  { nom: "BAZAIRI", prenom: "Hocein", departement: "Biologie", email: "hocein.bazairi@fsr.um5.ac.ma" },
  { nom: "BENNIS", prenom: "Driss", departement: "Mathématiques", email: "driss.bennis@fsr.um5.ac.ma" },
  { nom: "LAGHZIZIL", prenom: "Abdelaziz", departement: "Chimie", email: "abdelaziz.laghzizil@fsr.um5.ac.ma" },
  { nom: "DRISSI", prenom: "Lalla Btissam", departement: "Physique", email: "lalla-btissam.drissi@fsr.um5.ac.ma" },
  { nom: "NIAZI", prenom: "Saida", departement: "Géologie", email: "saida.niazi@fsr.um5.ac.ma" },
];

const conseilUniversite: Membre[] = [
  { nom: "ZAID", prenom: "Younes", grade: "PH", email: "younes.zaid@fsr.um5.ac.ma" },
  { nom: "ELAFI", prenom: "Issam", grade: "PESA", email: "issam.elafi@fsr.um5.ac.ma" },
];

const chefsDepartements: Membre[] = [
  { departement: "Physique", nom: "ETTOUHAMI", prenom: "Aziz", email: "aziz.ettouhami@fsr.um5.ac.ma" },
  { departement: "Biologie", nom: "EL ABOUDI", prenom: "Ahmed", email: "ahmed.elaboudi@fsr.um5.ac.ma" },
  { departement: "Chimie", nom: "BELLAOUCHOU", prenom: "Abdelkbir", email: "abdelkbir.bellaouchou@fsr.um5.ac.ma" },
  { departement: "Mathématiques", nom: "ZOGLAT", prenom: "Abdelhak", email: "abdelhak.zoglat@fsr.um5.ac.ma" },
  { departement: "Informatique", nom: "OUARDI", prenom: "Faissal", email: "faissal.ouardi@fsr.um5.ac.ma" },
  { departement: "Géologie", nom: "BOUDAD", prenom: "Larbi", email: "larbi.boudad@fsr.um5.ac.ma" },
];

const EmailLink = ({ email }: { email: string }) => (
  <a
    href={`mailto:${email}`}
    className="inline-flex items-center gap-1.5 text-primary hover:underline break-all"
  >
    <Mail className="h-3.5 w-3.5 shrink-0" />
    <span>{email}</span>
  </a>
);

const Representants = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Membres du Conseil et Représentants de la Faculté
          </h1>
          <p className="text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Conformément à l'article 9 du Dahir N° 1-00-199 (19 mai 2002) portant promulgation de la loi n°01-00
            relative à l'organisation de l'enseignement supérieur, les universités sont administrées par un
            conseil. Sur la base de la parité entre les membres désignés et les membres élus, un conseil de
            gestion chargé des questions administratives et financières est constitué. Le conseil de
            l'université crée en son sein des commissions permanentes et, le cas échéant, des commissions ad
            hoc (article 14 du même dahir).
          </p>
        </div>

        <Tabs defaultValue="conseil" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="conseil" className="gap-2 py-2.5">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Conseil de la Faculté</span>
              <span className="sm:hidden">Conseil</span>
            </TabsTrigger>
            <TabsTrigger value="commission" className="gap-2 py-2.5">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Commission Scientifique</span>
              <span className="sm:hidden">Commission</span>
            </TabsTrigger>
            <TabsTrigger value="universite" className="gap-2 py-2.5">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Conseil d'Université</span>
              <span className="sm:hidden">Université</span>
            </TabsTrigger>
            <TabsTrigger value="departements" className="gap-2 py-2.5">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Chefs de Départements</span>
              <span className="sm:hidden">Chefs</span>
            </TabsTrigger>
          </TabsList>

          {/* Conseil de la Faculté */}
          <TabsContent value="conseil" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-primary" />
                  Membres du Conseil de la Faculté des Sciences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[220px]">Qualité</TableHead>
                        <TableHead>Nom & Prénom</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conseilFaculte.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-foreground">{m.role}</TableCell>
                          <TableCell className="font-semibold">{m.nom} {m.prenom}</TableCell>
                          <TableCell><EmailLink email={m.email} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commission Scientifique */}
          <TabsContent value="commission" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FlaskConical className="h-6 w-6 text-primary" />
                  Commission Scientifique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prénom</TableHead>
                        <TableHead>Département</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissionScientifique.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-semibold">{m.nom}</TableCell>
                          <TableCell>{m.prenom}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{m.departement}</Badge>
                          </TableCell>
                          <TableCell><EmailLink email={m.email} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conseil d'Université */}
          <TabsContent value="universite" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Conseil d'Université
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom & Prénom</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conseilUniversite.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-semibold">{m.nom} {m.prenom}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{m.grade}</Badge>
                          </TableCell>
                          <TableCell><EmailLink email={m.email} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chefs de Départements */}
          <TabsContent value="departements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Building2 className="h-6 w-6 text-primary" />
                  Chefs de Départements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chefsDepartements.map((m, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <Badge variant="secondary" className="w-fit mb-2">{m.departement}</Badge>
                        <CardTitle className="text-lg">{m.nom} {m.prenom}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <EmailLink email={m.email} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Representants;
