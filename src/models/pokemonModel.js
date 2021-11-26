const {
  fetchPokemonData,
  // formatPokemonData,
  getTranslatedData,
} = require("./helpers");

exports.get_pokemon_data = async (pokemon) => {
  const pokeData = await fetchPokemonData(pokemon);
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
  const transaltion =
    formatedData.habitat === "cave" || formatedData.isLegendary
      ? "yoda"
      : "shakespeare";
  return getTranslatedData(formatedData, transaltion);
};
