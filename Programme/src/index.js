// Importation des classes et fonctions nécessaires
const fs = require('fs');
const parseXml = require('./src/xmlparser');
const TransportCalculator = require('./src/TransportCalculator');
const PrixTotalCalculator = require('./src/PrixTotalCalculator');

// Lecture du fichier XML contenant les tarifs de livraison
const tarifsXml = fs.readFileSync('./data/tarifsLivraison.xml', 'utf-8');

// Lecture du fichier XML contenant les localités
const localitesXml = fs.readFileSync('./data/localite.xml', 'utf-8');

// Lecture du fichier XML contenant les conditions de taxation
const conditionsTaxationXml = fs.readFileSync('./data/conditiontaxation.xml', 'utf-8');

// Parsing des fichiers XML
const tarifs = parseXml(tarifsXml);
const localites = parseXml(localitesXml);
const conditionsTaxation = parseXml(conditionsTaxationXml);

// Exemple d'utilisation des classes pour calculer le prix total d'un transport
const distance = 100; // distance en kilomètres
const poids = 10; // poids en tonnes

// Récupération des informations du client et de la localité
const clientXml = fs.readFileSync('./data/client.xml', 'utf-8');
const client = parseXml(clientXml).getElementsByTagName('ObjectClient')[0];
const localite = localites.getElementsByTagName('ObjectLocalite')[0];

// Récupération des informations de taxation
const idClient = parseInt(client.getElementsByTagName('idClient')[0].textContent);
const conditionTaxation = conditionsTaxation.getElementsByTagName('ObjectConditionTaxation')
  .find(obj => parseInt(obj.getElementsByTagName('idClient')[0]?.textContent) === idClient);

// Calcul du prix du transport
const transportCalculator = new TransportCalculator(tarifs, localite, conditionTaxation);
const prixTransport = transportCalculator.calculerPrixTransport(distance);

// Calcul du prix total
const useTaxePortDuGenerale = conditionTaxation.getElementsByTagName('useTaxePortDuGenerale')[0]?.textContent === 'true';
const useTaxePortPayeGenerale = conditionTaxation.getElementsByTagName('useTaxePortPayeGenerale')[0]?.textContent === 'true';
const prixTotalCalculator = new PrixTotalCalculator(prixTransport, poids, useTaxePortDuGenerale, useTaxePortPayeGenerale);
const prixTotal = prixTotalCalculator.calculerPrixTotal();

console.log(`Le prix du transport est de : ${prixTransport.toFixed(2)}€`);
console.log(`Le prix total est de : ${prixTotal.toFixed(2)}€`);
