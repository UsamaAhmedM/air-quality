import { Controller, Get, Query } from '@nestjs/common';
import { AirQualityService } from '../services/airquality.service';
import { getAirQualitySchema } from '../schemas/get-airquality-params';

@Controller('aq')
export class AirQualityController {
  constructor(private airQualityService: AirQualityService) {}

  @Get()
  async getAirQuality(@Query() queryParams: any): Promise<any> {
    const params = getAirQualitySchema.parse(queryParams);
    const response = await this.airQualityService.callAirQualityApi(
      params.longitude,
      params.latitude,
    );
    return {
      Result: {
        Pollution: response.data.current.pollution,
      },
    };
  }

  @Get('/mostPollutedDateTime')
  async getMostPollutedDateTime(): Promise<any> {
    const response = await this.airQualityService.getMostPollutedDateTime();
    return { DateTime: response.ts };
  }
}
