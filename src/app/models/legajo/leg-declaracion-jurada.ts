import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegDeclaracionJurada {
  nLegDjcodigo: number;
  dLegDjfecha: Date;
  cLegDjanexo2: any;
  cFileDjanexo2: any;
  cLegDjanexo6: any;
  cFileDjanexo6: any;
  cLegDjanexo7: any;
  cFileDjanexo7: any;
  bLegDjestado: boolean | null;
  nLegDjdatCodigo: number;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  vDatosGenerales: LegDatosGenerales;

  cLegDjanexo1: any;
  cFileDjanexo1: any;
  cLegDjanexo2_2: any;
  cFileDjanexo2_2: any;
  cLegDjanexo3: any;
  cFileDjanexo3: any;
  cLegDjanexo4: any;
  cFileDjanexo4: any;
  cLegDjanexo5: any;
  cFileDjanexo5: any;
  cLegDjanexo6_2: any;
  cFileDjanexo6_2: any;

  cLegDjDNI: any;
  cFileDjDNI: any;
  cLegDjDNI_DH: any;
  cFileDjDNI_DH: any;
  cLegDjFotoCarnet: any;
  cFileDjFotoCarnet: any;
  cLegDjNumCta: any;
  cFileDjNumCta: any;
  cLegDjConsJubilacion: any;
  cFileDjConsJubilacion: any;
  cLegDjConsAfiliacionOnpAfp: any;
  cFileDjConsAfiliacionOnpAfp: any;
}
