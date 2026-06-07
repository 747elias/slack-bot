require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/elias-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/elias-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/elias-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/elias-ping - Check bot latency
/elias-catfact - Get a cat fact
/elias-joke - Get a nice joke
/elias-duck - Get a random duck`
  });
});

app.command("/elias-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/elias-duck", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://random-d.uk/api/random");

    await respond({
      text: `🦆 Random Duck:\n${response.data.url}`
    });

  } catch (err) {
    await respond({
      text: "Failed to fetch a duck."
    });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();