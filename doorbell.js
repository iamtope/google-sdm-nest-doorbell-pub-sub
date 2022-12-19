/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const subscriptionNameOrId = 'YOUR_SUBSCRIPTION_NAME_OR_ID';
// const timeout = 60;

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");
const axios = require("axios");

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1049628783847690249/xEGoZcvfkqAPiA_Imy-HDi_eP82hjskO-lWFppsCxq2x2vB9IsFym0K78c4x4aQTtpaM";

// Creates a client; cache this for further use
const pubSubClient = new PubSub();
const subscription = pubSubClient.subscription(
  "projects/kisi-personal/subscriptions/sub1"
);
function listenForMessages() {
  // References an existing subscription

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    const discordMessage = {
      content:
        `doorbell has been pressed. Number of times doorbell has been pressed so far: ${messageCount}`,
    };

    axios
      .post(WEBHOOK_URL, discordMessage)
      .then(function (response) {
        console.log("sent successfully");
      })
      .catch(function (error) {
        console.log(error);
      });

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on("message", messageHandler);
  console.log(`Listening for messages on ${subscription.name}`);

  // setTimeout(() => {
  //   subscription.removeListener("message", messageHandler);
  //   console.log(`${messageCount} message(s) received.`);
  // }, 60 * 1000);
}

function listenForErrors() {
  // Create an event handler to handle messages
  const messageHandler = function (message) {
    // Do something with the message
    console.log(`Message: ${message}`);

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Create an event handler to handle errors
  const errorHandler = function (error) {
    // Do something with the error
    console.error(`ERROR: ${error}`);
    throw error;
  };

  // Listen for new messages/errors until timeout is hit
  subscription.on("message", messageHandler);
  subscription.on("error", errorHandler);

  setTimeout(() => {
    subscription.removeListener("message", messageHandler);
    subscription.removeListener("error", errorHandler);
  }, 60 * 1000);
}

// listenForErrors();

listenForMessages();
