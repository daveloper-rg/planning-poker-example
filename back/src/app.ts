import { createApp, createSocketServer } from 'core/servers';
import { envConstants } from 'core/constants';
import { roomApi } from 'pods/room';
import { connectToDB } from 'core/db';
import colors from 'colors';
import { messageSocketEvents } from 'pods/messages';

const app = createApp();

app.use(envConstants.API_URL, roomApi);

app.listen(envConstants.PORT, async () => {
  if (!envConstants.isMockRepository && envConstants.MONGODB_URI) {
    await connectToDB(envConstants.MONGODB_URI);
  }
  const database = envConstants.isMockRepository ? 'Mock' : 'MongoDB';
  console.log(`Using ${colors.cyan(database)} to storage sessions`);
  console.log(
    `Server ready at ${colors.cyan(
      `http://localhost:${envConstants.PORT}${envConstants.API_URL}`
    )}`
  );
});

const socketServer = createSocketServer(app, messageSocketEvents);

socketServer.listen(envConstants.SOCKET_PORT, () => {
  console.log(
    `Sockets listening on port: ${colors.green(envConstants.SOCKET_PORT)}`
  );
});
