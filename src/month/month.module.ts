import { Module } from '@nestjs/common';
import { MonthController } from './month.controller';
import { MonthService } from './month.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthEntity } from './entities/month.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ExpenseEntity } from 'src/expenses/entities/expenses.entity';

@Module({
  controllers: [MonthController],
  providers: [MonthService],
  imports: [
    TypeOrmModule.forFeature([MonthEntity, ExpenseEntity]),
    AuthModule
  ],
  exports: [
    MonthService
  ]
})
export class MonthModule {}
