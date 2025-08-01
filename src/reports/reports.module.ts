import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthEntity } from 'src/month/entities/month.entity';
import { ExpenseEntity } from 'src/expenses/entities/expenses.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [
    TypeOrmModule.forFeature([MonthEntity, ExpenseEntity]),
    AuthModule
  ],
})
export class ReportsModule {}
