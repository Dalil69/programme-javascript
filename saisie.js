const readline = require('readline');
const fs = require('fs');
const parseXml = require('./xmlparser');

const TransportCalculator = require('./TransportCalculator');
const PrixTotalCalculator = require('./prixTotalCalculator');

// Lecture du fichier XML contenant les tarifs de livraison
const tarifsXml = fs.readFileSync('./data/tarif.xml', 'utf-8');

// Lecture du fichier XML contenant les localités
const localitesXml = fs.readFileSync('./data/localite.xml', 'utf-8');

// Lecture du fichier XML contenant les conditions de taxation
const conditionsTaxationXml = fs.readFileSync('./data/conditiontaxation.xml', 'utf-8');

// Parsing des fichiers XML
const tarifs = parseXml(tarifsXml);
const localites = parseXml(localitesXml);
const conditionsTaxation = parseXml(conditionsTaxationXml);

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
                rl.close();
                return;
              }
          
              // Demande de saisie de l'identifiant client
              rl.question('Identifiant client : ', (idClient) => {
                // Vérification de la validité de la saisie
                if (isNaN(parseInt(idClient)) || parseInt(idClient) <= 0) {
                  console.log('L\'identifiant client doit être un entier strictement positif');
                  rl.close();
                  return;
                }
          
                // Recherche des informations de taxation du client
                const client = clients.find(obj => parseInt(obj.getElementsByTagName('id')[0].textContent) === parseInt(idClient));
                if (!client) {
                  console.log(`Client avec identifiant '${idClient}' introuvable.`);
                  rl.close();
                  return;
                }
                const useTaxePortDuGenerale = client.getElementsByTagName('useTaxePortDuGenerale')[0].textContent === 'true';
                const useTaxePortPayeGenerale = client.getElementsByTagName('useTaxePortPayeGenerale')[0].textContent === 'true';
          
                // Calcul du prix du transport
                const transportCalculator = new TransportCalculator(tarifs, localites, conditionsTaxation);
                const distance = transportCalculator.calculerDistance(localiteDepart, localiteArrivee);
                const prixTransport = transportCalculator.calculerPrixTransport(distance, poids);
          
                // Calcul du prix total
                const prixTotalCalculator = new PrixTotalCalculator(prixTransport, poids, useTaxePortDuGenerale, useTaxePortPayeGenerale);
                const prixTotal = prixTotalCalculator.calculerPrixTotal();
          
                console.log(`Prix transport = ${prixTransport.toFixed(2)}€, prix total = ${prixTotal.toFixed(2)}€`);
                rl.close();
              });
            });
          });
        });
        }
        
        // Appel de la fonction pour afficher le prix total
        afficherPrixTotal();
          
