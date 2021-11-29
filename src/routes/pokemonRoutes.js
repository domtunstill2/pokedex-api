const pokemon = require("../controllers/pokemonController");

module.exports = (app) => {
  // GET basic pokemon information
  app.route("/pokemon/:pokemonName").get(pokemon.get_pokemon);

  // GET translated pokemon information
  app
    .route("/pokemon/translated/:pokemonName")
    .get(pokemon.get_pokemon_translated);

  // error handling if a route is not found
  app.use((req, res, next) => {
    res.status(404).send({
      status: 404,
      error: "Not found",
    });
  });
};
