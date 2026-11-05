# TP 16 - Projet React avec GraphQL et Apollo Client

## 1. Outils utilises

Node 22 et npm 10 ont servi au front, Java 21 et Maven 3.9.9 au service. Les
versions relevees sur la machine sont affichees ci-dessous.

![Versions des outils](docs/captures/00-versions-outils.png)

---

## 2. Compilation du service GraphQL

Maven nettoie le dossier de sortie, compile les dix-sept sources du service avec
Java 21 et fabrique un jar executable avec Tomcat embarque. Le journal se termine
par la confirmation de build reussi.

![Build Maven du service](docs/captures/20-build-backend.png)

---

## 3. Demarrage du service

Le jar demarre Tomcat sur le port 8090, ouvre la base H2 en memoire, publie le
point d acces GraphQL et amorce cinq comptes avec leurs transactions.

![Demarrage du service](docs/captures/21-demarrage-backend.png)

---

## 4. Chargement du schema

Au demarrage, le service lit le fichier de schema et l inspecte pour construire
la documentation GraphiQL. Les types, les requetes et les mutations sont tous
reconnus.

![Schema GraphQL charge](docs/captures/22-schema-graphql-charge.png)

---

## 5. Dependances et build de l interface

L installation des dependances du front se termine sans erreur, avec les paquets
Apollo, React et Tailwind deja presents. Le build de production compile les
modules et sort les fichiers dans le dossier dist.

![Dependances du front](docs/captures/24-dependances-frontend.png)

![Build du front](docs/captures/23-build-frontend.png)

---

## 6. Demarrage de l interface

Le serveur de developpement Vite se lance sur le port 5173 et sert l application
React avec rechargement a chaud.

![Demarrage du front](docs/captures/25-demarrage-frontend.png)

---

## 7. Tableau de bord

La page d accueil affiche un bandeau de presentation, quatre cartes de synthese
calculees par le service et la repartition des soldes par type de compte. Les
chiffres affiches proviennent tous de requetes GraphQL, aucun total n est calcule
cote navigateur.

![Tableau de bord](docs/captures/01-tableau-de-bord.png)

L entete rappelle le nombre de comptes et le bas de page montre les indicateurs
de soldes avec le total, la moyenne, le maximum et le minimum.

![Entete et indicateurs](docs/captures/03-entete-et-indicateurs.png)

---

## 8. Liste des comptes

La vue generale regroupe la liste des comptes, les formulaires a droite et
l historique des mouvements. Chaque ligne affiche le titulaire, le type, la date
de creation et le solde en dirhams.

![Vue generale](docs/captures/02-vue-generale.png)

La recherche lance une requete dediee des que deux lettres sont saisies. Avec le
fragment ah, seuls Ahmed Benidar et Sanae Ait Yahia remontent.

![Recherche par titulaire](docs/captures/09-recherche-titulaire.png)

Le filtre par type envoie la valeur choisie dans le composant. En mode epargne,
la liste ne garde que les comptes de ce type.

![Filtre par type](docs/captures/14-filtre-type-epargne.png)

---

## 9. Creation d un compte

Le formulaire demande le titulaire, le solde initial et le type. Apres validation,
un bandeau de confirmation indique le numero attribue et la liste se rafraichit
automatiquement.

![Formulaire de compte rempli](docs/captures/04-formulaire-compte-rempli.png)

![Compte cree](docs/captures/05-compte-cree.png)

---

## 10. Fiche d un compte

Un clic sur une ligne ouvre la fiche du compte a droite, avec le solde courant,
le type, la date de creation et le nombre de mouvements. Le bouton de fermeture
de la fiche libere la selection.

![Fiche du compte](docs/captures/06-fiche-compte.png)

---

## 11. Historique des transactions

L historique suit le compte selectionne. Il affiche les depots en vert et les
retraits en rouge, avec la date, le montant et le solde resultant.

![Historique du compte](docs/captures/07-historique-transactions-compte.png)

Sans compte selectionne, la meme zone bascule sur la liste complete des
mouvements de la banque.

![Toutes les transactions](docs/captures/08-toutes-les-transactions.png)

---

## 12. Depots et retraits

Le formulaire de transaction choisit le compte, la nature du mouvement et le
montant. Un depot valide met a jour le solde et affiche le nouveau montant dans
le bandeau de confirmation.

![Depot enregistre](docs/captures/10-transaction-depot.png)

Un retrait superieur au solde disponible est refuse par le service. Le message
d erreur renvoye par GraphQL est remonte tel quel dans l interface, au lieu d un
faux message de succes.

![Retrait refuse](docs/captures/11-transaction-retrait-refuse.png)

---

## 13. Suppression d un compte

La suppression demande une confirmation explicite avec le numero du compte. Une
fois validee, le compte et ses mouvements disparaissent de la liste.

![Confirmation de suppression](docs/captures/12-confirmation-suppression.png)

![Compte supprime](docs/captures/13-compte-supprime.png)

---

## 14. Verification dans GraphiQL

GraphiQL est active sur le service et permet de rejouer chaque operation a la
main. La requete de tableau de bord renvoie les compteurs et la repartition par
type, accompagnee de la requete de filtre epargne.

![Tableau de bord dans GraphiQL](docs/captures/15-graphiql-tableau-bord.png)

La mutation de creation de compte renvoie l identifiant attribue et le compte
complet avec sa date au format jour mois annee.

![Creation de compte dans GraphiQL](docs/captures/16-graphiql-mutation-compte.png)

Les statistiques de soldes et de transactions se lisent dans la meme requete que
la recherche par titulaire.

![Statistiques dans GraphiQL](docs/captures/17-graphiql-statistiques.png)

La mutation de suppression appliquee au compte cree juste avant renvoie vrai.

![Suppression dans GraphiQL](docs/captures/18-graphiql-mutation-suppression.png)

Enfin, un retrait volontairement trop gros est rejete par le service avec un
message lisible et une classification de mauvaise requete, sans arret du
service.

![Erreur metier dans GraphiQL](docs/captures/19-graphiql-erreur-metier.png)

---

