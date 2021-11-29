# pokedex-api

Pokedex API

# Documentation

## Starting the local server in a docker container

Clone this repo `git clone git@github.com:domtunstill2/pokedex-api.git`

Navigate to the repo directory `cd ./podedex-api`

Install docker for your system if you have not already. https://docs.docker.com/get-docker/

Build the docker image `docker build . -t pokedex-api`

Run docker image locally `docker run -p 3000:3000 -d pokedex-api`

### Run tests

Enter the container (ID is returned from command above) `docker exec -it <container id> /bin/bash`

Run tests by running `npm test`

## Starting the local server without using docker

Clone this repo `git clone git@github.com:domtunstill2/pokedex-api.git`

Install node for your system if you haven't already https://nodejs.org/en/download/

Install project dependcies `npm i`

Start ther server `npm start`

### Run tests

Run tests by running `npm test`

## Base URL

The base URL for all requests is `http://localhost:3000`

## Endpoints

### **GET** `/pokemon/{{pokemon}}`

Get information about a specific Pokemon.

_Example_:
`http://localhost:3000/pokemon/mewtwo`

**_Response_**  
 `Status: 200 OK`

```
{
    "name":"mewtwo",
    "description":"It was created by\na scientist after\nyears of horrific\fgene splicing and\nDNA engineering\nexperiments.",
    "habitat":"rare",
    "isLegendary":true
}
```

### **GET** `/pokemon/translated/{{pokemon}}`

Get information about a specific Pokemon with a translated description.

Limited to 5 requests per hour.

_Example_:
`http://localhost:3000/pokemon/translated/mewtwo`

**_Response_**  
 `Status: 200 OK`

```
{
    "name":"mewtwo",
    "description":"Created by a scientist after years of horrific gene splicing and dna engineering experiments,  it was.",
    "habitat":"rare",
    "isLegendary":true
}
```

## Production

Next steps would be to add a cache to store results for two reasons.

1. It's quicker than going to the external services everytime.
2. The translation service has a rate limit of 5 requests an hour, which this cwould reduce the number of times requests go to this API. The pokemon API also has a fair usage policy so this would avoid hitting their API too often.
