const nock = require("nock");

const POKEAPI_BASEURL = "https://beta.pokeapi.co";
const POKEAPI_ENDPOINT = "/graphql/v1beta";
const TRANSLATE_BASEURL = "https://api.funtranslations.com";
const TRANSLATE_ENDPOINT = "/translate";

const {
  fetchPokemonData,
  fetchDescriptionTranslation,
} = require("../../../src/models/helpers");

const LEGENDARY_POKEMON = "mew";
const NOT_POKEMON = "mewww";
const query = (pokemon) =>
  `query getPokemonInfo {result: pokemon_v2_pokemonspecies(order_by: {id: asc}, where: {name: {_eq: "${pokemon}"}}) {  name  id  is_legendary  habitat: pokemon_v2_pokemonhabitat { name }  description: pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) { flavor_text }}}`;
const SUCCESS_CODE = 200;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR = 500;
const ERROR_MESSAGE_SERVER = "server failure";
const ERROR_MESSAGE_NEEDLE = "needle failure";
const TRANSLATION_TYPE = "yoda";
const DESCRIPTION =
  "It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.";
const YODA_TRANSLATION =
  "Created by a scientist after years of horrific gene splicing and dna engineering experiments,  it was.";

describe("modelHelpers", () => {
  describe("fetchPokemonData", () => {
    test("should fetch and return pokemon data.", async () => {
      nock(POKEAPI_BASEURL)
        .post(POKEAPI_ENDPOINT, { query: query(LEGENDARY_POKEMON) })
        .reply(SUCCESS_CODE, {
          data: { result: [{ name: LEGENDARY_POKEMON }] },
        });
      const result = await fetchPokemonData(LEGENDARY_POKEMON);
      expect(result.statusCode).toEqual(SUCCESS_CODE);
      expect(result.body).toEqual({ name: LEGENDARY_POKEMON });
    });
    test("should return message and 404 error code if not found", async () => {
      nock(POKEAPI_BASEURL)
        .post(POKEAPI_ENDPOINT, { query: query(NOT_POKEMON) })
        .reply(SUCCESS_CODE, {
          data: { result: [] },
        });
      const result = await fetchPokemonData(NOT_POKEMON);
      expect(result.statusCode).toEqual(NOT_FOUND_CODE);
      expect(result.body.toString()).toEqual(
        `'${NOT_POKEMON}' is not in our Pokedex, try searching for another Pokemon.`
      );
    });
    test("should return external error code and body if request fails.", async () => {
      nock(POKEAPI_BASEURL)
        .post(POKEAPI_ENDPOINT, { query: query(NOT_POKEMON) })
        .reply(SERVER_ERROR, ERROR_MESSAGE_SERVER);
      const result = await fetchPokemonData(NOT_POKEMON);
      expect(result.statusCode).toEqual(SERVER_ERROR);
      expect(result.body.toString()).toEqual(ERROR_MESSAGE_SERVER);
    });
    test("should return server error if needle request fails.", async () => {
      nock(POKEAPI_BASEURL)
        .post(POKEAPI_ENDPOINT, { query: query(NOT_POKEMON) })
        .replyWithError(ERROR_MESSAGE_NEEDLE);
      const result = await fetchPokemonData(NOT_POKEMON);
      expect(result.statusCode).toEqual(SERVER_ERROR);
      expect(result.body).toEqual(ERROR_MESSAGE_NEEDLE);
    });
  });
  describe("fetchDescriptionTranslation", () => {
    test("should fetch transalted description and return it.", async () => {
      nock(TRANSLATE_BASEURL)
        .post(`${TRANSLATE_ENDPOINT}/${TRANSLATION_TYPE}.json`, {
          text: DESCRIPTION,
        })
        .reply(SUCCESS_CODE, {
          contents: { translated: YODA_TRANSLATION },
        });
      const result = await fetchDescriptionTranslation(
        DESCRIPTION,
        TRANSLATION_TYPE
      );
      expect(result.body).toEqual({
        contents: { translated: YODA_TRANSLATION },
      });
      expect(result.statusCode).toEqual(SUCCESS_CODE);
    });
  });
});
