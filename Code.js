/**
 * Loads a message into BigQuery
 */
function postMessage(message) {
  var url = 'https://us-central1-tinobot.cloudfunctions.net/app/api/message';

  var payload = {
    message: message
  };

  var options = {
    method: 'POST',
    payload: payload,
    followRedirects: true,
    muteHttpExceptions: true
  };

  var result = UrlFetchApp.fetch(url, options);

  if (result.getResponseCode() == 200) {
    var params = JSON.parse(result.getContentText());

    return;
  }
}

function getMessage() {
  var url = 'https://us-central1-tinobot.cloudfunctions.net/app/api/message';

  var options = {
    method: 'GET',
    followRedirects: true,
    muteHttpExceptions: true
  };

  var result = UrlFetchApp.fetch(url, options);

  Logger.log(result);

  if (result.getResponseCode() == 200) {
    var params = JSON.parse(result.getContentText());

    return params[0].message;
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

  if (event.message.sender.displayName === 'Constantino Nuzzo') {
    postMessage(message);
  }

  if (event.message.annotations[0].userMention.user.displayName == 'tinobot') {
    var randomSaying = getMessage();
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
