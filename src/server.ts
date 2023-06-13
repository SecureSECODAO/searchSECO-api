/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


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
    console.log(`ðŸš€ Server listening on ${binding}`);
}

