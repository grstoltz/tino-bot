/**
 * Loads a message into BigQuery
 */
function loadMessage(message) {
  // Replace this value with the project ID listed in the Google
  // Cloud Platform project.
  var projectId = 'tinobot';
  // Create a dataset in the BigQuery UI (https://bigquery.cloud.google.com)
  // and enter its ID below.
  var datasetId = 'messages';

  // Create the table.
  var tableId = 'messages';

  function bigqueryInsertData(data, tableId) {
    var insertAllRequest = BigQuery.newTableDataInsertAllRequest();

    insertAllRequest.rows = [];

    var row1 = BigQuery.newTableDataInsertAllRequestRows();
    row1.json = {
      message: data
    };
    insertAllRequest.rows.push(row1);

    var response = BigQuery.Tabledata.insertAll(
      insertAllRequest,
      projectId,
      datasetId,
      tableId
    );
    if (response.insertErrors) {
      Logger.log(response.insertErrors);
    }
  }
  bigqueryInsertData(message, tableId);
}

function queryDataTable() {
  // Replace this value with the project ID listed in the Google
  // Cloud Platform project.
  var projectId = 'tinobot';

  var dataSetId = 'messages';
  var tableId = 'messages';

  var fullTableName = projectId + ':' + dataSetId + '.' + tableId;

  var queryRequest = BigQuery.newQueryRequest();
  queryRequest.query =
    'SELECT *, RAND() AS r FROM [' + fullTableName + '] ORDER BY r LIMIT 1;';
  var query = BigQuery.Jobs.query(queryRequest, projectId);

  if (query.jobComplete) {
    Logger.log(query.rows[0].f[0].v);
    return query.rows[0].f[0].v;
  }
}

/**
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onMessage(event) {
  Logger.log(event.message.sender.displayName);
  var message = event.message.text;
  // loadMessage(message);

  if (message === 'random') {
    var randomSaying = queryDataTable();
    return { text: randomSaying };
  } else {
    return;
  }
}
/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onAddToSpace(event) {
  var message = '';

  if (event.space.type == 'DM') {
    message =
      'Thank you for adding me to a DM, ' + event.user.displayName + '!';
  } else {
    message = 'Thank you for adding me to ' + event.space.displayName;
  }

  if (event.message) {
    // Bot added through @mention.
    message = message + ' and you said: "' + event.message.text + '"';
  }

  return { text: message };
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event) {
  console.info('Bot removed from ', event.space.name);
}
