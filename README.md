# Lead magnet · La méthode Domaris

Page sur laquelle arrivent les personnes qui ont commenté « méthode » sous le post LinkedIn.
Elles saisissent prénom, nom et téléphone, puis la méthode complète s'affiche (et le PDF est téléchargeable).
Chaque inscription est ajoutée dans un Google Sheet.

## Fichiers

- `index.html` : le site (une seule page, sans dépendance)
- `assets/` : logos Domaris, favicon, PDF de la méthode
- `google-apps-script.gs` : le script à coller dans le Google Sheet

## Brancher le Google Sheet (5 minutes, une seule fois)

1. Créer un Google Sheet, par exemple « Leads · Méthode Domaris ».
2. Menu **Extensions > Apps Script**. Effacer le code présent et coller le contenu de `google-apps-script.gs`. Enregistrer.
3. (Optionnel) Choisir la fonction `testInsert` puis **Exécuter** : autoriser l'accès. Un onglet « Leads » apparaît avec une ligne de test.
4. **Déployer > Nouveau déploiement** > type **Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui peut accéder : **Tout le monde**
5. Copier l'URL de l'application Web (elle se termine par `/exec`).
6. Dans `index.html`, coller cette URL dans `const SHEET_ENDPOINT = "";`, puis republier.

Colonnes enregistrées : Date, Prénom, Nom, Téléphone, Consentement rappel, Source (UTM), Page, Navigateur, Statut (« À rappeler »).

## Suivi des sources

Ajouter des paramètres UTM au lien envoyé, par exemple :
`…/?utm_source=linkedin&utm_campaign=post-methode`. Ils apparaissent dans la colonne Source.

## Bon à savoir

- Le formulaire inclut une case de consentement explicite au rappel téléphonique (régime de consentement préalable en vigueur depuis le 11 août 2026).
- Une fois débloquée, la méthode reste accessible sur le même navigateur (mémorisée localement).
- Le blocage est côté navigateur : suffisant pour un lead magnet, mais le contenu n'est pas « secret ».
