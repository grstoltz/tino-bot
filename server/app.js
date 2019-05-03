const {BigQuery} = require('@google-cloud/bigquery');
const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

const PORT = 8080 || process.env.PORT

const projectId = 'tinobot';
const datasetId = 'messages';
const tableId = 'messages';

const bigquery = new BigQuery({  
    projectId: projectId,
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/test', (req, res, next) => {
    res.send("hello")
})

app.get('/message', (req, res, next) => {
    const query = `SELECT *, RAND() AS r FROM [tinobot:messages.messages] ORDER BY r LIMIT 1`;

bigquery.createQueryStream(query)
  .on('error', console.error)
  .on('data', function(row) {
    res.send(row)
  })
  .on('end', function() {
    // All rows retrieved.
  });

});

app.post('/message', async (req, res, next) => {
    const row = [{
           message: req.body.message
       }]

await bigquery
  .dataset(datasetId)
  .table(tableId)
  .insert(row);

});

module.exports = {
    app
};

