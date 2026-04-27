import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import ModernNavbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ReactNode } from "react";

interface ProcedureLayoutProps {
  title: string;
  intro?: string;
  sourceUrl?: string;
  children: ReactNode;
}

const ProcedureLayout = ({
  title,
  intro,
  sourceUrl,
  children,
}: ProcedureLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <ModernNavbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-6 text-[#006be5] hover:text-[#006be5]/80"
        >
          <Link to="/procedures-numeriques">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux Procédures Numériques
          </Link>
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        {intro && (
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {intro}
          </p>
        )}

        <Card className="shadow-sm">
          <CardContent className="p-6 md:p-8 prose prose-blue dark:prose-invert max-w-none">
            {children}
          </CardContent>
        </Card>

        {sourceUrl && (
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
            Source officielle :{" "}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#006be5] hover:underline inline-flex items-center"
            >
              fsr.ac.ma
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProcedureLayout;