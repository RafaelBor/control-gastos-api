import { Module } from '@nestjs/common';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfoEntity } from 'src/common/entities/user_info.entity';
import { MonthEntity } from 'src/month/entities/month.entity';

@Module({
  controllers: [SalaryController],
  providers: [SalaryService],
  imports: [
    TypeOrmModule.forFeature([UserInfoEntity, MonthEntity]),
    AuthModule
  ]
})
export class SalaryModule {}
