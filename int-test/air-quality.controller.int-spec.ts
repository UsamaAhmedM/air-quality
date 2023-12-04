import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AirQualityController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/aq (GET) - should return air quality information', async () => {
    const queryParams = {
      longitude: '2.352222',
      latitude: '48.856613',
    };

    const response = await request(app.getHttpServer())
      .get('/aq')
      .query(queryParams)
      .expect(200);

    expect(response.body.Result.Pollution).toBeDefined();
  });

  it('/aq (GET) - should return error if params are invalid', async () => {
    const queryParams = {
      longitude: '2.352222',
      latitude: 'lat',
    };

    const response = await request(app.getHttpServer())
      .get('/aq')
      .query(queryParams)
      .expect(400);

    expect(response.body.message).toBeDefined();
  });

  it('/aq/mostPollutedDateTime (GET) - should return most polluted date and time', async () => {
    const response = await request(app.getHttpServer())
      .get('/aq/mostPollutedDateTime')
      .expect(200);

    expect(response.body.DateTime).toBeDefined();
  });
});
