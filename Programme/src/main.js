const readline = require('readline');
const fs = require('fs');
const path = require('path');
const xmlParser = require('./xmlparser');
const TransportCalculator = require('./TransportCalculator');
const PrixTotalCalculator = require('./prixTotalCalculator');


// Lecture du fichier XML contenant les tarifs de livraison
const tarifsXml = fs.readFileSync('../data/tarif.xml', 'utf-8');

// Lecture du fichier XML contenant les localités
const localitesXml = fs.readFileSync('../data/localite.xml', 'utf-8');

// Lecture du fichier XML contenant les conditions de taxation
const conditionsTaxationXml = fs.readFileSync('../data/conditiontaxation.xml', 'utf-8');

// Parsing des fichiers XML
const tarifs = xmlParser.parse(tarifsXml);
const localites = xmlParser.parse(localitesXml);
const conditionsTaxation = xmlParser.parse(conditionsTaxationXml);

// Création d'une interface de saisie utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour afficher le prix total d'un transport en fonction des saisies utilisateur
function afficherPrixTotal() {
  // Demande de saisie de la ville de départ
  rl.question('Ville de départ : ', (villeDepart) => {
    // Demande de saisie de la ville d'arrivée
    rl.question('Ville d\'arrivée : ', (villeArrivee) => {
      // Récupération des informations de la localité de départ
      const localiteDepart = localites.getElementsByTagName('ObjectLocalite')
        .find(obj => obj.getElementsByTagName('ville')[0].textContent === villeDepart);
      if (!localiteDepart) {
        console.log(`Localité de départ '${villeDepart}' introuvable.`);
        rl.close();
        return;
      }

      // Récupération des informations de la localité d'arrivée
      let localiteArrivee = localites.getElementsByTagName('ObjectLocalite')
        .find(obj => obj.getElementsByTagName('ville')[0].textContent === villeArrivee);
      if (!localiteArrivee) {
        console.log(`Localité d'arrivée '${villeArrivee}' introuvable, recherche de la localité précédente...`);
        for (let i = 1; i < localites.getElementsByTagName('ObjectLocalite').length; i++) {
          const ville = localites.getElementsByTagName('ObjectLocalite')[i].getElementsByTagName('ville')[0].textContent;
          if (ville === villeArrivee) {
            villeArrivee = localites.getElementsByTagName('ObjectLocalite')[i - 1].getElementsByTagName('ville')[0].textContent;
            localiteArrivee = localites.getElementsByTagName('ObjectLocalite')[i - 1];
            console.log(`Localité d'arrivée trouvée : ${villeArrivee}`);
            break;
          }
        }
        if (!localiteArrivee) {
          console.log(`Localité d'arrivée '${villeArrivee}' introuvable.`);
          rl.close();
          return;
        }
      }

      // Demande de saisie du poids du colis
      rl.question('Poids du colis (en tonnes) : ', (poids) => {
        // Vérification de la validité de la saisie
        if (isNaN(parseFloat(poids)) || parseFloat(poids) <= 0) {
          console.log('Le poids doit être un nombre strictement positif');
        }
      });
    });
  });
}

// Lancement de la fonction afficherPrixTotal
afficherPrixTotal();
         
