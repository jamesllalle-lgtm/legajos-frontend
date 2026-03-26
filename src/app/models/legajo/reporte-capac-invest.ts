export interface ReporteCapacInvest {
    nLegDatCodigo: number;
    cPerCodigo: string;
    cPerApellido: string;
    cPerNombre: string;
    cCargo: string;
    cArea: string;
    cPerEmail: string;
    cPerTelefono: string;
    cPerTipoDoc: string;

    legInvestigador : number;
    dFechaRegistroInv : string;
    dFechaModificaInv : string;

    legTesisAseJur : number;
    dFechaRegistroTes : string;
    dFechaModificaTes : string;

    legProduccionCiencia : number;
    dFechaRegistroProd : string;
    dFechaModificaProd : string;

    legParticipacionCongSem : number;
    dFechaRegistroCongSem : string;
    dFechaModificaCongSem : string;

    legCapacitaciones : number;
    dFechaRegistroCap : string;
    dFechaModificaCap : string;

    legCapacitacionInterna : number;
    dFechaRegistroCapInt : string;
    dFechaModificaCapInt : string;
  }
  