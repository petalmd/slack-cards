function createTemplate(resultsArray) {
  let template = '<h1>Rows</h1>';
  resultsArray.forEach(result => {
    template += '<ul>';
    Object.keys(result).forEach(key => {
      template += '<li>' + result[key] + '</li>';
    });
    template += '</ul>';
  });

  return template;
}

module.exports = async(database, router) => {
  let resultsArray = [];
  await database().getRows().then((data) => {
    console.log(data);
    resultsArray = data.results;
  });

  router.get('/stats', (req, res) => {
    res.send(createTemplate(resultsArray));
    console.log(resultsArray);
  });
}
