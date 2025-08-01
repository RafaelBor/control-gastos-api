import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces"
import { Formatter } from "src/common/utils/formatter";

const logo: Content = {
    image: 'src/assets/logoApp.png',
    width: 100,
    alignment: "center"
}

const expenses = [
    { id: 1, categoria: 'Alimentación', cantidad: 5, porcentaje: '20%', total: 500 },
    { id: 2, categoria: 'Transporte', cantidad: 3, porcentaje: '15%', total: 300 },
    { id: 3, categoria: 'Entretenimiento', cantidad: 2, porcentaje: '10%', total: 200 },
    { id: 4, categoria: 'Salud', cantidad: 1, porcentaje: '5%', total: 100 },
    { id: 5, categoria: 'Educación', cantidad: 2, porcentaje: '10%', total: 200 },
    { id: 6, categoria: 'Vivienda', cantidad: 4, porcentaje: '18%', total: 450 },
    { id: 7, categoria: 'Servicios', cantidad: 3, porcentaje: '12%', total: 250 },
    { id: 8, categoria: 'Ropa', cantidad: 1, porcentaje: '5%', total: 100 },
    { id: 9, categoria: 'Ahorro', cantidad: 2, porcentaje: '10%', total: 200 },
    { id: 10, categoria: 'Otros', cantidad: 2, porcentaje: '5%', total: 100 }
  ];

const styles: StyleDictionary = {
    h1: {
        fontSize: 20,
        bold: true,
        margin: [0, 5],
        alignment: "center",
        color: '#8939da'
    },
    first_total: {
        marginTop: 5,
        fontSize: 12,
    },
    data_totals: {
        fontSize: 12,
        marginTop: 3
    },
    month_name: {
        fontSize: 18,
        marginTop: 20,
        alignment: 'center',
        bold: true,
        color: '#8939da'
    }
}

