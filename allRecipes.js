var rp = require( 'request-promise' );
var cheerio = require( 'cheerio' );
var parser = require( './util/ingredientParser' );

var url = "http://allrecipes.com";

function getEachRecipe( recipeLinkList ) {
  var recipes = [];

  for(var i = 0, len = recipeLinkList.length; i < len; i++) {
    rp( recipeLinkList[i] )
      // all api's should also expose this method
      .then( getIngredients )
      .then(console.log)
      ;
  }
}

function getIngredients( htmlBody ) {
    var $ = cheerio.load( htmlBody );

    recipe = {};

    recipe.name = $('h1[itemprop=name]').text();
    recipe.ingredients = [];

    $('span[itemprop=ingredients]').each( function(i, ingredient) {
      recipe.ingredients.push( parser.parse( $( ingredient ).text() ) );
    });

    return recipe;
}

function getRecipeLinks( htmlBody ) {
  var $ = cheerio.load(htmlBody);
  var articles = $('article > a:nth-child(2)');
  articles += $('article > a:first-child');
  var recipeLinks = [];

  $(articles).each( function(i, article) {
    var linkPath = $(article).attr('href');
    // if the link is actually a recipe and not an ad or a link to another part of the site
    if(linkPath.match(/^\/recipe\//i)) recipeLinks.push( url + linkPath );
  });

  return recipeLinks;
}

// how to search on allrecipes.com
module.exports.search = function( searchString ) {
  var query = encodeURI( searchString );
  return rp( url+"/search/results/?wt="+query+"&sort=re" )
          .then(getRecipeLinks)
          .then(getEachRecipe)
          ;
};
