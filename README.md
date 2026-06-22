# EcoTrack — Application de démonstration

Application React + TypeScript + Vite simulant le dashboard de pilotage ECOTRACK
(certification RNCP 38822 EADL — Niveau 7, CFA ITIS).

🔗 **Démo en ligne** : https://johaann91.github.io/ecotrack/

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@ecotrack.fr | admin123 |
| Gestionnaire | gestionnaire@ecotrack.fr | gest123 |
| Agent terrain | agent@ecotrack.fr | agent123 |
| Citoyen | citoyen@ecotrack.fr | cit123 |

Ou utilisez les boutons d'accès rapide sur l'écran de connexion.

## Fonctionnalités

- **Carte temps réel** — 49 conteneurs simulés sur fond de carte sombre (Leaflet), mise à jour automatique toutes les 4 secondes
- **Parc de conteneurs** — table filtrable par zone, type et statut
- **Optimisation de tournée** — vrai algorithme Nearest Neighbor + amélioration 2-opt, exécuté côté client, avec tracé de l'itinéraire sur la carte
- **Espace citoyen** — classement des contributeurs, formulaire de signalement
- **Administration** — gestion des comptes et des signalements (RBAC 4 rôles)

## Développement local

```bash
npm install
npm run dev       # http://localhost:5173/ecotrack/
```

## Build de production

```bash
npm run build      # génère dist/
npm run preview    # prévisualiser le build
```

## Déploiement GitHub Pages

Le déploiement est automatique via GitHub Actions (`.github/workflows/deploy.yml`)
à chaque push sur `main`. Activez Pages dans Settings → Pages → Source : **GitHub Actions**.

## Stack technique

- React 19 + TypeScript
- React Router 7
- React-Leaflet 5 (cartographie)
- Vite 8

## Note sur les données

Toutes les données (conteneurs, capteurs, utilisateurs, signalements) sont
simulées côté client (`src/lib/data.ts`). Cette application est une démonstration
visuelle et fonctionnelle de l'interface ; le projet complet inclut également un
backend Node.js + Express avec API REST documentée Swagger (voir dossier
`ecotrack-real/backend` du dépôt principal).
