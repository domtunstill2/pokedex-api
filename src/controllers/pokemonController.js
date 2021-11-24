const { getPokemonData } = require("../models/pokemonModel");

exports.get_pokemon = async (req, res) => {
  const result = await getPokemonData(req.params.pokemonName);
  res.send(result);
};
