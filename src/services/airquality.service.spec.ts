import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AirQuality, AirQualityDocument } from '../schemas/airquality.schema';
import { AirQualityService } from './airquality.service';

const mockAirQuality = (
  ts = new Date('2023-03-28T22:41:02.682+00:00'),
  aqius = 55,
  mainus = 'p1',
  aqicn = 11,
  maincn = 'p1',
): any => ({
  ts,
  aqius,
  mainus,
  aqicn,
  maincn,
});

// still lazy, but this time using an object instead of multiple parameters
const mockAirQualityDoc = (mock?: any): Partial<AirQualityDocument> => ({
  ts: mock?.ts || new Date('2023-03-28T22:41:02.682+00:00'),
  aqius: mock?.aqius || 55,
  mainus: mock?.mainus || 'p1',
  aqicn: mock?.aqicn || 11,
  maincn: mock?.maincn || 'p1',
});

const airQualityDocument = mockAirQualityDoc();

describe('AirQuality Service', () => {
  let airQualityService: AirQualityService;
  let httpService: HttpService;
  let configService: ConfigService;

  let model: Model<AirQualityDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        ConfigService,
        {
          provide: getModelToken(AirQuality.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockAirQuality()),
            constructor: jest.fn().mockResolvedValue(mockAirQuality()),
            find: jest.fn(),
            create: jest.fn(),
            sort: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    airQualityService = module.get<AirQualityService>(AirQualityService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    model = module.get<Model<AirQualityDocument>>(
      getModelToken(AirQuality.name),
    );
  });

  it('should be defined', () => {
    expect(airQualityService).toBeDefined();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the air quality API', async () => {
    const longitude = 123.45;
    const latitude = 67.89;
    const airQuality = {
      data: {
        current: {
          pollution: {
            ts: '2023-03-28T22:41:02.682+00:00',
            aqius: 55,
            mainus: 'p1',
            aqicn: 11,
            maincn: 'p1',
          },
        },
      },
      headers: {},
      config: {},
      status: 200,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of(airQuality as any));
    const result = await airQualityService.callAirQualityApi(
      longitude,
      latitude,
    );

    expect(spy).toHaveBeenCalledWith(
      `http://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${configService.get(
        'API_KEY',
      )}`,
    );
    expect(result).toEqual(airQuality.data);
  });
  it('should call the IQAIR API and save result to database', async () => {
    const longitude = 123.45;
    const latitude = 67.89;
    const airQuality = {
      data: {
        current: {
          pollution: {
            ts: '2023-03-28T22:41:02.682+00:00',
            aqius: 55,
            mainus: 'p1',
            aqicn: 11,
            maincn: 'p1',
          },
        },
      },
      headers: {},
      config: {},
      status: 200,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(airQualityService, 'callAirQualityApi')
      .mockReturnValue(airQuality as any);

    const saveSpy = jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(airQualityDocument));

    const result = await airQualityService.saveAirQualityDocument(
      longitude,
      latitude,
    );

    expect(spy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual(airQualityDocument);
  });
});
