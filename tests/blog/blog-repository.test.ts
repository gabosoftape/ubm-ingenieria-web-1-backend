import { BlogRepository } from '../../src/domain/repository/blog-repository';
import BlogModel from '../../src/db/models/BlogModel';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Model } from 'sequelize';
import { CreateBlogDto, BlogRequestModel } from '../../src/domain/models/blog';
import { DefaultFilterCriteria } from '../../src/domain/interfaces/common/default-filter-criteria';

// Mock del modelo Blog
jest.mock('../../src/db/models/BlogModel');

// Tipo para el mock del modelo
const mockBlogModel = BlogModel as jest.Mocked<typeof BlogModel>;

// Helper para crear mocks de modelos Sequelize
const createMockModel = <T extends Record<string, any>>(data: T): Model<T> & {
    update: (data: Partial<T>) => Promise<Model<T>>;
    destroy: () => Promise<void>;
} => {
    const mockModel = {
        ...data,
        _attributes: { ...data },
        dataValues: { ...data },
        _creationAttributes: { ...data },
        isNewRecord: false,
        toJSON: () => ({ ...data }),
        update: jest.fn().mockImplementation(function(this: any, updateData: any) {
            const updatedData = { ...data, ...updateData };
            return Promise.resolve({
                ...updatedData,
                _attributes: { ...updatedData },
                dataValues: { ...updatedData },
                _creationAttributes: { ...updatedData },
                isNewRecord: false,
                toJSON: () => ({ ...updatedData })
            } as unknown as Model<T>);
        }),
        destroy: jest.fn().mockImplementation(() => Promise.resolve())
    } as unknown as Model<T> & {
        update: (data: Partial<T>) => Promise<Model<T>>;
        destroy: () => Promise<void>;
    };

    return mockModel;
};

describe('BlogRepository', () => {
    let repository: BlogRepository;

    beforeEach(() => {
        repository = new BlogRepository();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('debería crear un blog exitosamente', async () => {
            // Arrange
            const blogData: CreateBlogDto = {
                id: '1',
                name: 'Test Blog',
                description: 'Test Description',
                text: 'Test Content',
                account_id: 1
            };

            const mockBlog = createMockModel({
                ...blogData,
                created_at: new Date(),
                updated_at: new Date()
            });

            mockBlogModel.create.mockResolvedValue(mockBlog);

            // Act
            const result = await repository.create(blogData);

            // Assert
            expect(result).toEqual(mockBlog.toJSON());
            expect(mockBlogModel.create).toHaveBeenCalledWith(blogData);
        });

        it('debería manejar errores al crear un blog', async () => {
            // Arrange
            const blogData: CreateBlogDto = {
                id: '1',
                name: 'Test Blog',
                description: 'Test Description',
                text: 'Test Content',
                account_id: 1
            };

            mockBlogModel.create.mockRejectedValue(new Error('Error de base de datos'));

            // Act & Assert
            await expect(repository.create(blogData)).rejects.toThrow('Error de base de datos');
        });
    });

    describe('getAllBlogsByAccount', () => {
        it('debería obtener blogs por cuenta exitosamente', async () => {
            // Arrange
            const accountId = 1;
            const query: DefaultFilterCriteria = {
                page: '0',
                pageSize: '10'
            };

            const mockBlogs = [
                createMockModel({
                    id: '1',
                    name: 'Blog 1',
                    description: 'Description 1',
                    text: 'Content 1',
                    account_id: accountId
                }),
                createMockModel({
                    id: '2',
                    name: 'Blog 2',
                    description: 'Description 2',
                    text: 'Content 2',
                    account_id: accountId
                })
            ];

            mockBlogModel.count.mockResolvedValue(2);
            mockBlogModel.findAll.mockResolvedValue(mockBlogs);

            // Act
            const result = await repository.getAllBlogsByAccount(query, accountId);

            // Assert
            expect(result.status).toBe(200);
            expect(result.data).toHaveLength(2);
            expect(result.count).toBe(2);
            expect(mockBlogModel.findAll).toHaveBeenCalledWith({
                limit: 10,
                offset: 0,
                where: { account_id: accountId },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['id', 'DESC']]
            });
        });

        it('debería manejar errores al obtener blogs', async () => {
            // Arrange
            const accountId = 1;
            const query: DefaultFilterCriteria = {
                page: '0',
                pageSize: '10'
            };

            mockBlogModel.count.mockRejectedValue(new Error('Error de base de datos'));

            // Act & Assert
            await expect(repository.getAllBlogsByAccount(query, accountId))
                .rejects.toThrow('Error de base de datos');
        });
    });

    describe('update', () => {
        it('debería actualizar un blog exitosamente', async () => {
            // Arrange
            const blogData: BlogRequestModel = {
                id: '1',
                name: 'Updated Blog',
                description: 'Updated Description',
                text: 'Updated Content',
                account_id: 1
            };

            const mockUpdatedBlog = createMockModel({
                ...blogData,
                created_at: new Date(),
                updated_at: new Date()
            });

            mockBlogModel.findByPk.mockResolvedValue(mockUpdatedBlog);

            // Act
            const result = await repository.update(blogData);

            // Assert
            expect(result).toEqual(mockUpdatedBlog.toJSON());
            expect(mockBlogModel.findByPk).toHaveBeenCalledWith(blogData.id);
            expect(mockUpdatedBlog.update).toHaveBeenCalledWith({
                name: blogData.name,
                description: blogData.description,
                text: blogData.text,
                account_id: blogData.account_id
            });
        });

        it('debería retornar mensaje cuando el blog no existe', async () => {
            // Arrange
            const blogData: BlogRequestModel = {
                id: '1',
                name: 'Updated Blog',
                description: 'Updated Description',
                text: 'Updated Content',
                account_id: 1
            };

            mockBlogModel.findByPk.mockResolvedValue(null);

            // Act
            const result = await repository.update(blogData);

            // Assert
            expect(result).toEqual({ message: 'Blog not found' });
        });
    });

    describe('delete', () => {
        it('debería eliminar un blog exitosamente', async () => {
            // Arrange
            const blogId = '1';
            const mockBlog = createMockModel({
                id: blogId,
                name: 'Test Blog',
                description: 'Test Description',
                text: 'Test Content',
                account_id: 1
            });

            mockBlogModel.findByPk.mockResolvedValue(mockBlog);

            // Act
            const result = await repository.delete(blogId);

            // Assert
            expect(result).toEqual({ message: 'Blog deleted' });
            expect(mockBlogModel.findByPk).toHaveBeenCalledWith(blogId);
            expect(mockBlog.destroy).toHaveBeenCalled();
        });

        it('debería retornar mensaje cuando el blog no existe', async () => {
            // Arrange
            const blogId = '1';
            mockBlogModel.findByPk.mockResolvedValue(null);

            // Act
            const result = await repository.delete(blogId);

            // Assert
            expect(result).toEqual({ message: 'Blog not found' });
        });
    });
}); 