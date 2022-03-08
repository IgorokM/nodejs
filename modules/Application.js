import http from 'http';

export class Application {
    /** @property {object | array} */
    #body;

    /** @property {number} */
    #port;

    /** @property {http.Server} */
    #server;

    /** @property {boolean} */
    #isDevEnv;

    constructor() {
        this.#body = null;
        this.#port = Number(process.env.PORT) || 3000;
        this.#server = this.#createServer();
        this.#isDevEnv = process.env.NODE_ENV === 'development';
    }

    #createServer() {
        return http.createServer((req, res) => this.#serverHandler(req, res));
    }
    listen() {
        this.#server.listen(this.#port, () => console.log(`server started on port: ${this.#port}`));
    }

    /**
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse} res
     */
    async #serverHandler(req, res) {
        if (req.method === 'POST') {
            await this.#readBody(req);
            res.end();
        } else {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.statusCode = 401;
            res.end('Request Method Invalid');
        }

    }

    async #readBody(req) {
        const buffers = [];
        let body = null;
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        body = JSON.parse(Buffer.concat(buffers).toString());
        console.log(body);
    }
}