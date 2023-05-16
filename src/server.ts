
import { app } from "./app"

const port = app.get("port")

const server = app.listen(port, onListening)
server.on("error", onError)

function onError(error: NodeJS.ErrnoException) {
    throw error
}

function onListening() {
    const addr = server.address();
    const binding = typeof addr === 'string'
        ? `pipe/socket ${addr}`
        : `port ${addr?.port}`;
    console.log(`🚀 Server listening on ${binding}`);
}

