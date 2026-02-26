require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
app.use(express.json());

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.login(process.env.DISCORD_TOKEN);

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);
}); //Used for debug/verification purposes


app.post('/github-webhook', async (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    const channel = await client.channels.fetch(process.env.CHANNEL_ID);

    if (event === 'pull_request' && payload.action === 'opened') {
        await channel.send(
            `New Pull Request!\n` +
            `Title: ${payload.pull_request.title}\n` +
            `By: ${payload.pull_request.user.login}\n` +
            `URL: ${payload.pull_request.html_url}`
        );
    }

    if (event === 'push') {
        await channel.send(
            `New Push to ${payload.ref}\n` +
            `By: ${payload.pusher.name}`
        );
    }

    res.status(200).send('OK');
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});