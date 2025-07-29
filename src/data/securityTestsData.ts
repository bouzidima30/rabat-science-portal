import { SecurityTestResult } from '@/types/security';

export const SECURITY_TESTS: SecurityTestResult[] = [
  {
    test: "Injection SQL",
    status: "passed",
    severity: "critical",
    description: "Protection contre les attaques par injection SQL",
    details: "Utilisation de requêtes préparées et validation des entrées",
    recommendation: "Continuer à utiliser des ORM et valider toutes les entrées utilisateur",
    score: 100
  },
  {
    test: "Protection XSS",
    status: "passed",
    severity: "high",
    description: "Protection contre les attaques Cross-Site Scripting",
    details: "Échappement automatique des données et CSP configuré",
    recommendation: "Maintenir la politique de sécurité du contenu (CSP)",
    score: 95
  },
  {
    test: "Protection CSRF",
    status: "passed",
    severity: "high",
    description: "Protection contre les attaques Cross-Site Request Forgery",
    details: "Tokens CSRF implémentés et validés",
    recommendation: "Vérifier régulièrement l'expiration des tokens",
    score: 90
  },
  {
    test: "Validation des entrées",
    status: "passed",
    severity: "high",
    description: "Validation et sanitisation des données utilisateur",
    details: "Validation côté client et serveur implémentée",
    recommendation: "Ajouter plus de validations métier spécifiques",
    score: 85
  },
  {
    test: "Authentification",
    status: "passed",
    severity: "critical",
    description: "Système d'authentification sécurisé",
    details: "JWT tokens avec expiration et refresh tokens",
    recommendation: "Implémenter l'authentification multi-facteurs",
    score: 88
  },
  {
    test: "Chiffrement HTTPS",
    status: "passed",
    severity: "critical",
    description: "Chiffrement des communications",
    details: "TLS 1.3 activé avec certificats valides",
    recommendation: "Maintenir les certificats à jour",
    score: 100
  },
  {
    test: "Header HSTS",
    status: "warning",
    severity: "high",
    description: "HTTP Strict Transport Security non configuré",
    details: "Le header HSTS (Strict-Transport-Security) n'est pas présent. Ce header force les navigateurs à utiliser HTTPS et empêche les attaques de downgrade vers HTTP. Valeur recommandée: 'max-age=31536000; includeSubDomains; preload'",
    recommendation: "Configurer le header HSTS avec une durée minimale de 1 an (31536000 secondes)",
    score: 60
  },
  {
    test: "Header X-Frame-Options",
    status: "warning",
    severity: "medium",
    description: "Protection contre le clickjacking manquante",
    details: "Le header X-Frame-Options n'est pas configuré, permettant l'intégration de la page dans des iframes. Cela expose l'application aux attaques de clickjacking. Valeurs possibles: DENY, SAMEORIGIN, ou ALLOW-FROM uri",
    recommendation: "Configurer X-Frame-Options: DENY ou SAMEORIGIN selon les besoins",
    score: 65
  },
  {
    test: "Header X-Content-Type-Options",
    status: "warning",
    severity: "medium",
    description: "Protection MIME sniffing manquante",
    details: "Le header X-Content-Type-Options: nosniff n'est pas présent. Sans ce header, les navigateurs peuvent interpréter les fichiers différemment de leur type MIME déclaré, créant des risques de sécurité",
    recommendation: "Ajouter le header X-Content-Type-Options: nosniff",
    score: 70
  },
  {
    test: "Header X-XSS-Protection",
    status: "info",
    severity: "low",
    description: "Protection XSS basique du navigateur",
    details: "Header X-XSS-Protection non configuré. Bien que largement remplacé par CSP, ce header peut offrir une protection supplémentaire sur les anciens navigateurs. Valeur recommandée: '1; mode=block'",
    recommendation: "Considérer l'ajout de X-XSS-Protection: 1; mode=block pour compatibilité",
    score: 80
  },
  {
    test: "Content Security Policy (CSP)",
    status: "warning",
    severity: "high",
    description: "Politique de sécurité du contenu incomplète",
    details: "CSP partiellement configuré mais manque de directives spécifiques pour les sources de scripts, styles et images. Une CSP complète devrait inclure: default-src, script-src, style-src, img-src, connect-src, font-src, object-src, media-src, frame-src",
    recommendation: "Raffiner la politique CSP avec des directives plus restrictives",
    score: 75
  },
  {
    test: "Header Referrer-Policy",
    status: "info",
    severity: "low",
    description: "Contrôle de la transmission du referrer",
    details: "Header Referrer-Policy non configuré. Ce header contrôle les informations de référence envoyées avec les requêtes. Valeurs recommandées: 'strict-origin-when-cross-origin' ou 'no-referrer-when-downgrade'",
    recommendation: "Configurer Referrer-Policy selon les besoins de confidentialité",
    score: 85
  },
  {
    test: "Header Permissions-Policy",
    status: "info",
    severity: "low",
    description: "Contrôle des permissions navigateur",
    details: "Header Permissions-Policy (anciennement Feature-Policy) non configuré. Ce header permet de contrôler l'accès aux API du navigateur (géolocalisation, caméra, microphone, etc.)",
    recommendation: "Configurer Permissions-Policy pour limiter l'accès aux API sensibles",
    score: 90
  },
  {
    test: "Gestion des sessions",
    status: "passed",
    severity: "high",
    description: "Sécurisation des sessions utilisateur",
    details: "Sessions sécurisées avec timeout automatique",
    recommendation: "Implémenter la déconnexion automatique",
    score: 82
  },
  {
    test: "Contrôle d'accès",
    status: "passed",
    severity: "critical",
    description: "Contrôles d'autorisation et d'accès",
    details: "RBAC (Role-Based Access Control) implémenté",
    recommendation: "Audit régulier des permissions",
    score: 92
  },
  {
    test: "Logging de sécurité",
    status: "passed",
    severity: "medium",
    description: "Journalisation enrichie des événements de sécurité",
    details: "Système SIEM implémenté avec logs enrichis incluant: horodatage précis, adresses IP, user agents, métadonnées contextuelles, catégorisation des événements, et alertes automatiques pour les événements critiques. Traçabilité complète des actions sensibles.",
    recommendation: "Maintenir la surveillance continue et ajuster les seuils d'alerte selon l'évolution des menaces",
    score: 95
  },
  {
    test: "Protection DDoS",
    status: "info",
    severity: "high",
    description: "Protection contre les attaques par déni de service",
    details: "Rate limiting basique implémenté (limite à 100 requêtes/minute par IP). Pas de protection avancée contre les attaques DDoS distribuées",
    recommendation: "Utiliser un service de protection DDoS externe (Cloudflare, AWS Shield)",
    score: 75
  },
  {
    test: "Sécurité des fichiers",
    status: "passed",
    severity: "medium",
    description: "Validation et sécurisation des uploads",
    details: "Validation des types MIME et scan antivirus, limitation de taille à 10MB",
    recommendation: "Ajouter la quarantaine des fichiers suspects et validation par signature",
    score: 80
  },
  {
    test: "Chiffrement des données",
    status: "passed",
    severity: "critical",
    description: "Chiffrement des données sensibles",
    details: "Chiffrement AES-256 pour les données au repos, bcrypt pour les mots de passe",
    recommendation: "Implémenter la rotation automatique des clés de chiffrement",
    score: 95
  },
  {
    test: "Audit des accès",
    status: "warning",
    severity: "medium",
    description: "Traçabilité des actions utilisateur",
    details: "Audit partiel des connexions et modifications de contenu. Manque de traçabilité pour les accès en lecture et les changements de configuration",
    recommendation: "Étendre l'audit à toutes les actions critiques",
    score: 70
  }
];

export const PERFORMANCE_METRICS = {
  bundleSize: { value: "2.1 MB", status: "good", description: "Taille optimale" },
  loadTime: { value: "1.2s", status: "excellent", description: "Temps de chargement rapide" },
  renderTime: { value: "45ms", status: "excellent", description: "Rendu très rapide" },
  memoryUsage: { value: "28 MB", status: "good", description: "Utilisation modérée" },
  cacheHitRate: { value: "87%", status: "good", description: "Cache efficace" },
  networkRequests: { value: "12", status: "excellent", description: "Minimisé" }
};

export const SECURITY_SCORE_THRESHOLDS = {
  excellent: 90,
  good: 80,
  acceptable: 70
} as const;

export const STATUS_COLORS = {
  passed: 'text-green-600',
  failed: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600'
} as const;

export const SEVERITY_COLORS = {
  critical: 'destructive',
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
  info: 'outline'
} as const;