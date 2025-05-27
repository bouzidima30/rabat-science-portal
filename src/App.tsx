
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Actualites from "./pages/Actualites";
import ActualiteDetail from "./pages/ActualiteDetail";
import ProjetDeveloppement from "./pages/ProjetDeveloppement";
import Historique from "./pages/Historique";
import Organisation from "./pages/Organisation";
import LMDGuide from "./pages/LMDGuide";
import EspaceEnseignants from "./pages/EspaceEnseignants";
import EspaceEtudiants from "./pages/EspaceEtudiants";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminActualites from "./pages/AdminActualites";
import MotDoyen from "./pages/MotDoyen";
import FSRChiffres from "./pages/FSRChiffres";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/lmd-guide" element={<LMDGuide />} />
          <Route path="/espace-enseignants" element={<EspaceEnseignants />} />
          <Route path="/espace-etudiants" element={<EspaceEtudiants />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="actualites" element={<AdminActualites />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
