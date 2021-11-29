const pokemonModel = require("../models/pokemonModel");

exports.get_pokemon = async (req, res) => {
  console.log("Catching pokemon...");
  const result = await pokemonModel.get_pokemon_data(req.params.pokemonName);
  if (result.status) {
    res.status(result.status);
  }
  res.send(result);
};

exports.get_pokemon_translated = async (req, res) => {
  console.log("Getting pokemon translation...");
  const result = await pokemonModel.get_pokemon_translated_data(
    req.params.pokemonName
  );
  if (result.status) {
    res.status(result.status);
  }
  res.send(result);
};
