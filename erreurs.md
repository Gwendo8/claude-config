# Journal des erreurs de Claude

Une ligne par erreur vue une fois. Quand une erreur revient, elle passe dans
« Erreurs à ne pas refaire » de ~/.claude/CLAUDE.md et sa ligne est retirée d'ici.
Format : - date | projet | mots-clés | ce qui s'est passé

## Git

## Tests et vérifications

- 2026-11-20 | Mijote | vérification visuelle, données imitées | Tableau des aliments vérifié seulement avec des noms courts imités (« Skyr ») : avec les vrais noms longs de Ciqual, les colonnes de chiffres s'écrasaient ; vérifier avec des données réalistes (textes longs, valeurs vides)
- 2026-11-20 | Mijote | front, maquettes, relecture d'agent | Bloc d'écrans accepté et commité sans comparaison écran par écran avec les maquettes Figma (l'agent l'avait signalé, le brief ne l'exigeait pas) : connexion mal faite, profil PC en colonne centrée façon mobile
- 2026-11-19 | ia (claude-config) | vérification visuelle, quota | Pour regarder une page locale dans le navigateur de test, affiché toute la page encodée en base64 dans la conversation (≈26 Ko) au lieu de la vérifier une fois en ligne : quota consommé pour rien
- 2026-11-13 | platine | tests, heure, dépendance au temps | L'outil de connexion des tests e2e attendait « Bonjour » alors que l'accueil dit « Bonsoir » après 18 h : presque tous les tests échouaient le soir ; un test ne doit jamais dépendre de l'heure à laquelle on le lance.
- 2026-11-13 | platine | tests, suppression de fonctionnalité, oubli | En retirant Jamendo, j'ai oublié son test e2e, qui échouait ensuite ; en retirant une fonctionnalité, chercher aussi ses tests (y compris e2e) et les retirer.
- 2026-11-13 | platine | tests, commit, enchaînement | J'ai enchaîné `npm test ; git commit` avec « ; » : un test (instable, sans lien) a échoué et le commit est parti quand même ; enchaîner avec « && » ou vérifier le résultat des tests avant de commiter.
- 2026-11-22 | Mijote | tests, données de test, supposition | test écrit avec la donnée `skyr` prise pour une idée de plat d'après son nom, alors que c'était un aliment ; test en échec, corrigé après lecture des données du fichier

## Base de données

## Code

- 2026-11-21 | Mijote | React, formulaire, fenêtre, tests | agent front : un formulaire (sélecteur d'aliment) dans une fenêtre ouverte à l'intérieur du formulaire de la recette ; l'envoi remontait au formulaire parent (React fait remonter les évènements), donc « Relier » envoyait toute la recette ; aucun test ne cliquait jusqu'au bout, et je l'ai commité sans l'essayer ; trouvé par l'utilisatrice. Revue le même jour : j'ai annoncé « corrigé » sur la foi d'un test jsdom seulement ; dans un vrai navigateur la page se rechargeait encore (formulaires imbriqués), corrigé ensuite par un portail ; un correctif d'interface se vérifie dans un vrai navigateur avant d'être annoncé.
- 2026-11-20 | Mijote | transaction, Sequelize | agent back : `inTransaction(async () => …)` sans passer `{ transaction }` aux requêtes, donc transaction inutile (`cacheProducts`), repéré par l'agent suivant.
- 2026-11-18 | ia | node, nvmrc, version, PATH | Dans les lanceurs hooks/node.sh et .husky/path.sh, j'ai fait passer le Node de Homebrew avant nvm sans regarder le .nvmrc : le pre-commit de Platine a tourné en Node 23.7, la version qui casse ses tests ; quand un script choisit une version d'outil, partir de celle que fixe le projet (.nvmrc).
- 2026-11-16 | Platine | icône, bouton, interface | le haut-parleur du volume était un simple dessin, pas un bouton : un collègue cliquait pour remettre le son, rien ne se passait (tout pictogramme qui invite au clic doit être un vrai bouton)
- 2026-11-16 | Platine | navigation, retour, ordinateur | flèche « Retour » des pages album/artiste/titre cachée sur ordinateur en supposant que le menu latéral suffisait ; il ne ramène pas à la liste d'où l'on vient, les collègues devaient recliquer « Catalogue »
- 2026-11-18 | platine | CSS, animation, rotate, transform | Esquisse du vinyle : décalage (transform) et rotation animée (propriété rotate) sur le même élément, la rotation faisait tourner le décalage et le disque partait dans la mauvaise direction ; corrigé seul via la capture. Mettre le décalage sur un cadre et la rotation sur l'élément intérieur.
- 2026-11-19 | Platine | react, key, fournisseur, provider, remise à zéro | Pour vider les données d'un fournisseur au changement de compte, j'ai mis key={user.id} sur un composant qui enveloppait toute l'appli : tout (lecteur compris) se démontait dès que la connexion se résolvait, 6 tests ont échoué ; trouvée par les tests avant le commit. Pour remettre un état à zéro sans démonter les enfants, mémoriser l'id du compte dans un état et vider les données dans le fournisseur, sans key sur les enfants.

## Communication et consignes
- 2026-11-23 | platine | pédagogie, sujet en cours, passer à la suite | En lui expliquant le serveur point par point, je suis passé au point suivant sur une bonne réponse, sans qu'elle dise « c'est bon » : elle n'avait pas fini de comprendre ; attendre son feu vert explicite avant de changer de point.
- 2026-11-17 | platine | design, généralisation, changement global | Remarques sur quelques éléments précis (recherche, « Tout voir », 3 boutons) transformées en règle « tout carré sauf le rond par nature » appliquée à toute l'appli ; elle voulait tout arrondi sauf la musique. Montrer la liste concrète des éléments touchés (ou un écran test) avant un changement global.
- 2026-11-17 | platine | cohérence, comparaison | Demande « rester cohérent » entre deux blocs (stockage Téléchargements / Administration) : j'ai aligné la position mais pas le contenu (nombre de titres manquant) ; quand on harmonise deux éléments, les comparer ligne à ligne (place, taille, contenu, textes).
- 2026-11-19 | appli-recettes | rôle, livrable, demande, équipe ia-kit | Elle demandait un résumé à donner à son équipe ia-kit ; j'ai rédigé un cahier des charges complet, alors que c'est le rôle de /ia-kit:cahier-des-charges et du chef. Livrer exactement le format demandé, et laisser aux commandes et agents ia-kit le travail qui est le leur.

## Autre
- 2026-11-19 | mijote | processus, port, arrêt | Test du squelette serveur : j'ai envoyé « kill » à tout ce qui utilisait le port 3000 (dont deux processus inconnus présents avant mon test) sans regarder ce que c'était, et mon propre serveur est resté allumé. Arrêter seulement le processus que j'ai lancé (noter son numéro au lancement), et identifier tout processus inconnu avant d'y toucher.
- 2026-11-19 | Platine | serveur, mise à jour, dépendance | conseillé de lancer « npm i youtubei.js@latest » directement sur le serveur, ce qui aurait modifié package.json sur le serveur et bloqué le prochain git pull ; une mise à jour de bibliothèque se fait sur le Mac, se commite, puis se déploie
