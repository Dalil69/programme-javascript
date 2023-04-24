class PrixTotalCalculator {
    constructor(prixTransport, poids, useTaxePortDuGenerale, useTaxePortPayeGenerale) {
      this.prixTransport = prixTransport;
      this.poids = poids;
      this.useTaxePortDuGenerale = useTaxePortDuGenerale;
      this.useTaxePortPayeGenerale = useTaxePortPayeGenerale;
    }
  
    getTaxePoids() {
      if (this.poids < 5) {
        return 0;
      } else if (this.poids < 10) {
        return 10;
      } else {
        return 20;
      }
    }
  
    getTaxePortDu(taxePortDu) {
      return this.useTaxePortDuGenerale ? 1.5 : taxePortDu;
    }
  
    getTaxePortPaye(taxePortPaye) {
      return this.useTaxePortPayeGenerale ? 2 : taxePortPaye;
    }
  
    calculerPrixTotal() {
      const taxePoids = this.getTaxePoids();
      const taxePortDu = this.getTaxePortDu(1.5);
      const taxePortPaye = this.getTaxePortPaye(2);
  
      const prixTotal = this.prixTransport + taxePoids + taxePortDu + taxePortPaye;
      return prixTotal;
    }
  }
  
  module.exports = PrixTotalCalculator;
  