const needle = require("needle");

const API_METHOD = "post";
const POKEAPI_URL = "https://beta.pokeapi.co/graphql/v1beta";
const TRANSLATE_URL = "https://api.funtranslations.com/translate";
const SUCCESS_CODE = 200;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR = 500;

exports.fetchPokemonData = async (pokemon) => {
  const query = `query getPokemonInfo {result: pokemon_v2_pokemonspecies(order_by: {id: asc}, where: {name: {_eq: "${pokemon}"}}) {  name  id  is_legendary  habitat: pokemon_v2_pokemonhabitat { name }  description: pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) { flavor_text }}}`;
  const result = await makeNeedleRequest(POKEAPI_URL, { query });
  if (result.statusCode !== SUCCESS_CODE) {
    return result;
  }
  if (
    !result.body.data ||
    !result.body.data.result ||
    !result.body.data.result.length
  ) {
    return {
      statusCode: NOT_FOUND_CODE,
      body: `'${pokemon}' is not in our Pokedex, try searching for another Pokemon.`,
    };
  }
  return { statusCode: SUCCESS_CODE, body: result.body.data.result[0] };
};

exports.fetchDescriptionTranslation = (text, type) => {
  const fullUrl = `${TRANSLATE_URL}/${type}.json`;
  return makeNeedleRequest(fullUrl, { text });
};

const makeNeedleRequest = async (url, data) => {
  const options = {
    json: true,
  };
  try {
    const result = await needle(API_METHOD, url, data, options);
    return result;
  } catch (err) {
    return {
      statusCode: SERVER_ERROR,
      body: err.message,
    };
  }
};
