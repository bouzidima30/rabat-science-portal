
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import AuthGuard from "./AuthGuard";
import LoadingSuspense from "./LoadingSuspense";
import * as LazyPages from "./LazyRoutes";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LoadingSuspense><LazyPages.Index /></LoadingSuspense>} />
        <Route path="/login" element={<LoadingSuspense><LazyPages.Login /></LoadingSuspense>} />
        <Route path="/register" element={<LoadingSuspense><LazyPages.Register /></LoadingSuspense>} />
        <Route path="/profil" element={<AuthGuard><LoadingSuspense><LazyPages.Profil /></LoadingSuspense></AuthGuard>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AuthGuard><LoadingSuspense><LazyPages.Admin /></LoadingSuspense></AuthGuard>}>
          <Route index element={<LoadingSuspense><LazyPages.AdminDashboard /></LoadingSuspense>} />
          <Route path="actualites" element={<LoadingSuspense><LazyPages.AdminActualites /></LoadingSuspense>} />
          <Route path="evenements" element={<LoadingSuspense><LazyPages.AdminEvenements /></LoadingSuspense>} />
          <Route path="utilisateurs" element={<LoadingSuspense><LazyPages.AdminUtilisateurs /></LoadingSuspense>} />
          <Route path="formations" element={<LoadingSuspense><LazyPages.AdminFormations /></LoadingSuspense>} />
          <Route path="cooperations" element={<LoadingSuspense><LazyPages.AdminCooperations /></LoadingSuspense>} />
          <Route path="pages" element={<LoadingSuspense><LazyPages.AdminPages /></LoadingSuspense>} />
          <Route path="fichiers" element={<LoadingSuspense><LazyPages.AdminFichiers /></LoadingSuspense>} />
          <Route path="upload-files" element={<LoadingSuspense><LazyPages.AdminUploadFiles /></LoadingSuspense>} />
          <Route path="historique" element={<LoadingSuspense><LazyPages.AdminHistorique /></LoadingSuspense>} />
        </Route>

        {/* Public Pages */}
        <Route path="/actualites" element={<LoadingSuspense><LazyPages.Actualites /></LoadingSuspense>} />
        <Route path="/actualite/:id" element={<LoadingSuspense><LazyPages.ActualiteDetail /></LoadingSuspense>} />
        <Route path="/evenements" element={<LoadingSuspense><LazyPages.Evenements /></LoadingSuspense>} />
        <Route path="/evenement/:id" element={<LoadingSuspense><LazyPages.EvenementDetail /></LoadingSuspense>} />
        
        {/* Presentation Pages */}
        <Route path="/presentation/mot-doyen" element={<LoadingSuspense><LazyPages.MotDoyen /></LoadingSuspense>} />
        <Route path="/presentation/projet-developpement" element={<LoadingSuspense><LazyPages.ProjetDeveloppement /></LoadingSuspense>} />
        <Route path="/presentation/historique" element={<LoadingSuspense><LazyPages.Historique /></LoadingSuspense>} />
        <Route path="/presentation/organisation" element={<LoadingSuspense><LazyPages.Organisation /></LoadingSuspense>} />
        <Route path="/presentation/fsr-chiffres" element={<LoadingSuspense><LazyPages.FSRChiffres /></LoadingSuspense>} />
        <Route path="/presentation/representants" element={<LoadingSuspense><LazyPages.Representants /></LoadingSuspense>} />
        
        {/* Formation Pages */}
        <Route path="/formations/lmd-guide" element={<LoadingSuspense><LazyPages.LMDGuide /></LoadingSuspense>} />
        <Route path="/formations" element={<LoadingSuspense><LazyPages.Formations /></LoadingSuspense>} />
        <Route path="/formations/formation-licence" element={<LoadingSuspense><LazyPages.FormationLicence /></LoadingSuspense>} />
        <Route path="/formations/formation-master" element={<LoadingSuspense><LazyPages.FormationMaster /></LoadingSuspense>} />
        <Route path="/formations/formation-doctorat" element={<LoadingSuspense><LazyPages.FormationDoctorat /></LoadingSuspense>} />
        <Route path="/formations/formation-continue" element={<LoadingSuspense><LazyPages.FormationContinue /></LoadingSuspense>} />
        <Route path="/formation/:id" element={<LoadingSuspense><LazyPages.FormationDetail /></LoadingSuspense>} />
        
        {/* Research Pages */}
        <Route path="/recherche/ecole-doctorale" element={<LoadingSuspense><LazyPages.EcoleDoctorale /></LoadingSuspense>} />
        <Route path="/recherche/valorisation-recherche" element={<LoadingSuspense><LazyPages.ValorisationRecherche /></LoadingSuspense>} />
        <Route path="/recherche/structures" element={<LoadingSuspense><LazyPages.StructuresRecherche /></LoadingSuspense>} />
        <Route path="/recherche/domaines" element={<LoadingSuspense><LazyPages.DomainesRecherche /></LoadingSuspense>} />
        <Route path="/recherche/plateformes-techniques" element={<LoadingSuspense><LazyPages.PlateformesTechniques /></LoadingSuspense>} />
        
        {/* Space Pages */}
        <Route path="/espace-enseignants" element={<LoadingSuspense><LazyPages.EspaceEnseignants /></LoadingSuspense>} />
        <Route path="/espace-etudiants" element={<LoadingSuspense><LazyPages.EspaceEtudiants /></LoadingSuspense>} />
        
        {/* Cooperation Pages */}
        <Route path="/cooperation-nationale" element={<LoadingSuspense><LazyPages.CooperationNationale /></LoadingSuspense>} />
        <Route path="/cooperation-internationale" element={<LoadingSuspense><LazyPages.CooperationInternationale /></LoadingSuspense>} />
        <Route path="/cooperation/:id" element={<LoadingSuspense><LazyPages.CooperationDetail /></LoadingSuspense>} />
        
        {/* Contact & Practical Info */}
        <Route path="/contact" element={<LoadingSuspense><LazyPages.Contact /></LoadingSuspense>} />
        <Route path="/plan-acces" element={<LoadingSuspense><LazyPages.PlanAcces /></LoadingSuspense>} />
        
        {/* Library & Services */}
        <Route path="/cedoc" element={<LoadingSuspense><LazyPages.CeDoc /></LoadingSuspense>} />
        <Route path="/bibliotheque" element={<LoadingSuspense><LazyPages.Bibliotheque /></LoadingSuspense>} />
        <Route path="/services-bibliotheque" element={<LoadingSuspense><LazyPages.ServicesBibliotheque /></LoadingSuspense>} />
        <Route path="/ressources-electroniques" element={<LoadingSuspense><LazyPages.RessourcesElectroniques /></LoadingSuspense>} />
        
        {/* Student Services */}
        <Route path="/service-scolarite" element={<LoadingSuspense><LazyPages.ServiceScolarite /></LoadingSuspense>} />
        <Route path="/procedures-numeriques" element={<LoadingSuspense><LazyPages.ProceduresNumeriques /></LoadingSuspense>} />
        <Route path="/calendrier-emploi-temps" element={<LoadingSuspense><LazyPages.CalendrierEmploiTemps /></LoadingSuspense>} />
        <Route path="/cours-tds-tps" element={<LoadingSuspense><LazyPages.CoursTdsTps /></LoadingSuspense>} />
        <Route path="/sections-groupes" element={<LoadingSuspense><LazyPages.SectionsGroupes /></LoadingSuspense>} />
        <Route path="/planning-evaluations" element={<LoadingSuspense><LazyPages.PlanningEvaluations /></LoadingSuspense>} />
        <Route path="/listes-examens" element={<LoadingSuspense><LazyPages.ListesExamens /></LoadingSuspense>} />
        <Route path="/resultats" element={<LoadingSuspense><LazyPages.Resultats /></LoadingSuspense>} />
        <Route path="/preselection" element={<LoadingSuspense><LazyPages.Preselection /></LoadingSuspense>} />
        <Route path="/activites-parauniversitaire" element={<LoadingSuspense><LazyPages.ActivitesParaUniversitaires /></LoadingSuspense>} />
        
        {/* Dynamic Pages */}
        <Route path="/:slug" element={<LoadingSuspense><LazyPages.DynamicPage /></LoadingSuspense>} />
        
        {/* 404 */}
        <Route path="*" element={<LoadingSuspense><LazyPages.NotFound /></LoadingSuspense>} />
        
        {/* Security Test */}
        <Route path="/security-test" element={<LoadingSuspense><LazyPages.SecurityTest /></LoadingSuspense>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
