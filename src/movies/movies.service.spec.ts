import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create()", () => {
    it("should create a movie", () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: "Test Movie",
        genres: ["test"],
        year: 2000
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    })
  });

  describe("getAll()", () => {
    it("should return an array", () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    })
  });

  describe("getOne()", () => {
    it("should return a movie", () => {
      service.create({
        title: "Test Movie",
        genres: ["test"],
        year: 2000
      });
      const movie = service.getOne(0);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(0);
    });

    it("should throw 404 error", () => {
      try {
        service.getOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual("Movie with ID: 999 NOT FOUND.");
      }
    })
  });

  describe("deleteOne()", () => {
    it("should delete a movie", () => {
      service.create({
        title: "Test Movie",
        genres: ["test"],
        year: 2000
      });
      const beforeDelete = service.getAll();
      service.deleteOne(0);
      const afterDelete = service.getAll();
      expect(afterDelete.length).toBeLessThan(beforeDelete.length);
    });
    it("should return a 404", () => {
      try {
        service.deleteOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("update()", () => {
    it("should update a movie", () => {
      service.create({
        title: "Test Movie",
        genres: ["test"],
        year: 2000
      });
      service.update(0, {
        title: "Test Updated"
      });
      const movie = service.getOne(0);
      expect(movie.title).toEqual("Test Updated");
    });
  });
});
