const fs = require('fs');
const parseXml = require('./src/xmlparser');

const TransportCalculator = require('./src/TransportCalculator');
const PrixTotalCalculator = require('./src/PrixTotalCalculator');

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

// Récupération des informations des clients
const clientsXml = fs.readFileSync('./data/client.xml', 'utf-8');
const clients = parseXml(clientsXml).getElementsByTagName('ObjectClient');

// Exemple d'utilisation des classes pour calculer le prix total d'un transport
for (let i = 0; i < clients.length; i++) {
  const client = clients[i];

  // Récupération des informations de la localité du client
  const ville = client.getElementsByTagName('ville')[0].textContent;
  const localite = localites.getElementsByTagName('ObjectLocalite')
    .find(obj => obj.getElementsByTagName('ville')[0].textContent === ville);

  // Récupération des informations de taxation du client
  const idClient = parseInt(client.getElementsByTagName('idClient')[0].textContent);
  const conditionTaxation = conditionsTaxation.getElementsByTagName('ObjectConditionTaxation')
    .find(obj => parseInt(obj.getElementsByTagName('idClient')[0].textContent) === idClient);

  // Récupération des informations de transport du client
  const distance = parseFloat(client.getElementsByTagName('distance')[0].textContent); // distance en kilomètres
  const poids = parseFloat(client.getElementsByTagName('poids')[0]?.textContent) || 1; // poids en tonnes, valeur par défaut 1 tonne

  // Calcul du prix du transport
  const transportCalculator = new TransportCalculator(tarifs, localite, conditionTaxation);
  const prixTransport = transportCalculator.calculerPrixTransport(distance, poids);

  // Calcul du prix total
  const useTaxePortDuGenerale = conditionTaxation.getElementsByTagName('useTaxePortDuGenerale')[0]?.textContent === 'true';
  const useTaxePortPayeGenerale = conditionTaxation.getElementsByTagName('useTaxePortPayeGenerale')[0]?.textContent === 'true';
  const prixTotalCalculator = new PrixTotalCalculator(prixTransport, poids, useTaxePortDuGenerale, useTaxePortPayeGenerale);
  const prixTotal = prixTotalCalculator.calculerPrixTotal();

  console.log(`Client ${client.getAttribute('hashcode')} : prix transport = ${prixTransport.toFixed(2)}€, prix total = ${prixTotal.toFixed(2)}€`);
}
