import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/auth/entities/auth.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('')
  @Auth()
  async getReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() response: Response,
    @GetUser() user: UserEntity,
  ){
    const res = await this.buildReport(startDate, endDate, user);
    const pdfDoc = await this.reportsService.getReport(res);
    

    response.setHeader('Content-Type', 'application/pdf')
    console.log(response)
    pdfDoc.info.Title = 'Reporte gastos'
    pdfDoc.pipe(response)
    pdfDoc.end()
  }

  @Post('build')
  async buildReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @GetUser() user: UserEntity,
  ){
    const res = await this.reportsService.builtReport(startDate, endDate, user);

    return res;
  }
}