export const report = (data: any): TDocumentDefinitions => {

    return {
        styles: styles,
        header: {
            text: 'Reporte De Gastos',
            alignment: 'right',
            margin: [10, 10],
            color: '#8939da'
        },
        content: [
            logo,
            {
                text: 'Reporte:',
                alignment: 'center',
                fontSize: 18,
                bold: true
            },
            {
                // text: 'Enero 2025 - Febrero 2025',
                text: `${data.monthStart} ${data.yearStart} - ${data.monthEnd} ${data.yearEnd}`,
                style: 'h1'
            },

            //totales reports
            {
                marginTop: 5,
                alignment: 'left', // Asegura que todo en esta columna esté alineado a la derecha
                table: {
                    // widths: ['*', 'auto'], // Empuja la tabla hacia la derecha
                    body: [
                        [{text: 'Sueldo actual:', alignment: 'left', fontSize: 14},  
                            {
                                text: Formatter.currency(25000),
                                bold: true,
                                alignment: 'right',
                                color: '#8939da',
                                fontSize: 14
                            } 
                        ],
                        [{text: 'Sueldo Media:', alignment: 'left' , fontSize: 14},  
                            {
                                text: Formatter.currency(data.salary_media),
                                bold: true,
                                alignment: 'right',
                                color: '#8939da',
                                fontSize: 14
                            } 
                        ],
                        [{text: 'Total ahorros:', alignment: 'left' , fontSize: 14},  
                            {
                                text: Formatter.currency(data.total_savings),
                                bold: true,
                                alignment: 'right',
                                color: '#8939da',
                                fontSize: 14
                            } 
                        ],
                        [{text: 'Total gastos:', alignment: 'left', fontSize: 14},  
                            {
                                text: Formatter.currency(data.total_expenses),
                                bold: true,
                                alignment: 'right',
                                color: '#8939da',
                                fontSize: 14
                            } 
                        ],
                   
                    ]
                },
                layout: 'noBorders', // Elimina los bordes de la tabla
                // margin: [95, 15, 0, 0] // Ajuste fino: prueba aumentando este valor
            },
        //    {
        //     text: 'Sueldo actual: $25,000',
        //     style: 'first_total',
        //    },
        //    {
        //     text: 'Sueldo media: $23,000',
        //     style: 'data_totals',
        //    },
        //    {
        //     text: 'Ahorros: $35,000',
        //     style: 'data_totals',
        //    },
        //    {
        //     text: 'Gasto total: $40,000',
        //     style: 'data_totals',
        //    },

        ...data.reportData.flatMap((report) => [
            {
                columns: [
                    {
                        stack: [
                            { text: `${report.month} - ${report.year}`, style: 'month_name', alignment: 'right' },
                        ],
                        width: '55%',
                        alignment: 'center',
                        marginTop: 15
                    },
                    {
                        width: '45%',
                        alignment: 'right', // Asegura que todo en esta columna esté alineado a la derecha
                        table: {
                            widths: ['*', 'auto'], // Empuja la tabla hacia la derecha
                            body: [
                                [{text: 'Sueldo:', alignment: 'center'},  
                                    {
                                        text: Formatter.currency(report.salary),
                                        bold: true,
                                        alignment: 'right',
                                        color: '#8939da'
                                    } 
                                ],
                                [{text: 'Gastos:', alignment: 'center'}, 
                                    {
                                        text: Formatter.currency(report.total_expenses),
                                        bold: true,
                                        alignment: 'right',
                                        color: '#8939da'
                                    }
                                ],
                                [{text: 'Ahorro:', alignment: 'center'}, 
                                    {
                                        text: Formatter.currency(report.total_savings),
                                        bold: true,
                                        alignment: 'right',
                                        color: '#8939da'
                                    }
                                ],
                            ]
                        },
                        layout: 'noBorders', // Elimina los bordes de la tabla
                        margin: [95, 15, 0, 0] // Ajuste fino: prueba aumentando este valor
                    }
                ]
            },
              {
                margin: [0, 5],
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#b08fcf' : null;
                    }
                },
                table: {
                    widths: [50, '*', 'auto', 'auto', 'auto'],
                    headerRows: 1,
                    body: [
                        [
                            {text: 'ID', alignment: 'center', fillColor: '#8939da', bold: true}, 
                            {text: 'Categoria', fillColor: '#8939da', bold: true},
                            {text: 'Cantidad', fillColor: '#8939da', bold: true}, 
                            {text: 'Porcentaje', fillColor: '#8939da', bold: true}, 
                            {text: 'Total', fillColor: '#8939da', bold: true},  
                    
                        ],
                        ...report.expenses.map((expense, index) => [
                            {text: index, alignment: 'center'},
                            expense.categoria,
                            expense.cantidad.toString(),
                            expense.porcentaje,
                            {
                                text: Formatter.currency(expense.total),
                                bold: true,
                                alignment: 'right',
                               
                            } 
                          ])
                    ],
                  
                }
              },
        ]),
           

        //   {
        //     columns: [
        //         {
        //             stack: [
        //                 { text: 'Febrero - 2025', style: 'month_name', alignment: 'right' },
        //             ],
        //             width: '55%',
        //             alignment: 'center',
        //             marginTop: 15
        //         },
        //         {
        //             width: '45%',
        //             alignment: 'right', // Asegura que todo en esta columna esté alineado a la derecha
        //             table: {
        //                 widths: ['*', 'auto'], // Empuja la tabla hacia la derecha
        //                 body: [
        //                     [{text: 'Sueldo:', alignment: 'center'},  
        //                         {
        //                             text: Formatter.currency(25000),
        //                             bold: true,
        //                             alignment: 'right',
        //                             color: '#8939da'
        //                         } 
        //                     ],
        //                     [{text: 'Gastos:', alignment: 'center'}, '15.000'],
        //                     [{text: 'Ahorro:', alignment: 'center'}, '10.000'],
        //                 ]
        //             },
        //             layout: 'noBorders', // Elimina los bordes de la tabla
        //             margin: [95, 15, 0, 0] // Ajuste fino: prueba aumentando este valor
        //         }
        //     ]
        // },
        //   {
        //     margin: [0, 5],
        //     layout: {
		// 		fillColor: function (rowIndex, node, columnIndex) {
		// 			return (rowIndex % 2 === 0) ? '#b08fcf' : null;
		// 		}
		// 	},
        //     table: {
        //         widths: [50, '*', 'auto', 'auto', 'auto'],
        //         headerRows: 1,
        //         body: [
        //             [
        //                 {text: 'ID', alignment: 'center', fillColor: '#8939da', bold: true}, 
        //                 {text: 'Categoria', fillColor: '#8939da', bold: true},
        //                 {text: 'Cantidad', fillColor: '#8939da', bold: true}, 
        //                 {text: 'Porcentaje', fillColor: '#8939da', bold: true}, 
        //                 {text: 'Total', fillColor: '#8939da', bold: true},  
                
        //             ],
        //             ...expenses.map(expense => [
        //                 {text: expense.id.toString(), alignment: 'center'},
        //                 expense.categoria,
        //                 expense.cantidad.toString(),
        //                 expense.porcentaje,
        //                 {
        //                     text: Formatter.currency(expense.total),
        //                     bold: true,
        //                     alignment: 'right',
                           
        //                 } 
        //               ])
        //         ],
              
        //     }
        //   },
        //   {
        //     columns: [
        //         {
        //             stack: [
        //                 { text: 'Marzo - 2025', style: 'month_name', alignment: 'right' },
        //             ],
        //             width: '55%',
        //             alignment: 'center',
        //             marginTop: 15
        //         },
        //         {
        //             width: '45%',
        //             alignment: 'right', // Asegura que todo en esta columna esté alineado a la derecha
        //             table: {
        //                 widths: ['*', 'auto'], // Empuja la tabla hacia la derecha
        //                 body: [
        //                     [{text: 'Sueldo:', alignment: 'center'},  
        //                         {
        //                             text: Formatter.currency(25000),
        //                             bold: true,
        //                             alignment: 'right',
        //                             color: '#8939da'
        //                         } 
        //                     ],
        //                     [{text: 'Gastos:', alignment: 'center'}, '15.000'],
        //                     [{text: 'Ahorro:', alignment: 'center'}, '10.000'],
        //                 ]
        //             },
        //             layout: 'noBorders', // Elimina los bordes de la tabla
        //             margin: [95, 15, 0, 0] // Ajuste fino: prueba aumentando este valor
        //         }
        //     ]
        // },
        //   {
        //     margin: [0, 5],
        //     layout: {
		// 		fillColor: function (rowIndex, node, columnIndex) {
		// 			return (rowIndex % 2 === 0) ? '#b08fcf' : null;
		// 		}
		// 	},
        //     table: {
        //         widths: [50, '*', 'auto', 'auto', 'auto'],
        //         headerRows: 1,
        //         body: [
        //             [
        //                 {text: 'ID', alignment: 'center', fillColor: '#8939da', bold: true}, 
        //                 {text: 'Categoria', fillColor: '#8939da', bold: true},
        //                 {text: 'Cantidad', fillColor: '#8939da', bold: true}, 
        //                 {text: 'Porcentaje', fillColor: '#8939da', bold: true}, 
        //                 {text: 'Total', fillColor: '#8939da', bold: true},  
                
        //             ],
        //             ...expenses.map(expense => [
        //                 {text: expense.id.toString(), alignment: 'center'},
        //                 expense.categoria,
        //                 expense.cantidad.toString(),
        //                 expense.porcentaje,
        //                 {
        //                     text: Formatter.currency(expense.total),
        //                     bold: true,
        //                     alignment: 'right',
                           
        //                 } 
        //               ])
        //         ],
              
        //     }
        //   }
        ]
    }
}


