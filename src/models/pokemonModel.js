const modelHelpers = require("./helpers");

const SUCCESS_CODE = 200;
const YODA_HABITAT = "cave";

exports.get_pokemon_data = async (pokemon) => {
  const pokeData = await modelHelpers.fetchPokemonData(pokemon);
  if (pokeData.statusCode !== SUCCESS_CODE) {
    return {
      status: pokeData.statusCode,
      error: pokeData.body,
    };
  }
  return {
    name: pokeData.body.name,
    description: pokeData.body.description[0].flavor_text,
    habitat: pokeData.body.habitat.name,
    isLegendary: pokeData.body.is_legendary,
  };
};

exports.get_pokemon_translated_data = async (pokemon) => {
  const pokeData = await this.get_pokemon_data(pokemon);
  if (pokeData.error) {
    return pokeData;
  }
  const transaltionType =
    pokeData.habitat === YODA_HABITAT || pokeData.isLegendary
      ? "yoda"
      : "shakespeare";
  const translatedData = await modelHelpers.fetchDescriptionTranslation(
    pokeData.description,
    transaltionType
  );
  if (translatedData.statusCode !== SUCCESS_CODE) {
    const error =
      translatedData.body.error && translatedData.body.error.message
        ? translatedData.body.error.message
        : translatedData.body;
    return {
      status: translatedData.statusCode,
      error,
    };
  }
  return {
    ...pokeData,
    description: translatedData.body.contents.translated,
  };
};
