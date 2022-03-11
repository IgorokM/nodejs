import http from 'http';
import EventEmitter from 'events';
import { Router } from './Router.js';
import { URLSearchParams } from 'url';

export class Application {
  /** @type {*} */
  #body;

  /** @type {number} */
  #port;

  /** @type {http.Server} */
  #server;

  /** @type {boolean} */
  #isDevEnv;

  /** @type {EventEmitter} */
  #emitter;

  /** @type {URLSearchParams} */
  #params;

  constructor() {
    this.#body = undefined;
    this.#emitter = new EventEmitter();
    this.#port = Number(process.env.PORT) || 3000;
    this.#server = this.#createServer();
    this.#isDevEnv = process.env.NODE_ENV === 'development';
  }

  /**
   * @param {Router} router
   */
  addRouter(router) {
    const endpoints = router.getEndpoints();
    for (let endpoint of endpoints) {
      for (let handler of endpoint.handlers) {
        const eventName = this.#getRouteMask(endpoint.path, handler.method);
        this.#emitter.on(eventName, (request, response) => {
          handler.handler({ request, response, body: this.#body, params: this.#params });
          this.#body = undefined;
        });
      }
    }
  }

  /**
   * @param {string} path
   * @param {string} httpMethod
   * @return {string}
   */
  #getRouteMask(path, httpMethod) {
    const root = path.replace(/\//g, '');
    return `[${root}]:[${httpMethod}]`;
  }

  /** @return {http.Server} */
  #createServer() {
    return http.createServer((req, res) => this.#serverHandler(req, res));
  }

  /**@return void */
  listen() {
    this.#server.listen(this.#port, () => console.log(`server started on port: ${this.#port}`));
  }

  /**
   * @async
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @return void
   */
  async #serverHandler(req, res) {
    let eventName = '';
    if (req.method === 'POST') {
      await this.#readBody(req);
    }

    if (req?.url && req?.method) {
      await this.#createGetParams(req.url);
      eventName = this.#getRouteMask(req.url, req.method);
    }
    /** @event [url]:[method] */
    const emitted = this.#emitter.emit(eventName, req, res);
    if (!emitted) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<html><head></head><body><h1>Not Found</h1></body></html>');
    }
  }

  /**
   * @async
   * @param {string} url
   */
  async #createGetParams(url) {
    const getParams = url.split('?');
    if (Array.isArray(getParams) && getParams[1]) {
      this.#params = new URLSearchParams(getParams[1]);
    }
  }

  /**
   * @async
   * @param {http.IncomingMessage} req
   * */
  async #readBody(req) {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    this.#body = JSON.parse(Buffer.concat(buffers).toString());
  }
}
