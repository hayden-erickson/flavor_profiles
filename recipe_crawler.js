var rp = require( 'request-promise' );
var cheerio = require( 'cheerio' );

/* esnext */
function getQueryResults( searchString ) {
  rp( allRecipesSearch( searchString ) )
    .then( getRecipeLinks )
    .then( getEachRecipe );
}

function getRecipeLinks( htmlBody ) {
    var $ = cheerio.load(htmlBody);
    var articles = $('article > a');
    var recipeLinks = [];

    $(articles).each( (i, article) => {
      var linkPath = $(article).attr('href');
      // if the link is actually a recipe and not an add or a link to another part of the site
      if(linkPath.match(/^\/recipe\//i)) recipeLinks.push( sites.allRecipes + linkPath );
    });

    return recipeLinks;
}

function getEachRecipe( recipeLinkList ) {
  var recipes = [];

  for(var i = 0, len = recipeLinkList.length; i < len; i++) {
    rp( recipeLinkList[i] )
      .then( getIngredientsWithName )
      .then( console.log.bind(console) )
      ;
  }

}

function getIngredientsWithName( htmlBody ) {
    var $ = cheerio.load( htmlBody );
    var recipeName = $('h1[itemprop=name]').text();
    var recipe = {};

    recipe.name = recipeName;
    recipe.ingredients = [];

    $('span[itemprop=ingredients]').each( (i, ingredient) => {
      recipe.ingredients.push( $(ingredient).text() );
    });

    return recipe;
}

function allRecipesSearch( searchString ) {
  var query = encodeURI( searchString );
  return `${sites.allRecipes}/search/results/?wt=${query}&sort=re`;
}

var sites = {
  allRecipes: "http://allrecipes.com",
  recipesDotCom: "",
}


getQueryResults( process.argv[2] );
