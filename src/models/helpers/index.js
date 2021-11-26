const needle = require("needle");

const API_METHOD = "post";
const POKEAPI_URL = "https://beta.pokeapi.co/graphql/v1beta";
const TRANSLATE_URL = "https://api.funtranslations.com/translate";

exports.fetchPokemonData = (pokemon) => {
  const query = `query getPokemonInfo {result: pokemon_v2_pokemonspecies(order_by: {id: asc}, where: {name: {_eq: "${pokemon}"}}) {  name  id  is_legendary  habitat: pokemon_v2_pokemonhabitat { name }  description: pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) { flavor_text }}}`;
  return makeNeedleRequest(POKEAPI_URL, { query });
};

exports.formatPokemonData = (pokeData) => {
  const {
    body: {
      data: {
        result: [
          {
            name,
            is_legendary: isLegendary,
            habitat: { name: habitat },
            description: [{ flavor_text: description }],
          },
        ],
      },
    },
  } = pokeData;
  return {
    name,
    description: description.replace(/(\r\n|\n|\r|\f)/gm, " "),
    habitat,
    isLegendary,
  };
};

exports.getTranslatedData = async (pokeData) => {
  const translatedData = await fetchDescriptionTranslation(
    pokeData.description
  );
  return {
    ...pokeData,
    description: translatedData.body.contents.translated,
  };
};

const fetchDescriptionTranslation = (text, type) => {
  const fullUrl = `${TRANSLATE_URL}/${type}.json`;
  return makeNeedleRequest(fullUrl, { text });
};

const makeNeedleRequest = (url, data) => {
  const options = {
    json: true,
  };
  return needle(API_METHOD, url, data, options);
};
