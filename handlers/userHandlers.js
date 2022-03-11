function usersGetHandlers(client) {
  client.response.end('get');
}

function usersPostHandler(client) {
  client.response.end('post');
}

export { usersGetHandlers, usersPostHandler };
