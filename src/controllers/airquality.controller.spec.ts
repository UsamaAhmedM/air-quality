import { Test } from '@nestjs/testing';
import { AirQualityController } from './airquality.controller';
import { AirQualityService } from '../services/airquality.service';

describe('AirQualityController', () => {
  let airQualityController: AirQualityController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        {
          provide: AirQualityService,
          useValue: {
            getMostPollutedDateTime: jest.fn().mockImplementation(() =>
              Promise.resolve({
                ts: '2023-12-04T13:45:00.000Z',
              }),
            ),
            callAirQualityApi: jest.fn().mockImplementation(() =>
              Promise.resolve({
                data: {
                  current: {
                    pollution: {
                      ts: '2023-12-04T22:41:02.682+00:00',
                      aqius: 35,
                      mainus: 'p2',
                      aqicn: 18,
                      maincn: 'p1',
                    },
                  },
                },
              }),
            ),
          },
        },
      ],
    }).compile();

    airQualityController =
      moduleRef.get<AirQualityController>(AirQualityController);
  });

  it('should be defined', () => {
    expect(airQualityController).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should return airquality', async () => {
      const longitude = 1.23;
      const latitude = 4.56;
      const result = airQualityController.getAirQuality({
        longitude,
        latitude,
      });
      expect(result).resolves.toEqual({
        Result: {
          Pollution: {
            ts: '2023-12-04T22:41:02.682+00:00',
            aqius: 35,
            mainus: 'p2',
            aqicn: 18,
            maincn: 'p1',
          },
        },
      });
    });
  });

  describe('getMostPollutedDateTime', () => {
    it('should return the most polluted datetime', async () => {
      const result = airQualityController.getMostPollutedDateTime();
      expect(result).resolves.toEqual({ DateTime: '2023-12-04T13:45:00.000Z' });
    });
  });
});
