const fs = require('fs');
const { DOMParser } = require('xmldom');

function parse(file) {
  console.log("Chemin du fichier : ", file);
  const xml = fs.readFileSync(file, 'utf-8');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'application/xml');
  return xmlDoc;
}

module.exports = { parse };
