
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import App from "./App.tsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profil from "./pages/Profil";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Actualites from "./pages/Actualites";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/admin/*" element={<Admin />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
