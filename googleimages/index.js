
var gis = require('g-i-s');
var opts = {
  searchTerm: ['Chuck Norris', 'Chuck Norris Jeans', 'Chuck Norris Kick'],
  queryStringAddition: '&tbs=ic:trans',
  filterOutDomains: [
    'pinterest.com',
    'deviantart.com'
  ]
};
gis(opts, logResults);


gis(opts, logResults);

function logResults(error, results) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(results, null, '  '));
  }
}