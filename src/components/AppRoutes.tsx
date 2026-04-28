
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "./ScrollToTop";
import AuthGuard from "./AuthGuard";
import LoadingSpinner from "./LoadingSpinner";
import PageTransition from "./PageTransition";

// Critical pages loaded eagerly
import Index from "../pages/Index";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

// Lazy loaded pages
const Admin = lazy(() => import("../pages/Admin"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminActualites = lazy(() => import("../pages/AdminActualites"));
const AdminEvenements = lazy(() => import("../pages/AdminEvenements"));
const AdminUtilisateurs = lazy(() => import("../pages/AdminUtilisateurs"));
const AdminFormations = lazy(() => import("../pages/AdminFormations"));
const AdminCooperations = lazy(() => import("../pages/AdminCooperations"));
const AdminPages = lazy(() => import("../pages/AdminPages"));
const AdminFichiers = lazy(() => import("../pages/AdminFichiers"));
const AdminUploadFiles = lazy(() => import("../pages/AdminUploadFiles"));
const AdminHistorique = lazy(() => import("../pages/AdminHistorique"));
const AdminContact = lazy(() => import("../pages/AdminContact"));
const AdminCarousel = lazy(() => import("../pages/AdminCarousel"));
const AdminEmploiTemps = lazy(() => import("../pages/AdminEmploiTemps"));
const AdminPlanningEvaluations = lazy(() => import("../pages/AdminPlanningEvaluations"));
const AdminCeDoc = lazy(() => import("../pages/AdminCeDoc"));
const AdminListesExamens = lazy(() => import("../pages/AdminListesExamens"));
const AdminPreselection = lazy(() => import("../pages/AdminPreselection"));
const AdminSectionsGroupes = lazy(() => import("../pages/AdminSectionsGroupes"));
const AdminScolarite = lazy(() => import("../pages/AdminScolarite"));
const AdminResultats = lazy(() => import("../pages/AdminResultats"));
const AdminClubs = lazy(() => import("../pages/AdminClubs"));
const Actualites = lazy(() => import("../pages/Actualites"));
const ActualiteDetail = lazy(() => import("../pages/ActualiteDetail"));
const Evenements = lazy(() => import("../pages/Evenements"));
const EvenementDetail = lazy(() => import("../pages/EvenementDetail"));
const MotDoyen = lazy(() => import("../pages/MotDoyen"));
const ProjetDeveloppement = lazy(() => import("../pages/ProjetDeveloppement"));
const Historique = lazy(() => import("../pages/Historique"));
const Organisation = lazy(() => import("../pages/Organisation"));
const FSRChiffres = lazy(() => import("../pages/FSRChiffres"));
const Representants = lazy(() => import("../pages/Representants"));
const LMDGuide = lazy(() => import("../pages/LMDGuide"));
const Formations = lazy(() => import("../pages/Formations"));
const FormationLicence = lazy(() => import("../pages/FormationLicence"));
const FormationMaster = lazy(() => import("../pages/FormationMaster"));
const FormationDoctorat = lazy(() => import("../pages/FormationDoctorat"));
const FormationContinue = lazy(() => import("../pages/FormationContinue"));
const FormationDetail = lazy(() => import("../pages/FormationDetail"));
const EcoleDoctorale = lazy(() => import("../pages/EcoleDoctorale"));
const ValorisationRecherche = lazy(() => import("../pages/ValorisationRecherche"));
const StructuresRecherche = lazy(() => import("../pages/StructuresRecherche"));
const DomainesRecherche = lazy(() => import("../pages/DomainesRecherche"));
const PlateformesTechniques = lazy(() => import("../pages/PlateformesTechniques"));
const EspaceEnseignants = lazy(() => import("../pages/EspaceEnseignants"));
const EspaceEtudiants = lazy(() => import("../pages/EspaceEtudiants"));
const CooperationNationale = lazy(() => import("../pages/CooperationNationale"));
const CooperationInternationale = lazy(() => import("../pages/CooperationInternationale"));
const CooperationDetail = lazy(() => import("../pages/CooperationDetail"));
const Contact = lazy(() => import("../pages/Contact"));
const PlanAcces = lazy(() => import("../pages/PlanAcces"));
const CeDoc = lazy(() => import("../pages/CeDoc"));
const Bibliotheque = lazy(() => import("../pages/Bibliotheque"));
const ServicesBibliotheque = lazy(() => import("../pages/ServicesBibliotheque"));
const RessourcesElectroniques = lazy(() => import("../pages/RessourcesElectroniques"));
const ServiceScolarite = lazy(() => import("../pages/ServiceScolarite"));
const ProceduresNumeriques = lazy(() => import("../pages/ProceduresNumeriques"));
const PNRecupererMotDePasse = lazy(() => import("../pages/procedures-numeriques/RecupererMotDePasse"));
const PNDifficulteMotDePasse = lazy(() => import("../pages/procedures-numeriques/DifficulteMotDePasse"));
const PNRecuperationCarte = lazy(() => import("../pages/procedures-numeriques/RecuperationCarte"));
const PNSuiviImpressionCartes = lazy(() => import("../pages/procedures-numeriques/SuiviImpressionCartes"));
const PNReclamationCarte = lazy(() => import("../pages/procedures-numeriques/ReclamationCarte"));
const PNTutorielENT = lazy(() => import("../pages/procedures-numeriques/TutorielENT"));
const PNPlateformeMoodle = lazy(() => import("../pages/procedures-numeriques/PlateformeMoodle"));
const PNActiverCompteRosetta = lazy(() => import("../pages/procedures-numeriques/ActiverCompteRosetta"));
const PNProblemeRosetta = lazy(() => import("../pages/procedures-numeriques/ProblemeRosetta"));
const PNCapsuleRosetta = lazy(() => import("../pages/procedures-numeriques/CapsuleRosetta"));
const CalendrierEmploiTemps = lazy(() => import("../pages/CalendrierEmploiTemps"));
const CoursTdsTps = lazy(() => import("../pages/CoursTdsTps"));
const SectionsGroupes = lazy(() => import("../pages/SectionsGroupes"));
const PlanningEvaluations = lazy(() => import("../pages/PlanningEvaluations"));
const ListesExamens = lazy(() => import("../pages/ListesExamens"));
const Resultats = lazy(() => import("../pages/Resultats"));
const Preselection = lazy(() => import("../pages/Preselection"));
const ActivitesParaUniversitaires = lazy(() => import("../pages/ActivitesParaUniversitaires"));
const Profil = lazy(() => import("../pages/Profil"));
const DynamicPage = lazy(() => import("../pages/[slug]"));
const SecurityTest = lazy(() => import("../pages/SecurityTest"));

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil" element={
          <AuthGuard>
            <Suspense fallback={<LoadingSpinner />}>
              <PageTransition>
                <Profil />
              </PageTransition>
            </Suspense>
          </AuthGuard>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AuthGuard>
            <Suspense fallback={<LoadingSpinner />}>
              <Admin />
            </Suspense>
          </AuthGuard>
        }>
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          } />
          <Route path="actualites" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminActualites />
            </Suspense>
          } />
          <Route path="evenements" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminEvenements />
            </Suspense>
          } />
          <Route path="utilisateurs" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminUtilisateurs />
            </Suspense>
          } />
          <Route path="formations" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminFormations />
            </Suspense>
          } />
          <Route path="cooperations" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminCooperations />
            </Suspense>
          } />
          <Route path="pages" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminPages />
            </Suspense>
          } />
          <Route path="fichiers" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminFichiers />
            </Suspense>
          } />
          <Route path="upload-files" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminUploadFiles />
            </Suspense>
          } />
          <Route path="historique" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminHistorique />
            </Suspense>
          } />
          <Route path="contact" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminContact />
            </Suspense>
          } />
          <Route path="carousel" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminCarousel />
            </Suspense>
          } />
          <Route path="emploi-temps" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminEmploiTemps />
            </Suspense>
          } />
          <Route path="planning-evaluations" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminPlanningEvaluations />
            </Suspense>
          } />
          <Route path="cedoc" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminCeDoc />
            </Suspense>
          } />
          <Route path="listes-examens" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminListesExamens />
            </Suspense>
          } />
          <Route path="preselection" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminPreselection />
            </Suspense>
          } />
          <Route path="sections-groupes" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminSectionsGroupes />
            </Suspense>
          } />
          <Route path="scolarite" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminScolarite />
            </Suspense>
          } />
          <Route path="resultats" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminResultats />
            </Suspense>
          } />
        </Route>

        {/* Public Pages */}
        <Route path="/actualites" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Actualites />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/actualite/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <ActualiteDetail />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/evenements" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Evenements />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/evenement/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <EvenementDetail />
            </PageTransition>
          </Suspense>
        } />
        
        {/* Presentation Pages */}
        <Route path="/presentation/mot-doyen" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <MotDoyen />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/presentation/projet-developpement" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <ProjetDeveloppement />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/presentation/historique" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Historique />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/presentation/organisation" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Organisation />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/presentation/fsr-chiffres" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <FSRChiffres />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/presentation/representants" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Representants />
            </PageTransition>
          </Suspense>
        } />
        
        {/* Formation Pages */}
        <Route path="/formations/lmd-guide" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <LMDGuide />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/formations" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Formations />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/formations/formation-licence" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <FormationLicence />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/formations/formation-master" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <FormationMaster />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/formations/formation-doctorat" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <FormationDoctorat />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/formations/formation-continue" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <FormationContinue />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/formation/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <FormationDetail />
            </PageTransition>
          </Suspense>
        } />
        
        {/* Research Pages */}
        <Route path="/recherche/ecole-doctorale" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <EcoleDoctorale />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/recherche/valorisation-recherche" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <ValorisationRecherche />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/recherche/structures" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <StructuresRecherche />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/recherche/domaines" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <DomainesRecherche />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/recherche/plateformes-techniques" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <PlateformesTechniques />
            </PageTransition>
          </Suspense>
        } />
        
        {/* Space Pages */}
        <Route path="/espace-enseignants" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <EspaceEnseignants />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/espace-etudiants" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <EspaceEtudiants />
            </PageTransition>
          </Suspense>
        } />
        
        {/* Cooperation Pages */}
        <Route path="/cooperation-nationale" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <CooperationNationale />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/cooperation-internationale" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <CooperationInternationale />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/cooperation/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <CooperationDetail />
            </PageTransition>
          </Suspense>
        } />
        
        {/* Contact & Practical Info */}
        <Route path="/contact" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Contact />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/plan-acces" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <PlanAcces />
            </PageTransition>
          </Suspense>
        } />
        
        {/* Library & Services */}
        <Route path="/cedoc" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <CeDoc />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/bibliotheque" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Bibliotheque />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/bibliotheque/plan-acces" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <PlanAcces />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/bibliotheque/services" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <ServicesBibliotheque />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/bibliotheque/ressources-electroniques" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <RessourcesElectroniques />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/services-bibliotheque" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <ServicesBibliotheque />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/ressources-electroniques" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <RessourcesElectroniques />
            </PageTransition>
          </Suspense>
        } />
        
        {/* Student Services */}
        <Route path="/service-scolarite" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <ServiceScolarite />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <ProceduresNumeriques />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/recuperer-mot-de-passe" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNRecupererMotDePasse /></PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/difficulte-mot-de-passe" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNDifficulteMotDePasse /></PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/recuperation-carte" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNRecuperationCarte /></PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/suivi-impression-cartes" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNSuiviImpressionCartes /></PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/reclamation-carte" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNReclamationCarte /></PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/tutoriel-ent" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNTutorielENT /></PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/plateforme-moodle" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNPlateformeMoodle /></PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/activer-compte-rosetta" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNActiverCompteRosetta /></PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/probleme-rosetta" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNProblemeRosetta /></PageTransition>
          </Suspense>
        } />
        <Route path="/procedures-numeriques/capsule-rosetta" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PNCapsuleRosetta /></PageTransition>
          </Suspense>
        } />
        <Route path="/calendrier-emploi-temps" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <CalendrierEmploiTemps />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/cours-tds-tps" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <CoursTdsTps />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/sections-groupes" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <SectionsGroupes />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/planning-evaluations" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <PlanningEvaluations />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/listes-examens" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <ListesExamens />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/resultats" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Resultats />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/preselection" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Preselection />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/activites-parauniversitaire" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <ActivitesParaUniversitaires />
            </PageTransition>
          </Suspense>
        } />
        
        {/* Dynamic Pages */}
        <Route path="/:slug" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <DynamicPage />
            </PageTransition>
          </Suspense>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        
        {/* Security Test */}
        <Route path="/security-test" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <SecurityTest />
            </PageTransition>
          </Suspense>
        } />
      </Routes>
    </>
  );
};

export default AppRoutes;
