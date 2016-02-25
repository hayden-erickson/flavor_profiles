var assert = require( 'assert' );
var rewire = require( 'rewire' );
var fs = require( 'fs' );

var allRecipes = rewire( '../allRecipes.js' );
// funcitons from the file
var getRecipeLinks = allRecipes.__get__( 'getRecipeLinks' );
var getIngredients = allRecipes.__get__('getIngredients');

describe( "Crawler", function() {
  describe( "#getLinkList", function () {
    var searchResults = fs.readFileSync('./test/searchResults.html', 'utf8');
    var links = getRecipeLinks(searchResults);
    it( "should return list of links", function () {
      assert(links.length > 0, "our provided page has > 0 recipes");
    });
    it( "should have the correct number of links", function() {
      assert(links.length == 27, "the number of recipes given back does not match the number of links");
    });
  });
  describe( "#getIngredients", function() {
    var recipePage = fs.readFileSync('./test/recipePage.html', 'utf8');
    var recipe = getIngredients(recipePage);
    var ingredients = recipe.ingredients;
    it( "should return a list of ingredients", function() {
      assert( ingredients.length > 0, "there are no ingredients" );
    });
    it( "should have the correct number of ingredients", function() {
      assert( ingredients.length == 11, "the number of ingredients is wrong" );
    });
    it( "should have the correct ingredients in list", function() {
      assert( ingredients[0] === "2 cups white sugar", "the ingredients don't match what is expected" );
      assert( ingredients[10] === "1 cup boiling water", "the ingredients don't match what is expected" );
    });
  });
});
