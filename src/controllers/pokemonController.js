const {
  get_pokemon_data,
  get_pokemon_translated_data,
} = require("../models/pokemonModel");

exports.get_pokemon = async (req, res) => {
  const result = await get_pokemon_data(req.params.pokemonName);
  res.send(result);
};

exports.get_pokemon_translated = async (req, res) => {
  const result = await get_pokemon_translated_data(req.params.pokemonName);
  res.send(result);
};
