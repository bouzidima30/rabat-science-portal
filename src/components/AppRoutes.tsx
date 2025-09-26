
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "./ScrollToTop";
import AuthGuard from "./AuthGuard";
import LoadingSpinner from "./LoadingSpinner";


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
            <Suspense fallback={<LoadingSpinner />}>
              <Profil />
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
        </Route>

        {/* Public Pages */}
        <Route path="/actualites" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Actualites />
          </Suspense>
        } />
        <Route path="/actualite/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ActualiteDetail />
          </Suspense>
        } />
        <Route path="/evenements" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Evenements />
          </Suspense>
        } />
        <Route path="/evenement/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <EvenementDetail />
          </Suspense>
        } />
        
        {/* Presentation Pages */}
        <Route path="/presentation/mot-doyen" element={
          <Suspense fallback={<LoadingSpinner />}>
            <MotDoyen />
          </Suspense>
        } />
        <Route path="/presentation/projet-developpement" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProjetDeveloppement />
          </Suspense>
        } />
        <Route path="/presentation/historique" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Historique />
          </Suspense>
        } />
        <Route path="/presentation/organisation" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Organisation />
          </Suspense>
        } />
        <Route path="/presentation/fsr-chiffres" element={
          <Suspense fallback={<LoadingSpinner />}>
            <FSRChiffres />
          </Suspense>
        } />
        <Route path="/presentation/representants" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Representants />
          </Suspense>
        } />
        
        {/* Formation Pages */}
        <Route path="/formations/lmd-guide" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LMDGuide />
          </Suspense>
        } />
        <Route path="/formations" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Formations />
          </Suspense>
        } />
        <Route path="/formations/formation-licence" element={
          <Suspense fallback={<LoadingSpinner />}>
            <FormationLicence />
          </Suspense>
        } />
        <Route path="/formations/formation-master" element={
          <Suspense fallback={<LoadingSpinner />}>
            <FormationMaster />
          </Suspense>
        } />
        <Route path="/formations/formation-doctorat" element={
          <Suspense fallback={<LoadingSpinner />}>
            <FormationDoctorat />
          </Suspense>
        } />
        <Route path="/formations/formation-continue" element={
          <Suspense fallback={<LoadingSpinner />}>
            <FormationContinue />
          </Suspense>
        } />
        <Route path="/formation/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <FormationDetail />
          </Suspense>
        } />
        
        {/* Research Pages */}
        <Route path="/recherche/ecole-doctorale" element={
          <Suspense fallback={<LoadingSpinner />}>
            <EcoleDoctorale />
          </Suspense>
        } />
        <Route path="/recherche/valorisation-recherche" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ValorisationRecherche />
          </Suspense>
        } />
        <Route path="/recherche/structures" element={
          <Suspense fallback={<LoadingSpinner />}>
            <StructuresRecherche />
          </Suspense>
        } />
        <Route path="/recherche/domaines" element={
          <Suspense fallback={<LoadingSpinner />}>
            <DomainesRecherche />
          </Suspense>
        } />
        <Route path="/recherche/plateformes-techniques" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PlateformesTechniques />
          </Suspense>
        } />
        
        {/* Space Pages */}
        <Route path="/espace-enseignants" element={
          <Suspense fallback={<LoadingSpinner />}>
            <EspaceEnseignants />
          </Suspense>
        } />
        <Route path="/espace-etudiants" element={
          <Suspense fallback={<LoadingSpinner />}>
            <EspaceEtudiants />
          </Suspense>
        } />
        
        {/* Cooperation Pages */}
        <Route path="/cooperation-nationale" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CooperationNationale />
          </Suspense>
        } />
        <Route path="/cooperation-internationale" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CooperationInternationale />
          </Suspense>
        } />
        <Route path="/cooperation/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CooperationDetail />
          </Suspense>
        } />
        
        {/* Contact & Practical Info */}
        <Route path="/contact" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Contact />
          </Suspense>
        } />
        <Route path="/plan-acces" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PlanAcces />
          </Suspense>
        } />
        
        {/* Library & Services */}
        <Route path="/cedoc" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CeDoc />
          </Suspense>
        } />
        <Route path="/bibliotheque" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Bibliotheque />
          </Suspense>
        } />
        <Route path="/services-bibliotheque" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ServicesBibliotheque />
          </Suspense>
        } />
        <Route path="/ressources-electroniques" element={
          <Suspense fallback={<LoadingSpinner />}>
            <RessourcesElectroniques />
          </Suspense>
        } />
        
        {/* Student Services */}
        <Route path="/service-scolarite" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ServiceScolarite />
          </Suspense>
        } />
        <Route path="/procedures-numeriques" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProceduresNumeriques />
          </Suspense>
        } />
        <Route path="/calendrier-emploi-temps" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CalendrierEmploiTemps />
          </Suspense>
        } />
        <Route path="/cours-tds-tps" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CoursTdsTps />
          </Suspense>
        } />
        <Route path="/sections-groupes" element={
          <Suspense fallback={<LoadingSpinner />}>
            <SectionsGroupes />
          </Suspense>
        } />
        <Route path="/planning-evaluations" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PlanningEvaluations />
          </Suspense>
        } />
        <Route path="/listes-examens" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ListesExamens />
          </Suspense>
        } />
        <Route path="/resultats" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Resultats />
          </Suspense>
        } />
        <Route path="/preselection" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Preselection />
          </Suspense>
        } />
        <Route path="/activites-parauniversitaire" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ActivitesParaUniversitaires />
          </Suspense>
        } />
        
        {/* Dynamic Pages */}
        <Route path="/:slug" element={
          <Suspense fallback={<LoadingSpinner />}>
            <DynamicPage />
          </Suspense>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        
        {/* Security Test */}
        <Route path="/security-test" element={
          <Suspense fallback={<LoadingSpinner />}>
            <SecurityTest />
          </Suspense>
        } />
      </Routes>
    </>
  );
};

export default AppRoutes;
