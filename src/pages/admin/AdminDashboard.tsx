import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Calendar,
  GraduationCap,
  Globe,
  FileUp,
  Users,
  Mail,
  Activity,
  TrendingUp,
  CheckCircle2,
  FileEdit,
  Plus,
  ArrowUpRight,
  Clock,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

// ----- helpers -----
const countQuery = (key: string, table: any, filter?: (q: any) => any) => ({
  queryKey: [key],
  queryFn: async () => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = filter(q);
    const { count } = await q;
    return count ?? 0;
  },
});

// ----- small components -----
interface KpiProps {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  trend?: string;
  loading?: boolean;
}
const KpiCard = ({ label, value, hint, icon: Icon, trend, loading }: KpiProps) => (
  <Card className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-3xl font-bold text-foreground tabular-nums">{value}</p>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          <span>{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

interface SectionStatProps {
  title: string;
  icon: LucideIcon;
  total: number;
  published: number;
  drafts: number;
  link: string;
  loading?: boolean;
}
const SectionStat = ({ title, icon: Icon, total, published, drafts, link, loading }: SectionStatProps) => (
  <Card className="group border-border/60 hover:shadow-md transition-all">
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent p-2">
            <Icon className="h-4 w-4 text-accent-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition">
          <Link to={link} aria-label={`Ouvrir ${title}`}>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      {loading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <>
          <p className="text-2xl font-bold text-foreground tabular-nums">{total}</p>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> {published} publiés
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <FileEdit className="h-3 w-3" /> {drafts} brouillons
            </span>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { user } = useAuth();

  // KPIs
  const newsTotal = useQuery(countQuery("dash-news-total", "news"));
  const newsPublished = useQuery(countQuery("dash-news-pub", "news", (q) => q.eq("status", "published")));
  const eventsTotal = useQuery(countQuery("dash-events-total", "events"));
  const eventsPublished = useQuery(countQuery("dash-events-pub", "events", (q) => q.eq("status", "published")));
  const formationsTotal = useQuery(countQuery("dash-formations-total", "formations"));
  const formationsPublished = useQuery(countQuery("dash-formations-pub", "formations", (q) => q.eq("status", "published")));
  const coopTotal = useQuery(countQuery("dash-coop-total", "cooperations"));
  const coopPublished = useQuery(countQuery("dash-coop-pub", "cooperations", (q) => q.eq("status", "published")));
  const pagesTotal = useQuery(countQuery("dash-pages-total", "pages"));
  const pagesPublished = useQuery(countQuery("dash-pages-pub", "pages", (q) => q.eq("status", "published")));
  const filesTotal = useQuery(countQuery("dash-files-total", "files"));
  const usersTotal = useQuery(countQuery("dash-users-total", "profiles"));
  const unreadMessages = useQuery(countQuery("dash-msg-unread", "contact_messages", (q) => q.eq("status", "unread")));

  // Recent items
  const recentNews = useQuery({
    queryKey: ["dash-recent-news"],
    queryFn: async () => {
      const { data } = await supabase
        .from("news")
        .select("id, title, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const upcomingEvents = useQuery({
    queryKey: ["dash-upcoming-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("id, titre, date_debut, lieu, status")
        .gte("date_debut", new Date().toISOString().split("T")[0])
        .order("date_debut", { ascending: true })
        .limit(5);
      return data ?? [];
    },
  });

  const recentActivity = useQuery({
    queryKey: ["dash-recent-activity"],
    queryFn: async () => {
      const { data } = await supabase
        .from("activity_logs")
        .select("id, action, category, severity, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const totalContent =
    (newsTotal.data ?? 0) +
    (eventsTotal.data ?? 0) +
    (formationsTotal.data ?? 0) +
    (pagesTotal.data ?? 0);

  const totalPublished =
    (newsPublished.data ?? 0) +
    (eventsPublished.data ?? 0) +
    (formationsPublished.data ?? 0) +
    (pagesPublished.data ?? 0);

  const totalDrafts = totalContent - totalPublished;

  const quickActions: { label: string; to: string; icon: LucideIcon }[] = [
    { label: "Nouvelle actualité", to: "/admin/actualites", icon: FileText },
    { label: "Nouvel événement", to: "/admin/evenements", icon: Calendar },
    { label: "Nouvelle formation", to: "/admin/formations", icon: GraduationCap },
    { label: "Téléverser un fichier", to: "/admin/upload-files", icon: FileUp },
  ];

  const sections = [
    {
      title: "Actualités",
      icon: FileText,
      total: newsTotal.data ?? 0,
      published: newsPublished.data ?? 0,
      drafts: (newsTotal.data ?? 0) - (newsPublished.data ?? 0),
      link: "/admin/actualites",
      loading: newsTotal.isLoading,
    },
    {
      title: "Événements",
      icon: Calendar,
      total: eventsTotal.data ?? 0,
      published: eventsPublished.data ?? 0,
      drafts: (eventsTotal.data ?? 0) - (eventsPublished.data ?? 0),
      link: "/admin/evenements",
      loading: eventsTotal.isLoading,
    },
    {
      title: "Formations",
      icon: GraduationCap,
      total: formationsTotal.data ?? 0,
      published: formationsPublished.data ?? 0,
      drafts: (formationsTotal.data ?? 0) - (formationsPublished.data ?? 0),
      link: "/admin/formations",
      loading: formationsTotal.isLoading,
    },
    {
      title: "Coopérations",
      icon: Globe,
      total: coopTotal.data ?? 0,
      published: coopPublished.data ?? 0,
      drafts: (coopTotal.data ?? 0) - (coopPublished.data ?? 0),
      link: "/admin/cooperations",
      loading: coopTotal.isLoading,
    },
    {
      title: "Pages",
      icon: LayoutDashboard,
      total: pagesTotal.data ?? 0,
      published: pagesPublished.data ?? 0,
      drafts: (pagesTotal.data ?? 0) - (pagesPublished.data ?? 0),
      link: "/admin/pages",
      loading: pagesTotal.isLoading,
    },
    {
      title: "Fichiers",
      icon: FileUp,
      total: filesTotal.data ?? 0,
      published: filesTotal.data ?? 0,
      drafts: 0,
      link: "/admin/fichiers",
      loading: filesTotal.isLoading,
    },
  ];

  const formatRelative = (d: string) =>
    formatDistanceToNow(new Date(d), { addSuffix: true, locale: fr });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  })();

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{greeting}</p>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Vue d'ensemble de l'activité de la Faculté des Sciences de Rabat
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </header>

        {/* KPI grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Contenu total"
            value={totalContent}
            hint={`${totalPublished} publiés · ${totalDrafts} brouillons`}
            icon={Activity}
            loading={newsTotal.isLoading}
          />
          <KpiCard
            label="Utilisateurs"
            value={usersTotal.data ?? 0}
            hint="Comptes enregistrés"
            icon={Users}
            loading={usersTotal.isLoading}
          />
          <KpiCard
            label="Messages non lus"
            value={unreadMessages.data ?? 0}
            hint="Formulaire de contact"
            icon={Mail}
            loading={unreadMessages.isLoading}
          />
          <KpiCard
            label="Fichiers"
            value={filesTotal.data ?? 0}
            hint="Documents stockés"
            icon={FileUp}
            loading={filesTotal.isLoading}
          />
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((a) => (
              <Button
                key={a.to}
                asChild
                variant="outline"
                className="h-auto py-3 justify-start gap-3 hover:border-primary/40 hover:bg-accent"
              >
                <Link to={a.to}>
                  <div className="rounded-md bg-primary/10 p-1.5">
                    <a.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{a.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </section>

        {/* Sections breakdown */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Contenu par section
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((s) => (
              <SectionStat key={s.title} {...s} />
            ))}
          </div>
        </section>

        {/* Bottom grid: recent news / events / activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent news */}
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base">Dernières actualités</CardTitle>
                <CardDescription className="text-xs">Les 5 dernières créées</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/actualites">Voir tout</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {recentNews.isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : recentNews.data?.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Aucune actualité
                </p>
              ) : (
                <ul className="space-y-1">
                  {recentNews.data?.map((n: any, idx: number) => (
                    <li key={n.id}>
                      {idx > 0 && <Separator className="my-1" />}
                      <div className="flex items-start justify-between gap-3 py-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatRelative(n.created_at)}
                          </p>
                        </div>
                        <Badge
                          variant={n.status === "published" ? "default" : "secondary"}
                          className="text-[10px] shrink-0"
                        >
                          {n.status === "published" ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Upcoming events */}
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base">Événements à venir</CardTitle>
                <CardDescription className="text-xs">Prochaines dates</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/evenements">Voir tout</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {upcomingEvents.isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : upcomingEvents.data?.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Aucun événement à venir
                </p>
              ) : (
                <ul className="space-y-1">
                  {upcomingEvents.data?.map((e: any, idx: number) => (
                    <li key={e.id}>
                      {idx > 0 && <Separator className="my-1" />}
                      <div className="flex items-start gap-3 py-2">
                        <div className="rounded-md bg-accent p-2 shrink-0">
                          <Calendar className="h-4 w-4 text-accent-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {e.titre}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(e.date_debut).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            {e.lieu && ` · ${e.lieu}`}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base">Activité récente</CardTitle>
                <CardDescription className="text-xs">Dernières actions</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/historique">Voir tout</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {recentActivity.isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : recentActivity.data?.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Aucune activité
                </p>
              ) : (
                <ul className="space-y-1">
                  {recentActivity.data?.map((log: any, idx: number) => (
                    <li key={log.id}>
                      {idx > 0 && <Separator className="my-1" />}
                      <div className="flex items-start gap-3 py-2">
                        <div
                          className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                            log.severity === "high" || log.severity === "critical"
                              ? "bg-destructive"
                              : log.severity === "medium"
                              ? "bg-primary"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground truncate">{log.action}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {log.category && <span>{log.category} · </span>}
                            {formatRelative(log.created_at)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;