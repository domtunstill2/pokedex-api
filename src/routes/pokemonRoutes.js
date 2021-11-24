module.exports = (app) => {
  const pokemon = require("../controllers/pokemonController");

  // GET basic pokemon information
  app.route("/pokemon/:pokemonName").get(pokemon.get_pokemon);
};
