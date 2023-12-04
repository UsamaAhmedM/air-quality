import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AirQualityService } from './airquality.service';

@Injectable()
export class CronJobService {
  constructor(private airQualityService: AirQualityService) {}
  private readonly logger = new Logger(CronJobService.name);

  @Cron('* * * * *')
  handleCron() {
    this.airQualityService.saveAirQualityDocument(2.352222, 48.856613);
    this.logger.debug('Air quality saved.');
  }
}
