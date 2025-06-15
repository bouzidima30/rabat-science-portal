
import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Admin from "../pages/Admin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminActualites from "../pages/AdminActualites";
import AdminEvenements from "../pages/AdminEvenements";
import AdminUtilisateurs from "../pages/AdminUtilisateurs";
import AdminFormations from "../pages/AdminFormations";
import AdminCooperations from "../pages/AdminCooperations";
import AdminPages from "../pages/AdminPages";
import AdminFichiers from "../pages/AdminFichiers";
import AdminUploadFiles from "../pages/AdminUploadFiles";
import AdminHistorique from "../pages/AdminHistorique";
import Actualites from "../pages/Actualites";
import ActualiteDetail from "../pages/ActualiteDetail";
import Evenements from "../pages/Evenements";
import EvenementDetail from "../pages/EvenementDetail";
import MotDoyen from "../pages/MotDoyen";
import ProjetDeveloppement from "../pages/ProjetDeveloppement";
import Historique from "../pages/Historique";
import Organisation from "../pages/Organisation";
import FSRChiffres from "../pages/FSRChiffres";
import Representants from "../pages/Representants";
import LMDGuide from "../pages/LMDGuide";
import Formations from "../pages/Formations";
import FormationLicence from "../pages/FormationLicence";
import FormationMaster from "../pages/FormationMaster";
import FormationDoctorat from "../pages/FormationDoctorat";
import FormationContinue from "../pages/FormationContinue";
import FormationDetail from "../pages/FormationDetail";
import EcoleDoctorale from "../pages/EcoleDoctorale";
import ValorisationRecherche from "../pages/ValorisationRecherche";
import StructuresRecherche from "../pages/StructuresRecherche";
import DomainesRecherche from "../pages/DomainesRecherche";
import PlateformesTechniques from "../pages/PlateformesTechniques";
import EspaceEnseignants from "../pages/EspaceEnseignants";
import EspaceEtudiants from "../pages/EspaceEtudiants";
import CooperationNationale from "../pages/CooperationNationale";
import CooperationInternationale from "../pages/CooperationInternationale";
import CooperationDetail from "../pages/CooperationDetail";
import Contact from "../pages/Contact";
import PlanAcces from "../pages/PlanAcces";
import CeDoc from "../pages/CeDoc";
import Bibliotheque from "../pages/Bibliotheque";
import ServicesBibliotheque from "../pages/ServicesBibliotheque";
import RessourcesElectroniques from "../pages/RessourcesElectroniques";
import ServiceScolarite from "../pages/ServiceScolarite";
import ProceduresNumeriques from "../pages/ProceduresNumeriques";
import CalendrierEmploiTemps from "../pages/CalendrierEmploiTemps";
import CoursTdsTps from "../pages/CoursTdsTps";
import SectionsGroupes from "../pages/SectionsGroupes";
import PlanningEvaluations from "../pages/PlanningEvaluations";
import ListesExamens from "../pages/ListesExamens";
import Resultats from "../pages/Resultats";
import Preselection from "../pages/Preselection";
import ActivitesParaUniversitaires from "../pages/ActivitesParaUniversitaires";
import Parametres from "../pages/Parametres";
import Profil from "../pages/Profil";
import NotFound from "../pages/NotFound";
import DynamicPage from "../pages/[slug]";
import AuthGuard from "./AuthGuard";
import SecurityTest from "@/pages/SecurityTest";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/parametres" element={<Parametres />} />
      <Route path="/profil" element={<AuthGuard><Profil /></AuthGuard>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AuthGuard><Admin /></AuthGuard>}>
        <Route index element={<AdminDashboard />} />
        <Route path="actualites" element={<AdminActualites />} />
        <Route path="evenements" element={<AdminEvenements />} />
        <Route path="utilisateurs" element={<AdminUtilisateurs />} />
        <Route path="formations" element={<AdminFormations />} />
        <Route path="cooperations" element={<AdminCooperations />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="fichiers" element={<AdminFichiers />} />
        <Route path="upload-files" element={<AdminUploadFiles />} />
        <Route path="historique" element={<AdminHistorique />} />
      </Route>

      {/* Public Pages */}
      <Route path="/actualites" element={<Actualites />} />
      <Route path="/actualite/:id" element={<ActualiteDetail />} />
      <Route path="/evenements" element={<Evenements />} />
      <Route path="/evenement/:id" element={<EvenementDetail />} />
      
      {/* Presentation Pages */}
      <Route path="/mot-doyen" element={<MotDoyen />} />
      <Route path="/projet-developpement" element={<ProjetDeveloppement />} />
      <Route path="/historique" element={<Historique />} />
      <Route path="/organisation" element={<Organisation />} />
      <Route path="/fsr-chiffres" element={<FSRChiffres />} />
      <Route path="/representants" element={<Representants />} />
      
      {/* Formation Pages */}
      <Route path="/formations" element={<Formations />} />
      <Route path="/lmd-guide" element={<LMDGuide />} />
      <Route path="/formation-licence" element={<FormationLicence />} />
      <Route path="/formation-master" element={<FormationMaster />} />
      <Route path="/formation-doctorat" element={<FormationDoctorat />} />
      <Route path="/formation-continue" element={<FormationContinue />} />
      <Route path="/formation/:id" element={<FormationDetail />} />
      
      {/* Research Pages */}
      <Route path="/ecole-doctorale" element={<EcoleDoctorale />} />
      <Route path="/valorisation-recherche" element={<ValorisationRecherche />} />
      <Route path="/recherche/structures" element={<StructuresRecherche />} />
      <Route path="/recherche/domaines" element={<DomainesRecherche />} />
      <Route path="/plateformes-techniques" element={<PlateformesTechniques />} />
      
      {/* Space Pages */}
      <Route path="/espace-enseignants" element={<EspaceEnseignants />} />
      <Route path="/espace-etudiants" element={<EspaceEtudiants />} />
      
      {/* Cooperation Pages */}
      <Route path="/cooperation-nationale" element={<CooperationNationale />} />
      <Route path="/cooperation-internationale" element={<CooperationInternationale />} />
      <Route path="/cooperation/:id" element={<CooperationDetail />} />
      
      {/* Contact & Practical Info */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/plan-acces" element={<PlanAcces />} />
      
      {/* Library & Services */}
      <Route path="/cedoc" element={<CeDoc />} />
      <Route path="/bibliotheque" element={<Bibliotheque />} />
      <Route path="/services-bibliotheque" element={<ServicesBibliotheque />} />
      <Route path="/ressources-electroniques" element={<RessourcesElectroniques />} />
      
      {/* Student Services */}
      <Route path="/service-scolarite" element={<ServiceScolarite />} />
      <Route path="/procedures-numeriques" element={<ProceduresNumeriques />} />
      <Route path="/calendrier-emploi-temps" element={<CalendrierEmploiTemps />} />
      <Route path="/cours-tds-tps" element={<CoursTdsTps />} />
      <Route path="/sections-groupes" element={<SectionsGroupes />} />
      <Route path="/planning-evaluations" element={<PlanningEvaluations />} />
      <Route path="/listes-examens" element={<ListesExamens />} />
      <Route path="/resultats" element={<Resultats />} />
      <Route path="/preselection" element={<Preselection />} />
      <Route path="/activites-parauniversitaire" element={<ActivitesParaUniversitaires />} />
      
      {/* Dynamic Pages */}
      <Route path="/:slug" element={<DynamicPage />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      
      {/* Security Test */}
      <Route path="/security-test" element={<SecurityTest />} />
    </Routes>
  );
};

export default AppRoutes;
