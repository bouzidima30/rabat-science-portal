## Objectif

Remplacer les couleurs codées en dur (`bg-gray-*`, `text-gray-*`, `bg-white`, `border-gray-*`, hex `#006be5`, etc.) par les **tokens sémantiques** déjà définis dans `src/index.css` et `tailwind.config.ts` (`background`, `foreground`, `muted`, `card`, `border`, `primary`, etc.).

~102 fichiers concernés. Pour éviter les régressions visuelles, on procède par **vagues automatisées + vérifications**, pas en un seul commit aveugle.

## Mapping appliqué

```text
bg-white            → bg-card
bg-gray-50          → bg-muted/30
bg-gray-100         → bg-muted
bg-gray-200         → bg-muted
border-gray-100/200 → border-border
border-gray-300     → border-input
text-gray-400/500   → text-muted-foreground
text-gray-600/700   → text-muted-foreground
text-gray-800/900   → text-foreground
hover:bg-gray-50    → hover:bg-muted/50
hover:bg-gray-100   → hover:bg-muted
#006be5 (inline)    → hsl(var(--primary))
```

`text-white` et `bg-black` sont **conservés** quand ils sont sur des gradients/overlays sombres (Hero, modals) — sinon remplacés par `text-primary-foreground`.

## Fichiers exclus

- `src/components/ui/**` — primitives shadcn déjà tokenisées, on n'y touche pas
- `src/utils/sanitize.ts`, `src/utils/contentSanitizer.ts` — hex valides pour sanitization HTML
- `src/data/siemData.ts` — données de démo (badges colorés)
- `src/components/LazyYouTubeEmbed.tsx` — `bg-red-600` est la couleur YouTube (marque)
- `src/index.css` — déjà la source de vérité

## Étapes

1. **Script sed ciblé** sur `src/pages/**` et `src/components/**` (hors exclusions) avec le mapping ci-dessus.
2. **Vérification TypeScript** (`tsc --noEmit`) après la passe.
3. **Inspection visuelle** des pages critiques via le preview : Accueil, Login, Contact, Footer, ModernNavbar, AdminDashboard.
4. **Correctifs ciblés** pour les cas où le remplacement automatique casse le contraste (texte clair sur fond clair).
5. **Rapport final** : fichiers modifiés, cas particuliers conservés, et liste des éventuels endroits restant à revoir manuellement.

## Hors scope

- Refonte des composants (split de fichiers volumineux)
- Changement de palette ou de tokens (on garde ceux d'`index.css` actuels)
- Mode sombre : on s'appuie sur les tokens existants, pas de nouvelle pass de tuning

Confirmez et je lance la vague 1.
