const pokemonModel = require("../../src/models/pokemonModel");
const {
  get_pokemon,
  get_pokemon_translated,
} = require("../../src/controllers/pokemonController");

const POKEMON = "mew";
const NOT_POKEMON = "notmew";

describe("pokemonController", () => {
  let res = {};
  const resOriginal = {
    status(code) {
      this.statusCode = code;
    },
    send(body) {
      this.body = body;
    },
  };
  beforeEach(() => {
    res = { ...resOriginal };
  });
  describe("get_pokemon", () => {
    jest.spyOn(pokemonModel, "get_pokemon_data").mockImplementation((name) => {
      if (name === POKEMON) {
        return Promise.resolve({ name });
      }
      return Promise.resolve({ status: 404 });
    });
    test("should call model file to get data about pokemon", async () => {
      const req = {
        params: { pokemonName: POKEMON },
      };
      await get_pokemon(req, res);
      expect(res.body).toEqual({ name: POKEMON });
    });
    test("should update status code if error code returned", async () => {
      const req = {
        params: { pokemonName: NOT_POKEMON },
      };
      await get_pokemon(req, res);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ status: 404 });
    });
  });
  describe("get_pokemon_translated", () => {
    jest
      .spyOn(pokemonModel, "get_pokemon_translated_data")
      .mockImplementation((name) => {
        if (name === POKEMON) {
          return Promise.resolve({ name });
        }
        return Promise.resolve({ status: 404 });
      });
    test("should call model file to get translated data about pokemon", async () => {
      const req = {
        params: { pokemonName: POKEMON },
      };
      await get_pokemon_translated(req, res);
      expect(res.body).toEqual({ name: POKEMON });
    });
    test("should update status code if error code returned", async () => {
      const req = {
        params: { pokemonName: NOT_POKEMON },
      };
      await get_pokemon_translated(req, res);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ status: 404 });
    });
  });
});
