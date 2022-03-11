import http from 'http';
/*
    [
        {
            path:string
            handlers:
            {
                GET|POST: Function
            }
        }
    ]
*/

/**
 * @typedef HttpClient
 * @type {Object}
 * @property {http.IncomingMessage} request
 * @property {http.ServerResponse} response
 * @property {Object| Array} [body]
 * @property {URLSearchParams} [params]
 */

/**
 * @callback CallbackRequestHandler
 * @param {HttpClient} client
 * @return {void}
 */

export class Router {
  /**
   * @type {{path:string,handlers:Array.<{method:string,handler:CallbackRequestHandler}>}[]}
   */
  #endpoints;

  constructor() {
    this.#endpoints = [];
  }

  /**
   * @param {string} httpMethod
   * @param {string} path
   * @param {CallbackRequestHandler} handler
   * @return void
   */
  #request(httpMethod, path, handler) {
    let endpoint = null;
    let handlers = [];
    for (endpoint of this.#endpoints) {
      if (endpoint.path === path && typeof endpoint.handlers[httpMethod] === 'function') {
        throw new Error(`Method ${httpMethod} exists by path ${path}`);
      }
    }

    handlers.push({ method: httpMethod, handler });
    this.#endpoints.push({ path, handlers });
  }

  getEndpoints() {
    return this.#endpoints;
  }

  /**
   * @param {string} path
   * @param {CallbackRequestHandler} handler
   * @return void
   */
  get(path, handler) {
    this.#request('GET', path, handler);
  }

  /**
   * @param {string} path
   * @param {CallbackRequestHandler} handler
   * @returns void
   */
  post(path, handler) {
    this.#request('POST', path, handler);
  }
}
