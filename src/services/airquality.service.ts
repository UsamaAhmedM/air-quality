import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { AirQuality, AirQualityDocument } from '../schemas/airquality.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AirQualityService {
  constructor(
    @InjectModel(AirQuality.name)
    private readonly airQualityModel: Model<AirQualityDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async saveAirQualityDocument(
    longitude: number,
    latitude: number,
  ): Promise<any> {
    const IQAirResponse = await this.callAirQualityApi(longitude, latitude);
    const AirQuality = await this.airQualityModel.create(
      IQAirResponse.data.current.pollution,
    );
    return AirQuality;
  }

  async callAirQualityApi(longitude: number, latitude: number): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `http://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${this.configService.get(
          'API_KEY',
        )}`,
      ),
    );
    return data;
  }

  async getMostPollutedDateTime() {
    const pollutions = await this.airQualityModel
      .find()
      .sort({ aqius: 'desc' })
      .limit(1);
    return pollutions[0];
  }
}
