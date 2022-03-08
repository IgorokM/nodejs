import http from 'http';

export class Application {
    #body;
    #port;
    #server;
    constructor() {
        this.#body = null;
        this.#port = process.env.PORT || 3000;
        this.#server = this.#createServer();
    }

    #createServer() {
        return http.createServer(async (req, res) => {
            if (req.method === 'POST') {
                await this.#readBody(req);
            }

            res.end();
        });
    }
    listen() {
        this.#server.listen(this.#port, () => console.log(`server started on port: ${this.#port}`));
    }

    async #readBody(req) {
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        this.#body = Buffer.concat(buffers).toString();
    }
}