const data = [
    {
        month: 'Enero',
        year: 2025,
        salary: 25000,
        salary_media: 23000,
        total_savings: 30000,
        total_expenses: 70000,
        expenses: [
            { id: 1, categoria: 'Alimentación', cantidad: 5, porcentaje: '20%', total: 500 },
            { id: 2, categoria: 'Transporte', cantidad: 3, porcentaje: '15%', total: 300 },
            { id: 3, categoria: 'Entretenimiento', cantidad: 2, porcentaje: '10%', total: 200 },
            { id: 4, categoria: 'Salud', cantidad: 1, porcentaje: '5%', total: 100 },
            { id: 5, categoria: 'Educación', cantidad: 2, porcentaje: '10%', total: 200 },
            { id: 6, categoria: 'Vivienda', cantidad: 4, porcentaje: '18%', total: 450 },
            { id: 7, categoria: 'Servicios', cantidad: 3, porcentaje: '12%', total: 250 },
            { id: 8, categoria: 'Ropa', cantidad: 1, porcentaje: '5%', total: 100 },
            { id: 9, categoria: 'Ahorro', cantidad: 2, porcentaje: '10%', total: 200 },
            { id: 10, categoria: 'Otros', cantidad: 2, porcentaje: '5%', total: 100 }
        ]
    },
    {
        month: 'Febrero',
        year: 2025,
        salary: 25000,
        salary_media: 23000,
        total_savings: 30000,
        total_expenses: 70000,
        expenses: [
            { id: 1, categoria: 'Alimentación', cantidad: 5, porcentaje: '20%', total: 500 },
            { id: 2, categoria: 'Transporte', cantidad: 3, porcentaje: '15%', total: 300 },
            { id: 3, categoria: 'Entretenimiento', cantidad: 2, porcentaje: '10%', total: 200 },
            { id: 4, categoria: 'Salud', cantidad: 1, porcentaje: '5%', total: 100 },
            { id: 5, categoria: 'Educación', cantidad: 2, porcentaje: '10%', total: 200 },
            { id: 6, categoria: 'Vivienda', cantidad: 4, porcentaje: '18%', total: 450 },
            { id: 7, categoria: 'Servicios', cantidad: 3, porcentaje: '12%', total: 250 },
            { id: 8, categoria: 'Ropa', cantidad: 1, porcentaje: '5%', total: 100 },
            { id: 9, categoria: 'Ahorro', cantidad: 2, porcentaje: '10%', total: 200 },
            { id: 10, categoria: 'Otros', cantidad: 2, porcentaje: '5%', total: 100 }
        ]
    }
  ];

