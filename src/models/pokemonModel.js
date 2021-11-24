const needle = require("needle");

exports.getPokemonData = async (pokemon) => {
  const options = {
    json: true,
  };
  const query = `query getPokemonInfo {result: pokemon_v2_pokemonspecies(order_by: {id: asc}, where: {name: {_eq: "${pokemon}"}}) {  name  id  is_legendary  habitat: pokemon_v2_pokemonhabitat { name }  description: pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) { flavor_text }}}`;
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
  } = await needle(
    "post",
    "https://beta.pokeapi.co/graphql/v1beta",
    {
      query,
    },
    options
  );
  const formattedData = {
    name,
    description: description.replace(/(\r\n|\n|\r|\f)/gm, " "),
    habitat,
    isLegendary,
  };
  return formattedData;
};
