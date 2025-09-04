import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksService } from './notebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notebook } from './entities/notebook.entity';

describe('NotebooksService (unit)', () => {
  let service: NotebooksService;
  let repo: Repository<Notebook>;

  const mockNotebook: Notebook = {
    id: 1,
    title: 'Test Notebook',
    content: 'Some content',
  } as Notebook;

  const mockRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebooksService,
        { provide: getRepositoryToken(Notebook), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService);
    repo = module.get<Repository<Notebook>>(getRepositoryToken(Notebook));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of notebooks', async () => {
      mockRepo.find.mockResolvedValue([mockNotebook]);
      const result = await service.findAll();
      expect(result).toEqual([mockNotebook]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and save a notebook', async () => {
      mockRepo.create.mockReturnValue(mockNotebook);
      mockRepo.save.mockResolvedValue(mockNotebook);

      const dto = { title: 'Test Notebook', content: 'Some content' };
      const result = await service.create(dto);

      expect(result).toEqual(mockNotebook);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockNotebook);
    });
  });
});