// return {
//     styles: styles,
//     header: {
//         text: 'Reporte De Gastos',
//         alignment: 'right',
//         margin: [10, 10],
//     },
//     content: [
//         logo,
//         {
//             text: `${data[0].month} ${data[0].year} - ${data[data.length - 1].month} ${data[data.length - 1].year}`,
//             style: 'h1'
//         },

//         // Totales del reporte
//         { text: 'Sueldo actual: $25,000', style: 'first_total' },
//         { text: 'Sueldo media: $23,000', style: 'data_totals' },
//         { text: 'Ahorros: $35,000', style: 'data_totals' },
//         { text: 'Gasto total: $40,000', style: 'data_totals' },

//         // Tablas por mes
//         ...data.flatMap(({ month, year, expenses }) => [
//             { text: `${month} ${year}`, style: 'month_name', margin: [0, 10] },
//             {
//                 margin: [0, 5],
//                 layout: 'lightHorizontalLines',
//                 table: {
//                     widths: [50, '*', 'auto', 'auto', 'auto'],
//                     headerRows: 1,
//                     body: [
//                         [
//                             { text: 'ID', alignment: 'center' },
//                             'Categoría',
//                             'Cantidad',
//                             'Porcentaje',
//                             'Total'
//                         ],
//                         ...expenses.map(expense => [
//                             { text: expense.id.toString(), alignment: 'center' },
//                             expense.categoria,
//                             expense.cantidad.toString(),
//                             expense.porcentaje,
//                             {
//                                 text: Formatter.currency(expense.total),
//                                 bold: true,
//                                 alignment: 'right'
//                             }
//                         ])
//                     ]
//                 }
//             }
//         ])
//     ]
// };