# Super Lapin Bros - Niveau 1

Un jeu de plateforme inspiré du premier niveau de Super Mario Bros, mais avec un petit lapin comme héros et des fleurs comme ennemis !

## Comment jouer localement

### Option 1 : Ouvrir directement
1. Clonez ce dépôt sur votre ordinateur
2. Ouvrez le fichier `index.html` directement dans votre navigateur (double-clic)

### Option 2 : Avec un serveur local
```bash
# Clonez le dépôt
git clone <url-du-repo>
cd nutrition-coach-app

# Lancez un serveur HTTP
python3 -m http.server 8000

# Ouvrez votre navigateur à l'adresse :
# http://localhost:8000
```

## Contrôles

- **← →** (Flèches gauche/droite) : Déplacer le lapin
- **ESPACE** : Sauter
- **R** : Recommencer la partie

## Description du jeu

### Le Héros : Le Lapin
```
  🐰
```
Un adorable petit lapin blanc avec :
- Des oreilles roses
- Des yeux noirs
- Un petit nez rose
- Des pattes blanches

Le lapin peut courir et sauter pour traverser le niveau !

### Les Ennemis : Les Fleurs
```
  🌺
```
Des fleurs rouges méchantes avec :
- 6 pétales rouges disposés en cercle
- Un centre doré
- Des petits yeux noirs
- Une tige verte

**Types de fleurs :**
- **Fleurs statiques** : Restent en place sur le sol
- **Fleurs mobiles** : Se déplacent de gauche à droite sur les plateformes

### Le Niveau

Le niveau comprend :

1. **Sol herbeux** (en bas) - Vert avec bordure
2. **Plateformes de briques** - Marron avec texture de briques
3. **Blocs mystères** - Dorés avec un "?" dessus
4. **Tuyaux verts** - Style Mario, de différentes hauteurs
5. **Arrière-plan** - Ciel bleu avec nuages blancs

### Disposition du niveau

```
                                    ?
                        ?                   ?

    ══════════          ════════        ══════════
                                                    ┃┃
                                              ┃┃    ┃┃
══════════════════════════════════════════════════════
    🌺          🌺              🌺              ┃┃    ┃┃
```

## Système de jeu

### Points
- **Éliminer une fleur** : +100 points
  - Sautez sur une fleur pour l'éliminer
  - Le lapin rebondit légèrement après l'avoir écrasée

### Vies
- Vous commencez avec **3 vies**
- Vous perdez une vie si :
  - Une fleur vous touche (par le côté ou par en dessous)
  - Vous tombez dans le vide
- Après avoir perdu une vie, vous recommencez au début du niveau
- À 0 vie : **Game Over**

### Victoire
Atteignez le bord droit du niveau pour gagner !

## Physique du jeu

Le jeu utilise une physique réaliste :
- **Gravité** : Le lapin tombe naturellement
- **Saut** : Appuyez sur Espace pour sauter (seulement quand vous êtes au sol)
- **Collisions** :
  - Vous pouvez atterrir sur les plateformes
  - Vous pouvez cogner les blocs par en dessous
  - Les murs vous empêchent de passer

## Écrans de jeu

### Écran principal
- Titre "Super Lapin Bros" en rouge stylisé
- Compteurs :
  - Score actuel
  - Nombre de fleurs collectées
  - Vies restantes
- Zone de jeu (canvas 800x600)
- Instructions des contrôles

### Game Over
Apparaît quand vous perdez toutes vos vies :
- Message "Game Over!" en rouge
- Score final
- Bouton "Rejouer"

### Victoire
Apparaît quand vous atteignez la fin du niveau :
- Message "Victoire! 🎉" en vert
- Score final
- Bouton "Rejouer"

## Fichiers du projet

- `index.html` - Structure HTML du jeu
- `style.css` - Styles et mise en page
- `game.js` - Moteur de jeu et logique

## Stratégies pour gagner

1. **Timing des sauts** : Apprenez à bien chronométrer vos sauts pour atterrir sur les fleurs
2. **Fleurs mobiles** : Observez leur pattern de mouvement avant de sauter
3. **Utilisez les plateformes** : Sautez de plateforme en plateforme pour éviter les fleurs au sol
4. **Ne vous précipitez pas** : Prenez votre temps pour bien viser vos sauts

## Amusez-vous bien !

Bonne chance pour sauver le monde des fleurs avec votre super lapin ! 🐰🌺
