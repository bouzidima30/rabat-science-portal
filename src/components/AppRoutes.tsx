
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ScrollToTop from "./ScrollToTop";
import AuthGuard from "./AuthGuard";
import * as LazyPages from "./LazyRoutes";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
        <Route path="/" element={<LazyPages.Index />} />
        <Route path="/login" element={<LazyPages.Login />} />
        <Route path="/register" element={<LazyPages.Register />} />
        <Route path="/profil" element={<AuthGuard><LazyPages.Profil /></AuthGuard>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AuthGuard><LazyPages.Admin /></AuthGuard>}>
          <Route index element={<LazyPages.AdminDashboard />} />
          <Route path="actualites" element={<LazyPages.AdminActualites />} />
          <Route path="evenements" element={<LazyPages.AdminEvenements />} />
          <Route path="utilisateurs" element={<LazyPages.AdminUtilisateurs />} />
          <Route path="formations" element={<LazyPages.AdminFormations />} />
          <Route path="cooperations" element={<LazyPages.AdminCooperations />} />
          <Route path="pages" element={<LazyPages.AdminPages />} />
          <Route path="fichiers" element={<LazyPages.AdminFichiers />} />
          <Route path="upload-files" element={<LazyPages.AdminUploadFiles />} />
          <Route path="historique" element={<LazyPages.AdminHistorique />} />
        </Route>

        {/* Public Pages */}
        <Route path="/actualites" element={<LazyPages.Actualites />} />
        <Route path="/actualite/:id" element={<LazyPages.ActualiteDetail />} />
        <Route path="/evenements" element={<LazyPages.Evenements />} />
        <Route path="/evenement/:id" element={<LazyPages.EvenementDetail />} />
        
        {/* Presentation Pages */}
        <Route path="/presentation/mot-doyen" element={<LazyPages.MotDoyen />} />
        <Route path="/presentation/projet-developpement" element={<LazyPages.ProjetDeveloppement />} />
        <Route path="/presentation/historique" element={<LazyPages.Historique />} />
        <Route path="/presentation/organisation" element={<LazyPages.Organisation />} />
        <Route path="/presentation/fsr-chiffres" element={<LazyPages.FSRChiffres />} />
        <Route path="/presentation/representants" element={<LazyPages.Representants />} />
        
        {/* Formation Pages */}
        <Route path="/formations/lmd-guide" element={<LazyPages.LMDGuide />} />
        <Route path="/formations" element={<LazyPages.Formations />} />
        <Route path="/formations/formation-licence" element={<LazyPages.FormationLicence />} />
        <Route path="/formations/formation-master" element={<LazyPages.FormationMaster />} />
        <Route path="/formations/formation-doctorat" element={<LazyPages.FormationDoctorat />} />
        <Route path="/formations/formation-continue" element={<LazyPages.FormationContinue />} />
        <Route path="/formation/:id" element={<LazyPages.FormationDetail />} />
        
        {/* Research Pages */}
        <Route path="/recherche/ecole-doctorale" element={<LazyPages.EcoleDoctorale />} />
        <Route path="/recherche/valorisation-recherche" element={<LazyPages.ValorisationRecherche />} />
        <Route path="/recherche/structures" element={<LazyPages.StructuresRecherche />} />
        <Route path="/recherche/domaines" element={<LazyPages.DomainesRecherche />} />
        <Route path="/recherche/plateformes-techniques" element={<LazyPages.PlateformesTechniques />} />
        
        {/* Space Pages */}
        <Route path="/espace-enseignants" element={<LazyPages.EspaceEnseignants />} />
        <Route path="/espace-etudiants" element={<LazyPages.EspaceEtudiants />} />
        
        {/* Cooperation Pages */}
        <Route path="/cooperation-nationale" element={<LazyPages.CooperationNationale />} />
        <Route path="/cooperation-internationale" element={<LazyPages.CooperationInternationale />} />
        <Route path="/cooperation/:id" element={<LazyPages.CooperationDetail />} />
        
        {/* Contact & Practical Info */}
        <Route path="/contact" element={<LazyPages.Contact />} />
        <Route path="/plan-acces" element={<LazyPages.PlanAcces />} />
        
        {/* Library & Services */}
        <Route path="/cedoc" element={<LazyPages.CeDoc />} />
        <Route path="/bibliotheque" element={<LazyPages.Bibliotheque />} />
        <Route path="/services-bibliotheque" element={<LazyPages.ServicesBibliotheque />} />
        <Route path="/ressources-electroniques" element={<LazyPages.RessourcesElectroniques />} />
        
        {/* Student Services */}
        <Route path="/service-scolarite" element={<LazyPages.ServiceScolarite />} />
        <Route path="/procedures-numeriques" element={<LazyPages.ProceduresNumeriques />} />
        <Route path="/calendrier-emploi-temps" element={<LazyPages.CalendrierEmploiTemps />} />
        <Route path="/cours-tds-tps" element={<LazyPages.CoursTdsTps />} />
        <Route path="/sections-groupes" element={<LazyPages.SectionsGroupes />} />
        <Route path="/planning-evaluations" element={<LazyPages.PlanningEvaluations />} />
        <Route path="/listes-examens" element={<LazyPages.ListesExamens />} />
        <Route path="/resultats" element={<LazyPages.Resultats />} />
        <Route path="/preselection" element={<LazyPages.Preselection />} />
        <Route path="/activites-parauniversitaire" element={<LazyPages.ActivitesParaUniversitaires />} />
        
        {/* Dynamic Pages */}
        <Route path="/:slug" element={<LazyPages.DynamicPage />} />
        
        {/* 404 */}
        <Route path="*" element={<LazyPages.NotFound />} />
        
        {/* Security Test */}
        <Route path="/security-test" element={<LazyPages.SecurityTest />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
