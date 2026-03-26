import { Injectable } from '@angular/core'
import { Workbook } from 'exceljs'
import * as fs from 'file-saver'

@Injectable({
  providedIn: 'root',
})
export class ExportExcelService {
  constructor() {}

  exportExcelCapacitaciones(excelData: any) {
    //Title, Header & Data
    const title = excelData.title
    const header = excelData.headers
    const data = excelData.data
    const description = excelData.description

    //Create a workbook with a worksheet
    let workbook = new Workbook()
    let worksheet = workbook.addWorksheet('Registros')

    //Add Row and formatting
    worksheet.mergeCells('A1', 'K4')
    let titleRow = worksheet.getCell('A1')
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '484a4c' },
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'left' }

    // Date
    let d = new Date()
    let date =
      d.getDate().toString().padStart(2, '0') +
      '-' +
      (d.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      d.getFullYear()

    //Blank Row
    worksheet.addRow([])

    //Adding Header Row
    let headerRow = worksheet.addRow(header)
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '484a4c' },
        bgColor: { argb: '' },
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      let row = worksheet.addRow(d)

      // let sales = row.getCell(4);
      // sales.alignment = { vertical: 'middle', horizontal: 'right' }
      // let color = 'FF99FF99';
      // if (+sales.value < 0) {
      //   color = 'FF9999'
      // }

      // sales.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: color }
      // }
    })
    worksheet.getColumn(1).width = 50
    worksheet.getColumn(2).width = 10
    worksheet.getColumn(3).width = 10
    worksheet.getColumn(4).width = 40
    worksheet.getColumn(5).width = 40
    worksheet.getColumn(6).width = 15
    worksheet.getColumn(7).width = 50
    worksheet.getColumn(8).width = 15
    worksheet.getColumn(9).width = 15
    worksheet.getColumn(10).width = 10
    worksheet.getColumn(11).width = 100
    worksheet.addRow([])

    //Footer Row
    let footerRow = worksheet.addRow([description + ' ' + date])
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '97d700' },
    }

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:K${footerRow.number}`)

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      fs.saveAs(blob, title + '.xlsx')
    })
  }

  exportExcelLegajosCount(excelData: any) {
    //Title, Header & Data
    const title = excelData.title
    const header = excelData.headers
    const data = excelData.data
    const description = excelData.description

    //Create a workbook with a worksheet
    let workbook = new Workbook()
    let worksheet = workbook.addWorksheet('Registros')

    //Add Row and formatting
    worksheet.mergeCells('A1', 'K4')
    let titleRow = worksheet.getCell('A1')
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '484a4c' },
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'left' }

    // Date
    let d = new Date()
    let date =
      d.getDate().toString().padStart(2, '0') +
      '-' +
      (d.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      d.getFullYear()

    //Blank Row
    worksheet.addRow([])

    //Adding Header Row
    let headerRow = worksheet.addRow(header)
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '484a4c' },
        bgColor: { argb: '' },
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      let row = worksheet.addRow(d)

      let aligcell: any = { vertical: 'middle', horizontal: 'center' }
      let secc = row.getCell(7)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(8)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(9)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(10)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(11)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(12)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(13)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(14)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(15)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(16)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(17)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(18)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(19)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(20)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(21)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(22)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      // let sales = row.getCell(4);
      // sales.alignment = { vertical: 'middle', horizontal: 'right' }
      // let color = 'FF99FF99';
      // if (+sales.value < 0) {
      //   color = 'FF9999'
      // }

      // sales.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: color }
      // }
    })
    worksheet.getColumn(1).width = 50
    worksheet.getColumn(2).width = 10
    worksheet.getColumn(3).width = 10
    worksheet.getColumn(4).width = 50
    worksheet.getColumn(5).width = 50
    worksheet.getColumn(6).width = 20

    worksheet.getColumn(7).width = 10
    worksheet.getColumn(8).width = 10
    worksheet.getColumn(9).width = 10
    worksheet.getColumn(10).width = 10
    worksheet.getColumn(11).width = 10
    worksheet.getColumn(12).width = 10
    worksheet.getColumn(13).width = 10
    worksheet.getColumn(14).width = 10
    worksheet.getColumn(15).width = 10
    worksheet.getColumn(16).width = 10
    worksheet.getColumn(17).width = 10
    worksheet.getColumn(18).width = 10
    worksheet.getColumn(19).width = 10
    worksheet.getColumn(20).width = 10
    worksheet.getColumn(21).width = 10
    worksheet.getColumn(22).width = 10

    worksheet.getColumn(22).width = 10
    worksheet.getColumn(23).width = 15
    worksheet.getColumn(24).width = 80

    worksheet.addRow([])

    //Footer Row
    let footerRow = worksheet.addRow([description + ' ' + date])
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '97d700' },
    }

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:K${footerRow.number}`)
    let seccol = footerRow.number + 3
    let seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'LEYENDA'
    seccRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '484a4c' },
    }
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_01: Grados y títulos.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_02: Experiencia en docencia universitaria.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_03: Categoría docente.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_04: Régimen de dedicación.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_05: Experiencia profesional no docente.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_06: Dominio de computación.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_07: Dominio de idiomas.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_08: Docente investigador.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_09: Asesoría y jurado de tesis.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value =
      'SECC_10: Producción científica, lectiva y de investigación.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value =
      'SECC_11: Participación en congresos, seminarios, talleres u otros.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_12: Carga administrativa universitaria.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_13: Reconocimiento de otras universidades.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_14: Capacitaciones.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_15: Proyección Social.'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'SECC_16: Capacitaciones Internas.'
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      fs.saveAs(blob, title + '.xlsx')
    })
  }

  exportExcelConsolidado(excelData: any) {
    //Title, Header & Data
    const title = excelData.title
    const header = excelData.headers
    const data = excelData.data
    const description = excelData.description

    //Create a workbook with a worksheet
    let workbook = new Workbook()
    let worksheet = workbook.addWorksheet('Registros')

    //Add Row and formatting
    worksheet.mergeCells('A1', 'I4')
    let titleRow = worksheet.getCell('A1')
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '484a4c' },
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'left' }

    // Date
    let d = new Date()
    let date =
      d.getDate().toString().padStart(2, '0') +
      '-' +
      (d.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      d.getFullYear()

    //Blank Row
    worksheet.addRow([])

    //Adding Header Row
    let headerRow = worksheet.addRow(header)
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '484a4c' },
        bgColor: { argb: '' },
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      let row = worksheet.addRow(d)

      let aligcell: any = { vertical: 'middle', horizontal: 'center' }
      let secc = row.getCell(2)
      secc.alignment = aligcell
      secc.value = secc.value != null ? secc.value : '0'
      secc = row.getCell(5)
      secc.alignment = aligcell
      secc = row.getCell(6)
      secc.alignment = aligcell
      secc = row.getCell(7)
      secc.alignment = aligcell
      secc = row.getCell(8)
      secc.alignment = aligcell
      secc = row.getCell(9)
      secc.alignment = aligcell
    })
    worksheet.getColumn(1).width = 50
    worksheet.getColumn(2).width = 15
    worksheet.getColumn(3).width = 50
    worksheet.getColumn(4).width = 50
    worksheet.getColumn(5).width = 55
    worksheet.getColumn(6).width = 25
    worksheet.getColumn(7).width = 55
    worksheet.getColumn(8).width = 15
    worksheet.getColumn(9).width = 55

    worksheet.addRow([])

    //Footer Row
    let footerRow = worksheet.addRow([description + ' ' + date])
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '97d700' },
    }

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:K${footerRow.number}`)
    let seccol = footerRow.number + 3
    let seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'LEYENDA'
    seccRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '484a4c' },
    }
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'EDD: Evaluación de desempeño docente. Peso = 90%'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'CD: Capacitación docente. Peso = 5%'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value =
      'PC: Producción científica, lectiva y de investigación. Peso = 5%'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = 'PROMEDIO: .'
    seccol = seccol + 1
    seccRow = worksheet.getCell(`A${seccol}`)
    seccRow.value = '*Condición final (RENUEVA/RATIFICA/SÍ/NO)'

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      fs.saveAs(blob, title + '.xlsx')
    })
  }

  exportExcelUniversidades(excelData: any) {
    //Title, Header & Data
    const title = excelData.title
    const header = excelData.headers
    const data = excelData.data
    const description = excelData.description

    //Create a workbook with a worksheet
    let workbook = new Workbook()
    let worksheet = workbook.addWorksheet('Registros')

    //Add Row and formatting
    worksheet.mergeCells('A1', 'D4')
    let titleRow = worksheet.getCell('A1')
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '484a4c' },
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'left' }

    // Date
    let d = new Date()
    let date =
      d.getDate().toString().padStart(2, '0') +
      '-' +
      (d.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      d.getFullYear()

    //Blank Row
    worksheet.addRow([])

    //Adding Header Row
    let headerRow = worksheet.addRow(header)
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '484a4c' },
        bgColor: { argb: '' },
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      let row = worksheet.addRow(d)

      let aligcell: any = { vertical: 'middle', horizontal: 'center' }
      let secc = row.getCell(1)
      secc.alignment = aligcell
      secc.value = secc.value != null ? secc.value : '0'
      let secc1 = row.getCell(3)
      secc1.alignment = aligcell
    })
    worksheet.getColumn(1).width = 20
    worksheet.getColumn(2).width = 50
    worksheet.getColumn(3).width = 30
    worksheet.getColumn(4).width = 50

    worksheet.addRow([])

    //Footer Row
    let footerRow = worksheet.addRow([description + ' ' + date])
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '97d700' },
    }

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      fs.saveAs(blob, title + '.xlsx')
    })
  }

  exportExcelCapacInvest(excelData: any) {
    //Title, Header & Data
    const title = excelData.title
    const header = excelData.headers
    const data = excelData.data
    const description = excelData.description

    //Create a workbook with a worksheet
    let workbook = new Workbook()
    let worksheet = workbook.addWorksheet('Registros')

    //Add Row and formatting
    worksheet.mergeCells('A1', 'T4')
    let titleRow = worksheet.getCell('A1')
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '484a4c' },
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'left' }

    // Date
    let d = new Date()
    let date =
      d.getDate().toString().padStart(2, '0') +
      '-' +
      (d.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      d.getFullYear()

    //Blank Row
    worksheet.addRow([])

    //Adding Header Row
    let headerRow = worksheet.addRow(header)
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '484a4c' },
        bgColor: { argb: '' },
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      let row = worksheet.addRow(d)

      let aligcell: any = { vertical: 'middle', horizontal: 'center' }
      let secc = row.getCell(5)
      secc.alignment = aligcell
      secc = row.getCell(6)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(7)
      secc.alignment = aligcell
      secc = row.getCell(8)
      secc.alignment = aligcell
      secc = row.getCell(9)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(10)
      secc.alignment = aligcell
      secc = row.getCell(11)
      secc.alignment = aligcell
      secc = row.getCell(12)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(13)
      secc.alignment = aligcell
      secc = row.getCell(14)
      secc.alignment = aligcell
      secc = row.getCell(15)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(16)
      secc.alignment = aligcell
      secc = row.getCell(17)
      secc.alignment = aligcell
      secc = row.getCell(18)
      secc.alignment = aligcell
      secc.value = secc.value != null ? (secc.value > 0 ? 'SI' : 'NO') : 'NO'
      secc = row.getCell(19)
      secc.alignment = aligcell
      secc = row.getCell(20)
      secc.alignment = aligcell
    })
    worksheet.getColumn(1).width = 50
    worksheet.getColumn(2).width = 55
    worksheet.getColumn(3).width = 50
    worksheet.getColumn(4).width = 50
    worksheet.getColumn(5).width = 25
    worksheet.getColumn(6).width = 30
    worksheet.getColumn(7).width = 15
    worksheet.getColumn(8).width = 15
    worksheet.getColumn(9).width = 30
    worksheet.getColumn(10).width = 15
    worksheet.getColumn(11).width = 15
    worksheet.getColumn(12).width = 30
    worksheet.getColumn(13).width = 15
    worksheet.getColumn(14).width = 15
    worksheet.getColumn(15).width = 30
    worksheet.getColumn(16).width = 15
    worksheet.getColumn(17).width = 15
    worksheet.getColumn(18).width = 30
    worksheet.getColumn(19).width = 15
    worksheet.getColumn(20).width = 15

    worksheet.addRow([])

    //Footer Row
    let footerRow = worksheet.addRow([description + ' ' + date])
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '97d700' },
    }

    //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:K${footerRow.number}`);
    // let seccol = footerRow.number + 3
    // let seccRow = worksheet.getCell(`A${seccol}`);
    // seccRow.value = "LEYENDA"
    // seccRow.font = {
    //   name: 'Calibri',
    //   size: 16,
    //   underline: 'single',
    //   bold: true,
    //   color: { argb: '484a4c' }
    // }
    // seccol = seccol + 1; seccRow = worksheet.getCell(`A${seccol}`);
    // seccRow.value = "EDD: Evaluación de desempeño docente. Peso = 90%"
    // seccol = seccol + 1; seccRow = worksheet.getCell(`A${seccol}`);
    // seccRow.value = "CD: Capacitación docente. Peso = 5%"
    // seccol = seccol + 1; seccRow = worksheet.getCell(`A${seccol}`);
    // seccRow.value = "PC: Producción científica, lectiva y de investigación. Peso = 5%"
    // seccol = seccol + 1; seccRow = worksheet.getCell(`A${seccol}`);
    // seccRow.value = "PROMEDIO: ."
    // seccol = seccol + 1; seccRow = worksheet.getCell(`A${seccol}`);
    // seccRow.value = "¿ APRUEBA ? :: Si: Aprobó | No : No aprobó"
    // seccol = seccol + 1; seccRow = worksheet.getCell(`A${seccol}`);
    // seccRow.value = "RENUEVA/RETIFICA"

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      fs.saveAs(blob, title + '.xlsx')
    })
  }

  exportExcelConsolidadoConDatosValidadosOPorValidar(excelData: any) {
    console.log(excelData)

    const title = excelData.title
    const header = excelData.header
    const data = excelData.data
    const description = excelData.description
    let workbook = new Workbook()
    let worksheet = workbook.addWorksheet('Legajo')
    worksheet.mergeCells('A1', 'T4')
    let titleRow = worksheet.getCell('A1')
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '484a4c' },
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'left' }

    // Date
    let d = new Date()
    let date =
      d.getDate().toString().padStart(2, '0') +
      '-' +
      (d.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      d.getFullYear() +
      '_' +
      d.getTime()

    //Blank Row
    worksheet.addRow([])

    //Adding Header Row
    let headerRow = worksheet.addRow(header)
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '484a4c' },
        bgColor: { argb: '' },
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      }
    })

    worksheet.autoFilter = 'A6:AG6'

    data.forEach((d: any) => {
      let row = worksheet.addRow(d)
      let aligcell: any = { vertical: 'middle', horizontal: 'center' }
      let secc = row.getCell(5)
      secc.alignment = aligcell
      secc = row.getCell(6)
      secc.alignment = aligcell
      secc = row.getCell(7)
      secc.alignment = aligcell
      secc = row.getCell(8)
      secc.alignment = aligcell
      secc = row.getCell(9)
      secc.alignment = aligcell
      secc = row.getCell(10)
      secc.alignment = aligcell
      secc = row.getCell(11)
      secc.alignment = aligcell
      secc = row.getCell(12)
      secc.alignment = aligcell
      secc = row.getCell(13)
      secc.alignment = aligcell
      secc = row.getCell(14)
      secc.alignment = aligcell
      secc = row.getCell(15)
      secc.alignment = aligcell
      secc = row.getCell(16)
      secc.alignment = aligcell
      secc = row.getCell(17)
      secc.alignment = aligcell
      secc = row.getCell(18)
      secc.alignment = aligcell
      secc = row.getCell(19)
      secc.alignment = aligcell
      secc = row.getCell(20)
      secc.alignment = aligcell
      secc = row.getCell(21)
      secc.alignment = aligcell
      secc = row.getCell(22)
      secc.alignment = aligcell
      secc = row.getCell(23)
      secc.alignment = aligcell
      secc = row.getCell(24)
      secc.alignment = aligcell
      secc = row.getCell(25)
      secc.alignment = aligcell
      secc = row.getCell(26)
      secc.alignment = aligcell
      secc = row.getCell(27)
      secc.alignment = aligcell
      secc = row.getCell(28)
      secc.alignment = aligcell
      secc = row.getCell(29)
      secc.alignment = aligcell
      secc = row.getCell(30)
      secc.alignment = aligcell
      secc = row.getCell(31)
      secc.alignment = aligcell
      secc = row.getCell(32)
      secc.alignment = aligcell
    })

    /*EXPORTAR*/
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      fs.saveAs(blob, `${title}  ${date}` + '.xlsx')
    })
  }
}
