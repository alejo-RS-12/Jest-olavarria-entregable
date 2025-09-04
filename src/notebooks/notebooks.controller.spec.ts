import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { Notebook } from './entities/notebook.entity';
import { HttpException } from '@nestjs/common';

describe('NotebooksController (unit)', () => {
  let controller: NotebooksController;
  let service: NotebooksService;

  const mockNotebook: Notebook = {
    id: 1,
    title: 'Test Notebook',
    content: 'Some content',
  } as Notebook;

  const mockService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [{ provide: NotebooksService, useValue: mockService }],
    }).compile();

    controller = module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of notebooks', async () => {
      mockService.findAll.mockResolvedValue([mockNotebook]);
      const result = await controller.findAll();
      expect(result).toEqual([mockNotebook]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should throw HttpException on error', async () => {
      mockService.findAll.mockRejectedValue(new Error('DB error'));
      await expect(controller.findAll()).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('create', () => {
    it('should create a notebook', async () => {
      mockService.create.mockResolvedValue(mockNotebook);
      const result = await controller.create({ title: 'Test Notebook', content: 'Some content' });
      expect(result).toEqual(mockNotebook);
      expect(service.create).toHaveBeenCalledWith({ title: 'Test Notebook', content: 'Some content' });
    });

    it('should throw HttpException on error', async () => {
      mockService.create.mockRejectedValue(new Error('DB error'));
      await expect(
        controller.create({ title: 'Fail Notebook', content: 'error' }),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });
});
