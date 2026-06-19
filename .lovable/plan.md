## Analyse

J'ai scanné le code (knip + ripgrep). Voici l'état réel :

- **`console.log/debug/info` :** aucun dans `src/`. Seuls 5 `console.warn` légitimes (diagnostics de performance dans `usePerformanceMonitor` et `imageOptimization`). À **conserver**.
- **Hooks/composants custom :** tous utilisés. Aucun dead code custom.
- **Composants shadcn UI :** ~24 fichiers jamais importés (livrés par défaut mais inutilisés dans ce projet).
- **Dépendances npm orphelines :** ~20 paquets liés à ces composants shadcn inutilisés + `@swc/core` (interdit par la règle Vite Babel).
- **Réorganisation des dossiers :** la structure actuelle (`pages/{domaine}/`, `components/`, `components/admin/`, `hooks/`, `utils/`) est déjà cohérente et regroupée par feature. La changer toucherait des centaines d'imports pour zéro bénéfice fonctionnel — **non recommandé**.

## Plan d'action

### 1. Supprimer les composants shadcn UI inutilisés

```text
src/components/ui/
  aspect-ratio.tsx       avatar.tsx          breadcrumb.tsx
  calendar.tsx           chart.tsx           checkbox.tsx
  command.tsx            context-menu.tsx    drawer.tsx
  hover-card.tsx         input-otp.tsx       menubar.tsx
  navigation-menu.tsx    popover.tsx         radio-group.tsx
  resizable.tsx          scroll-area.tsx     sheet.tsx
  sidebar.tsx            slider.tsx          toggle-group.tsx
  toggle.tsx             use-toast.ts        (doublon de hooks/use-toast.ts)
src/hooks/use-mobile.tsx   (doublon de useMobileDetection.tsx)
```

### 2. Désinstaller les dépendances npm devenues orphelines

`@radix-ui/react-aspect-ratio`, `react-avatar`, `react-checkbox`, `react-context-menu`, `react-hover-card`, `react-menubar`, `react-navigation-menu`, `react-popover`, `react-radio-group`, `react-scroll-area`, `react-slider`, `react-toggle`, `react-toggle-group`, `cmdk`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `recharts`, `vaul`, `@types/dompurify`, `@swc/core`, `@tailwindcss/typography`.

### 3. Vérification

- `bunx tsc --noEmit` doit passer.
- Vérifier visuellement que la home, l'admin et une page publique se chargent.

## Ce que je ne fais PAS (sauf demande explicite)

- Réorganiser l'arborescence des dossiers (risque élevé, gain faible).
- Toucher aux `console.warn` (diagnostics utiles).
- Modifier la logique métier ou le design.

Veux-tu que j'exécute ce plan ?
