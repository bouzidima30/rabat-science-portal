
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
            <PageTransition>
              <Profil />
            </PageTransition>
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
        </Route>

        {/* Public Pages */}
        <Route path="/actualites" element={
          <PageTransition>
            <Actualites />
          </PageTransition>
        } />
        <Route path="/actualite/:id" element={
          <PageTransition>
            <ActualiteDetail />
          </PageTransition>
        } />
        <Route path="/evenements" element={
          <PageTransition>
            <Evenements />
          </PageTransition>
        } />
        <Route path="/evenement/:id" element={
          <PageTransition>
            <EvenementDetail />
          </PageTransition>
        } />
        
        {/* Presentation Pages */}
        <Route path="/presentation/mot-doyen" element={
          <PageTransition>
            <MotDoyen />
          </PageTransition>
        } />
        <Route path="/presentation/projet-developpement" element={
          <PageTransition>
            <ProjetDeveloppement />
          </PageTransition>
        } />
        <Route path="/presentation/historique" element={
          <PageTransition>
            <Historique />
          </PageTransition>
        } />
        <Route path="/presentation/organisation" element={
          <PageTransition>
            <Organisation />
          </PageTransition>
        } />
        <Route path="/presentation/fsr-chiffres" element={
          <PageTransition>
            <FSRChiffres />
          </PageTransition>
        } />
        <Route path="/presentation/representants" element={
          <PageTransition>
            <Representants />
          </PageTransition>
        } />
        
        {/* Formation Pages */}
        <Route path="/formations/lmd-guide" element={
          <PageTransition>
            <LMDGuide />
          </PageTransition>
        } />
        <Route path="/formations" element={
          <PageTransition>
            <Formations />
          </PageTransition>
        } />
        <Route path="/formations/formation-licence" element={
          <PageTransition>
            <FormationLicence />
          </PageTransition>
        } />
        <Route path="/formations/formation-master" element={
          <PageTransition>
            <FormationMaster />
          </PageTransition>
        } />
        <Route path="/formations/formation-doctorat" element={
          <PageTransition>
            <FormationDoctorat />
          </PageTransition>
        } />
        <Route path="/formations/formation-continue" element={
          <PageTransition>
            <FormationContinue />
          </PageTransition>
        } />
        <Route path="/formation/:id" element={
          <PageTransition>
            <FormationDetail />
          </PageTransition>
        } />
        
        {/* Research Pages */}
        <Route path="/recherche/ecole-doctorale" element={
          <PageTransition>
            <EcoleDoctorale />
          </PageTransition>
        } />
        <Route path="/recherche/valorisation-recherche" element={
          <PageTransition>
            <ValorisationRecherche />
          </PageTransition>
        } />
        <Route path="/recherche/structures" element={
          <PageTransition>
            <StructuresRecherche />
          </PageTransition>
        } />
        <Route path="/recherche/domaines" element={
          <PageTransition>
            <DomainesRecherche />
          </PageTransition>
        } />
        <Route path="/recherche/plateformes-techniques" element={
          <PageTransition>
            <PlateformesTechniques />
          </PageTransition>
        } />
        
        {/* Space Pages */}
        <Route path="/espace-enseignants" element={
          <PageTransition>
            <EspaceEnseignants />
          </PageTransition>
        } />
        <Route path="/espace-etudiants" element={
          <PageTransition>
            <EspaceEtudiants />
          </PageTransition>
        } />
        
        {/* Cooperation Pages */}
        <Route path="/cooperation-nationale" element={
          <PageTransition>
            <CooperationNationale />
          </PageTransition>
        } />
        <Route path="/cooperation-internationale" element={
          <PageTransition>
            <CooperationInternationale />
          </PageTransition>
        } />
        <Route path="/cooperation/:id" element={
          <PageTransition>
            <CooperationDetail />
          </PageTransition>
        } />
        
        {/* Contact & Practical Info */}
        <Route path="/contact" element={
          <PageTransition>
            <Contact />
          </PageTransition>
        } />
        <Route path="/plan-acces" element={
          <PageTransition>
            <PlanAcces />
          </PageTransition>
        } />
        
        {/* Library & Services */}
        <Route path="/cedoc" element={
          <PageTransition>
            <CeDoc />
          </PageTransition>
        } />
        <Route path="/bibliotheque" element={
          <PageTransition>
            <Bibliotheque />
          </PageTransition>
        } />
        <Route path="/services-bibliotheque" element={
          <PageTransition>
            <ServicesBibliotheque />
          </PageTransition>
        } />
        <Route path="/ressources-electroniques" element={
          <PageTransition>
            <RessourcesElectroniques />
          </PageTransition>
        } />
        
        {/* Student Services */}
        <Route path="/service-scolarite" element={
          <PageTransition>
            <ServiceScolarite />
          </PageTransition>
        } />
        <Route path="/procedures-numeriques" element={
          <PageTransition>
            <ProceduresNumeriques />
          </PageTransition>
        } />
        <Route path="/calendrier-emploi-temps" element={
          <PageTransition>
            <CalendrierEmploiTemps />
          </PageTransition>
        } />
        <Route path="/cours-tds-tps" element={
          <PageTransition>
            <CoursTdsTps />
          </PageTransition>
        } />
        <Route path="/sections-groupes" element={
          <PageTransition>
            <SectionsGroupes />
          </PageTransition>
        } />
        <Route path="/planning-evaluations" element={
          <PageTransition>
            <PlanningEvaluations />
          </PageTransition>
        } />
        <Route path="/listes-examens" element={
          <PageTransition>
            <ListesExamens />
          </PageTransition>
        } />
        <Route path="/resultats" element={
          <PageTransition>
            <Resultats />
          </PageTransition>
        } />
        <Route path="/preselection" element={
          <PageTransition>
            <Preselection />
          </PageTransition>
        } />
        <Route path="/activites-parauniversitaire" element={
          <PageTransition>
            <ActivitesParaUniversitaires />
          </PageTransition>
        } />
        
        {/* Dynamic Pages */}
        <Route path="/:slug" element={
          <PageTransition>
            <DynamicPage />
          </PageTransition>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        
        {/* Security Test */}
        <Route path="/security-test" element={
          <PageTransition>
            <SecurityTest />
          </PageTransition>
        } />
      </Routes>
    </>
  );
};

export default AppRoutes;
