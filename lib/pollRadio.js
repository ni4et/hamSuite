const { get } = require('http');
const net = require('net');

(function () {
  console.log('pollradio.js');
});
const SERVERS = [
  { host: 'sam', port: 4532 },
  { host: 'sam', port: 4533 },
  // Add more servers as needed
];
const QUERIES = [
  { type: 'TX', set: 'T', get: 't' },
  { type: 'Frequency', set: 'set_freq', get: 'f' },
  { type: 'Mode', set: 'set_mode', get: 'm' },
  {
    type: 'Power',
    get: 'l RFPOWER_METER_WATTS',
  },
  { type: 'SWR', get: 'l SWR' },
];

const clients = [];

SERVERS.forEach((serverInfo, idx) => {
  const client = new net.Socket();
  client.counter = 0;
  client.decoded = [];

  client.connect(serverInfo.port, serverInfo.host, () => {
    console.log(`Connected to: ${serverInfo.host}:${serverInfo.port}`);
    pollServer(client);
  });

  client.on('data', (data) => {
    tmp = data.toString();
    //stmp = tmp.split(/s/);
    stmp = tmp.match(QUERIES[client.counter - 1].re);
    // console.log(
    //   `Received from ${serverInfo.host}:${serverInfo.port},${
    //     client.counter - 1
    //   }:${tmp}:`,
    //   stmp[0]
    // );

    //console.log(stmp[0], " ");
    tmp = tmp.trim();
    //console.log(tmp.split(/\n/));
    client.decoded.push(tmp.split(/\n/));
    pollServer(client);

    // Send a response back to the same server socket
    //client.write("Reply to your message\n");
  });

  client.on('close', () => {
    console.log(`Connection closed: ${serverInfo.host}:${serverInfo.port}`);
  });

  client.on('error', (err) => {
    console.error(`Socket error (${serverInfo.host}:${serverInfo.port}):`, err);
  });

  clients.push(client);
});

function pollServer(client) {
  // Replace 'POLL_COMMAND' with the actual command or data to poll the server

  if (client.counter >= QUERIES.length) {
    console.log(client.decoded.flat());

    client.counter = 0;
    client.decoded = [];

    // Poll every 5 seconds
    setTimeout(() => pollServer(client), 1000);
  } else {
    //console.log(QUERIES[client.counter].get, "\n");
    client.write(QUERIES[client.counter].get + '\r\n');
    //client.write("f\n");

    client.counter++;
    //pollServer(client);
  }
}
