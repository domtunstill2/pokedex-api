const { fetchPokemonData, fetchDescriptionTranslation } = require("./helpers");

exports.get_pokemon_data = async (pokemon) => {
  const pokeData = await fetchPokemonData(pokemon);
  if (pokeData.statusCode !== 200) {
    return {
      status: 500,
      error: `An error occured whislt trying catch your Pokemon. Try again.`,
    };
  }
  if (!pokeData.body.data.result.length) {
    return {
      status: 404,
      error: `'${pokemon}' is not in our Pokedex, try searching for another Pokemon.`,
    };
  }
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

exports.get_pokemon_translated_data = async (pokemon) => {
  const formatedData = await this.get_pokemon_data(pokemon);
  if (formatedData.error) {
    return formatedData;
  }
  const transaltion =
    formatedData.habitat === "cave" || formatedData.isLegendary
      ? "yoda"
      : "shakespeare";
  const translatedData = await fetchDescriptionTranslation(
    formatedData.description,
    transaltion
  );
  if (translatedData.statusCode !== 200) {
    return {
      status: translatedData.statusCode,
      error: translatedData.body.error.message,
    };
  }
  return {
    ...formatedData,
    description: translatedData.body.contents.translated,
  };
};
