import { usersGetHandlers, usersPostHandler } from './handlers/userHandlers.js';
import { Router } from './lib/Router.js';

const router = new Router();

router.get('users', usersGetHandlers);

router.post('users', usersPostHandler);

export { router };
