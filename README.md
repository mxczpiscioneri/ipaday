# Ipa Day

**A festa mais amarga do Brasil!**

Evento dedicado exclusivamente às cervejas do estilo India Pale Ale, que acontece todos os anos em Ribeirão Preto (SP).


----------

### API RESTful

| Route           | HTTP Verb | POST body   | Required Auth | Description                  |
|-----------------|-----------|-------------|---------------|------------------------------|
| /beers          | GET       | Empty       | False         | Get all the beers.           |
| /beers/:beer_id | GET       | Empty       | False         | Get a single beer.           |
| /beers          | POST      | JSON String | True          | Create a beer.               |
| /beers/:beer_id | PUT       | JSON String | True          | Update a beer with new info. |
| /beers/:beer_id | DELETE    | Empty       | True          | Delete a beer.               |