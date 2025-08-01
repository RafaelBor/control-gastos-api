import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../categories/entities/category.entity';
import { UserInfoEntity } from './entities/user_info.entity';
import { MonthEntity } from '../month/entities/month.entity';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      UserInfoEntity,
      MonthEntity
    ])
  ]
})
export class CommonModule {}
