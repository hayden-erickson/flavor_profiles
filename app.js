var allRecipes = require( './allRecipes' );

function search(query, apis) {
  for( var i = 0; i < apis.length; i++ ) {
    // all apis will expose a search method
    apis[i].search( query )
      ;
  }
}

function main( argv ) {
  apis = [allRecipes];
  search(argv[2], apis);
}

main(process.argv);
