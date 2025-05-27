
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Actualites from "@/pages/Actualites";
import ActualiteDetail from "@/pages/ActualiteDetail";
import ProjetDeveloppement from "@/pages/ProjetDeveloppement";
import Historique from "@/pages/Historique";
import Organisation from "@/pages/Organisation";
import LMDGuide from "@/pages/LMDGuide";
import EspaceEnseignants from "@/pages/EspaceEnseignants";
import EspaceEtudiants from "@/pages/EspaceEtudiants";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminActualites from "@/pages/AdminActualites";
import AdminFormations from "@/pages/AdminFormations";
import AdminCooperations from "@/pages/AdminCooperations";
import AdminFichiers from "@/pages/AdminFichiers";
import MotDoyen from "@/pages/MotDoyen";
import FSRChiffres from "@/pages/FSRChiffres";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Representants from "@/pages/Representants";
import FormationDoctorat from "@/pages/FormationDoctorat";
import FormationLicence from "@/pages/FormationLicence";
import FormationMaster from "@/pages/FormationMaster";
import FormationContinue from "@/pages/FormationContinue";
import FormationDetail from "@/pages/FormationDetail";
import EcoleDoctorale from "@/pages/EcoleDoctorale";
import ValorisationRecherche from "@/pages/ValorisationRecherche";
import PlateformesTechniques from "@/pages/PlateformesTechniques";
import ProceduresNumeriques from "@/pages/ProceduresNumeriques";
import CeDoc from "@/pages/CeDoc";
import ServiceScolarite from "@/pages/ServiceScolarite";
import Bibliotheque from "@/pages/Bibliotheque";
import PlanAcces from "@/pages/PlanAcces";
import ServicesBibliotheque from "@/pages/ServicesBibliotheque";
import RessourcesElectroniques from "@/pages/RessourcesElectroniques";
import Resultats from "@/pages/Resultats";
import SectionsGroupes from "@/pages/SectionsGroupes";
import ActivitesParaUniversitaires from "@/pages/ActivitesParaUniversitaires";
import Preselection from "@/pages/Preselection";
import CoursTdsTps from "@/pages/CoursTdsTps";
import ListesExamens from "@/pages/ListesExamens";
import PlanningEvaluations from "@/pages/PlanningEvaluations";
import CalendrierEmploiTemps from "@/pages/CalendrierEmploiTemps";
import CooperationNationale from "@/pages/CooperationNationale";
import CooperationInternationale from "@/pages/CooperationInternationale";
import CooperationDetail from "@/pages/CooperationDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/actualites" element={<Actualites />} />
      <Route path="/actualites/:id" element={<ActualiteDetail />} />
      <Route path="/mot-doyen" element={<MotDoyen />} />
      <Route path="/projet-developpement" element={<ProjetDeveloppement />} />
      <Route path="/historique" element={<Historique />} />
      <Route path="/organisation" element={<Organisation />} />
      <Route path="/fsr-chiffres" element={<FSRChiffres />} />
      <Route path="/representants" element={<Representants />} />
      <Route path="/lmd-guide" element={<LMDGuide />} />
      <Route path="/formation-doctorat" element={<FormationDoctorat />} />
      <Route path="/formation-licence" element={<FormationLicence />} />
      <Route path="/formation-master" element={<FormationMaster />} />
      <Route path="/formation-continue" element={<FormationContinue />} />
      <Route path="/formation/:id" element={<FormationDetail />} />
      <Route path="/ecole-doctorale" element={<EcoleDoctorale />} />
      <Route path="/valorisation-recherche" element={<ValorisationRecherche />} />
      <Route path="/plateformes-techniques" element={<PlateformesTechniques />} />
      <Route path="/cooperation-nationale" element={<CooperationNationale />} />
      <Route path="/cooperation-internationale" element={<CooperationInternationale />} />
      <Route path="/cooperation/:id" element={<CooperationDetail />} />
      <Route path="/espace-enseignants" element={<EspaceEnseignants />} />
      <Route path="/espace-etudiants" element={<EspaceEtudiants />} />
      <Route path="/procedures-numeriques" element={<ProceduresNumeriques />} />
      <Route path="/cedoc" element={<CeDoc />} />
      <Route path="/service-scolarite" element={<ServiceScolarite />} />
      <Route path="/bibliotheque" element={<Bibliotheque />} />
      <Route path="/bibliotheque/plan-acces" element={<PlanAcces />} />
      <Route path="/bibliotheque/services" element={<ServicesBibliotheque />} />
      <Route path="/bibliotheque/ressources-electroniques" element={<RessourcesElectroniques />} />
      <Route path="/resultats" element={<Resultats />} />
      <Route path="/sections-groupes" element={<SectionsGroupes />} />
      <Route path="/activites-para-universitaires" element={<ActivitesParaUniversitaires />} />
      <Route path="/preselection" element={<Preselection />} />
      <Route path="/cours-tds-tps" element={<CoursTdsTps />} />
      <Route path="/listes-examens" element={<ListesExamens />} />
      <Route path="/planning-evaluations" element={<PlanningEvaluations />} />
      <Route path="/calendrier-emploi-temps" element={<CalendrierEmploiTemps />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="actualites" element={<AdminActualites />} />
        <Route path="formations" element={<AdminFormations />} />
        <Route path="cooperations" element={<AdminCooperations />} />
        <Route path="fichiers" element={<AdminFichiers />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
