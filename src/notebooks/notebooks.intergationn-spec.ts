import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotebooksService } from '../src/notebooks/notebooks.service';
import { Notebook } from '../src/notebooks/notebook.entity';

describe('NotebooksService (integration)', () => {
  let service: NotebooksService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'THEspectre12!',
          database: 'notebooks_test', // 👈 asegúrate de crear esta DB antes
          entities: [Notebook],
          synchronize: true, // solo para pruebas (NO en producción)
        }),
        TypeOrmModule.forFeature([Notebook]),
      ],
      providers: [NotebooksService],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService);
  });

  afterEach(async () => {
    // limpiar la tabla después de cada test
    const all = await service.findAll();
    for (const notebook of all) {
      await service.remove(notebook.id);
    }
  });

  it('should create a notebook', async () => {
    const notebook = await service.create({
      title: 'Integration Test Notebook',
      content: 'This is an integration test',
    });

    expect(notebook).toHaveProperty('id');
    expect(notebook.title).toBe('Integration Test Notebook');
  });

  it('should find all notebooks', async () => {
    await service.create({ title: 'NB1', content: 'Test 1' });
    await service.create({ title: 'NB2', content: 'Test 2' });

    const notebooks = await service.findAll();
    expect(notebooks.length).toBe(2);
  });
});
