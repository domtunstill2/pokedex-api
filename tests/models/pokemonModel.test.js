const modelHelpers = require("../../src/models/helpers");
const {
  get_pokemon_data,
  get_pokemon_translated_data,
} = require("../../src/models/pokemonModel");

const LEGENDARY_POKEMON = "mew";
const CAVE_POKEMON = "diglet";
const OTHER_POKEMON = "pidgey";
const NOT_POKEMON = "notmew";
const MALFORMED_POKEMON = "fail";
const SUCCESS_CODE = 200;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR = 500;
const HABITAT = "rare";
const CAVE_HABITAT = "cave";
const YODA = "yoda";
const SHAKESPEARE = "shakespeare";
const DESCRIPTION =
  "It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.";
const YODA_TRANSLATION =
  "Created by a scientist after years of horrific gene splicing and dna engineering experiments,  it was.";
const SHAKESPEARE_TRANSLATION =
  "'t wast did create by a scientist after years of horrific gene splicing and dna engineering experiments.";
const FAILED_DESCRIPTION = "failed";

describe("pokemonModel", () => {
  jest.spyOn(modelHelpers, "fetchPokemonData").mockImplementation((name) => {
    if (name === LEGENDARY_POKEMON) {
      return Promise.resolve({
        statusCode: SUCCESS_CODE,
        body: {
          name: name,
          is_legendary: true,
          habitat: { name: HABITAT },
          description: [
            {
              flavor_text: DESCRIPTION,
            },
          ],
        },
      });
    }
    if (name === CAVE_POKEMON) {
      return Promise.resolve({
        statusCode: SUCCESS_CODE,
        body: {
          name: name,
          is_legendary: false,
          habitat: { name: CAVE_HABITAT },
          description: [
            {
              flavor_text: DESCRIPTION,
            },
          ],
        },
      });
    }
    if (name === OTHER_POKEMON) {
      return Promise.resolve({
        statusCode: SUCCESS_CODE,
        body: {
          name: name,
          is_legendary: false,
          habitat: { name: HABITAT },
          description: [
            {
              flavor_text: DESCRIPTION,
            },
          ],
        },
      });
    }
    if (name === MALFORMED_POKEMON) {
      return Promise.resolve({
        statusCode: SUCCESS_CODE,
        body: {
          name: name,
          is_legendary: false,
          habitat: { name: HABITAT },
          description: [
            {
              flavor_text: FAILED_DESCRIPTION,
            },
          ],
        },
      });
    }
    return Promise.resolve({
      statusCode: NOT_FOUND_CODE,
      body: `'${name}' is not in our Pokedex, try searching for another Pokemon.`,
    });
  });
  describe("get_pokemon_data", () => {
    test("should return formatted pokemon data", async () => {
      expect(await get_pokemon_data(LEGENDARY_POKEMON)).toEqual({
        description: DESCRIPTION,
        name: LEGENDARY_POKEMON,
        habitat: HABITAT,
        isLegendary: true,
      });
    });
    test("should return error message and code if pokemon not found", async () => {
      expect(await get_pokemon_data(NOT_POKEMON)).toEqual({
        status: 404,
        error: `'${NOT_POKEMON}' is not in our Pokedex, try searching for another Pokemon.`,
      });
    });
  });
  describe("get_pokemon_translated_data", () => {
    jest
      .spyOn(modelHelpers, "fetchDescriptionTranslation")
      .mockImplementation((description, transaltionType) => {
        if (description === FAILED_DESCRIPTION) {
          return Promise.resolve({
            statusCode: SERVER_ERROR,
            body: { error: { message: `Server error.` } },
          });
        }
        if (transaltionType === YODA) {
          return Promise.resolve({
            statusCode: SUCCESS_CODE,
            body: {
              contents: { translated: YODA_TRANSLATION },
            },
          });
        }
        if (transaltionType === SHAKESPEARE) {
          return Promise.resolve({
            statusCode: SUCCESS_CODE,
            body: {
              contents: { translated: SHAKESPEARE_TRANSLATION },
            },
          });
        }
      });
    test("should return pokemon data with yoda translated description for 'legendary' pokemon.", async () => {
      expect(await get_pokemon_translated_data(LEGENDARY_POKEMON)).toEqual({
        description: YODA_TRANSLATION,
        name: LEGENDARY_POKEMON,
        habitat: HABITAT,
        isLegendary: true,
      });
    });
    test("should return pokemon data with yoda translated description for 'cave' pokemon.", async () => {
      expect(await get_pokemon_translated_data(CAVE_POKEMON)).toEqual({
        description: YODA_TRANSLATION,
        name: CAVE_POKEMON,
        habitat: CAVE_HABITAT,
        isLegendary: false,
      });
    });
    test("should return pokemon data with shakespeare translated description for pokemon that aren't 'cave' or 'legendary'.", async () => {
      expect(await get_pokemon_translated_data(OTHER_POKEMON)).toEqual({
        description: SHAKESPEARE_TRANSLATION,
        name: OTHER_POKEMON,
        habitat: HABITAT,
        isLegendary: false,
      });
    });
    test("should return error message and code if pokemon not found", async () => {
      expect(await get_pokemon_translated_data(NOT_POKEMON)).toEqual({
        status: 404,
        error: `'${NOT_POKEMON}' is not in our Pokedex, try searching for another Pokemon.`,
      });
    });
    test("should return error message and code if translation call fails", async () => {
      expect(await get_pokemon_translated_data(MALFORMED_POKEMON)).toEqual({
        status: 500,
        error: "Server error.",
      });
    });
  });
});
