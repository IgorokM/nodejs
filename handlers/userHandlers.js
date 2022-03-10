function usersGetHandlers(client) {
  client.response.end();
}

function usersPostHandler(client) {
  client.response.end();
}

export { usersGetHandlers, usersPostHandler };
