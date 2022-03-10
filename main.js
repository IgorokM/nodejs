import { Application } from "./modules/Application.js";
import { router } from './mainRouters.js';

const app = new Application();

app.addRouter(router);

app.listen();