class TransportCalculator {
  constructor(localitesXml, conditionsTaxationXml) {
    this.localites = this.parseLocalites(localitesXml);
    this.conditionsTaxation = this.parseConditionsTaxation(conditionsTaxationXml);
  }

  parseLocalites(xmlDoc) {
    const localites = {};
    const localitesXml = xmlDoc.getElementsByTagName('ObjectLocalite');
    for (let i = 0; i < localitesXml.length; i++) {
      const localite = localitesXml[i];
      const ville = localite.getElementsByTagName('ville')[0].textContent;
      const zone = localite.getElementsByTagName('zone')[0]?.textContent;
      localites[ville] = zone ? parseInt(zone) : null;
    }
    return localites;
  }

  parseConditionsTaxation(xmlDoc) {
    const conditionsTaxation = {};
    const conditionsTaxationXml = xmlDoc.getElementsByTagName('ObjectConditionTaxation');
    for (let i = 0; i < conditionsTaxationXml.length; i++) {
      const conditionTaxation = conditionsTaxationXml[i];
      const idClient = conditionTaxation.getElementsByTagName('idClient')[0]?.textContent;
      const taxePortDu = parseFloat(conditionTaxation.getElementsByTagName('taxePortDu')[0].textContent);
      const taxePortPaye = parseFloat(conditionTaxation.getElementsByTagName('taxePortPaye')[0].textContent);
      const useTaxePortDuGenerale = conditionTaxation.getElementsByTagName('useTaxePortDuGenerale')[0]?.textContent === 'true';
      const useTaxePortPayeGenerale = conditionTaxation.getElementsByTagName('useTaxePortPayeGenerale')[0]?.textContent === 'true';
      conditionsTaxation[idClient] = {
        taxePortDu,
        taxePortPaye,
        useTaxePortDuGenerale,
        useTaxePortPayeGenerale
      };
    }
    return conditionsTaxation;
  }

  getZone(ville) {
    return this.localites[ville];
  }

  getTaxePortDu(conditionTaxation, poids) {
    return conditionTaxation.useTaxePortDuGenerale ? this.conditionsTaxation['generale'].taxePortDu : conditionTaxation.taxePortDu;
  }

  getTaxePortPaye(conditionTaxation, poids) {
    return conditionTaxation.useTaxePortPayeGenerale ? this.conditionsTaxation['generale'].taxePortPaye : conditionTaxation.taxePortPaye;
  }
  calculerPrixTransport(distance, ville, poids) {
    const villeDepart = this.villeDepart;
    const villeArrivee = this.villeArrivee || ville;
    let zoneDepart = this.getZone(villeDepart);
    let zoneArrivee = this.getZone(villeArrivee);
    let distanceZone = 0;
    let found = false;

    // Si la zone de la ville d'arrivée n'est pas définie, chercher la zone de la ville précédente
    if (zoneArrivee === null) {
      const localitesXml = this.localitesXml.getElementsByTagName('ObjectLocalite');
      for (let i = 0; i < localitesXml.length; i++) {
        const currentVille = localitesXml[i].getElementsByTagName('ville')[0].textContent;
        if (currentVille === villeArrivee) {
          villeArrivee = localitesXml[i - 1].getElementsByTagName('ville')[0].textContent;
          zoneArrivee = this.getZone(villeArrivee);
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error(`Impossible de trouver la ville de destination : ${villeArrivee}`);
      }
    }

    distanceZone = Math.abs(zoneArrivee - zoneDepart) * 100;
    const distanceTotale = distance + distanceZone;
    const conditionTaxation = this.conditionsTaxation[poids];
    const taxePortDu = this.getTaxePortDu(conditionTaxation, poids);
    const taxePortPaye = this.getTaxePortPaye(conditionTaxation, poids);
    const prixKm = 0.15;
    const prixTransport = distanceTotale * prixKm + taxePortDu + taxePortPaye;
    return prixTransport;
  }
}