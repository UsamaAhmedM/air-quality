import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AirQuality, AirQualitySchema } from './schemas/airquality.schema';
import { HttpModule } from '@nestjs/axios';
import { AirQualityService } from './services/airquality.service';
import { CronJobService } from './services/cron-job.service';
import { AirQualityController } from './controllers/airquality.controller';
import { APP_FILTER } from '@nestjs/core';
import { ZodValidationExceptionFilter } from './filters/zod-validation.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: AirQuality.name, schema: AirQualitySchema },
    ]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ZodValidationExceptionFilter,
    },
    AirQualityService,
    CronJobService,
  ],
  controllers: [AirQualityController],
})
export class AppModule {}
