import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SalaryModule } from './salary/salary.module';
import { CommonModule } from './common/common.module';
import { MonthModule } from './month/month.module';
import { CategoriesModule } from './categories/categories.module';
import { ReportsModule } from './reports/reports.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 3306),
      username: process.env.DB_USER,
      password:  process.env.DB_PASS,
      database:  process.env.DB_NAME,
      schema: 'public',
      entities: [],
      autoLoadEntities:true,
      synchronize: true,
      migrations: ['dist/database/migrations/*{.ts,.js}'], // Ruta de las migraciones compiladas
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_ACCOUNT,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: '"MiauHORROS" <miauhorros.app@gmail.com>',
      },
    }),
    AuthModule,
    ExpensesModule,
    SalaryModule,
    CommonModule,
    MonthModule,
    CategoriesModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
