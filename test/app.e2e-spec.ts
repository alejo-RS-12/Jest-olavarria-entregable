import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from './../src/app.module';
import { Notebook } from './../src/notebooks/entities/notebook.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'THEspectre12!',
          database: 'notebooks-test', // ⚡ ahora una DB exclusiva de testing
          entities: [Notebook],
          synchronize: true,
          dropSchema: true, // 🔥 borra y recrea tablas en cada ejecución
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 10000); // aumentamos el timeout para la conexión a BD

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/notebooks (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/notebooks')
      .send({ title: 'E2E Test Notebook', content: 'Contenido de prueba' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('E2E Test Notebook');
  });

  it('/notebooks (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/notebooks')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
