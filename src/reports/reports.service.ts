import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake'
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { report } from './documents/report';
import { InjectRepository } from '@nestjs/typeorm';
import { MonthEntity } from 'src/month/entities/month.entity';
import { ExpenseEntity } from 'src/expenses/entities/expenses.entity';
import { Between, Repository } from 'typeorm';
import { monthsNames } from 'src/common/utils/months-list';

const fonts = {
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
      bold: 'fonts/Roboto-Medium.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
  };

@Injectable()
export class ReportsService {

    private readonly printer = new PdfPrinter(fonts);
    constructor(
        @InjectRepository(MonthEntity)
        private readonly monthRepository: Repository<MonthEntity>,
        @InjectRepository(ExpenseEntity)
        private readonly expenseRepository: Repository<ExpenseEntity>,
    ){}

    createPdf(docDefinition: TDocumentDefinitions){
        return this.printer.createPdfKitDocument(docDefinition)
    }

    async getReport(data: any): Promise<PDFKit.PDFDocument>{
        const docDefinition = report(data);
      
          return this.createPdf(docDefinition)
    }


   async builtReport(startDate, endDate, user){
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    const yearStart = start.getUTCFullYear();
    const monthStartIndex = start.getUTCMonth()
    const yearEnd = end.getUTCFullYear()
    const monthEndIndex = end.getUTCMonth()

   // Obtener los meses dentro del rango de fechas
   const months = await this.monthRepository.find({
    where: { 
      date_month: Between(start, end),
      usuario: user
    },
    order: {date_month: 'ASC'}
  });

  const reportData: any = [];

  let totalSalary = 0;
  let totalSavings = 0;
  let totalExpenses = 0;

  // Recorrer cada mes
  for (const month of months) {
    // Obtener los gastos de cada mes
    const expenses = await this.expenseRepository.find({
      where: { 
        monthId: month.id,
        usuario: user
       },
      relations: ['category'],  // Relación para obtener el nombre de la categoría
    });


    // Calcular el ahorro del mes
    const monthlySavings = Number(month.salary_montly) - Number(month.expenses_montly);

    // Sumar al total general de ahorros y gastos
    totalSalary += Number(month.salary_montly);
    totalSavings += monthlySavings;
    totalExpenses += Number(month.expenses_montly) | 0;
    console.log(month)

     // Agrupar los gastos por categoría
     const expensesGroupedByCategory = expenses.reduce((acc, expense) => {
      const categoryName = expense.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          id: expense.category.id,
          categoria: categoryName,
          cantidad: 0,
          total: 0,
        };
      }
      acc[categoryName].cantidad += 1;
      acc[categoryName].total += Number(expense.expense);
      return acc;
    }, {});


    // Convertir el objeto en un array
    const expensesWithPercentage = Object.values(expensesGroupedByCategory).map((category: any) => {
      const porcentaje = ((category.total / totalExpenses) * 100).toFixed(2) + '%';
      return {
        ...category,
        porcentaje,
      };
    });

    const date = new Date(month.date_month + "T00:00:00Z");
    const year = date.getUTCFullYear();
    const monthIndex = date.getUTCMonth();
    // Agregar los datos del mes al reporte
    reportData.push({
      month: monthsNames[monthIndex],
      year:year,
      salary: month.salary_montly,
      total_savings: monthlySavings,
      total_expenses: month.expenses_montly,
      expenses: expensesWithPercentage,
    });
  }

    // Calcular el salario medio
    const salaryMedia = totalSalary / months.length;

    // Devolver los datos del reporte, incluyendo los totales
    return {
      yearStart,
      yearEnd,
      monthStart: monthsNames[monthStartIndex],
      monthEnd: monthsNames[monthEndIndex],
      salary_media: salaryMedia.toFixed(),
      total_savings: totalSavings,
      total_expenses: totalExpenses,
      reportData,
    };
    }
}
