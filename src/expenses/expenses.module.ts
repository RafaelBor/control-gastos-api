import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from './entities/expenses.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MonthEntity } from 'src/month/entities/month.entity';
import { MonthService } from 'src/month/month.service';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService, MonthService],
  imports: [
    TypeOrmModule.forFeature([ExpenseEntity, MonthEntity]),
    AuthModule,
    
  ]
})
export class ExpensesModule {}
