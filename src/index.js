export default class ShopifyAPI {
  constructor(config) {
    this.config = config;
    this.baseUrl = 'https://' + this.config.domain + '/admin';
  }

  get(resource, queryObj) {
    let reqSettings = {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-shopify-access-token': this.config.token
      }
    }
    let query = querystring.stringify(queryObj);

    return fetch(this.baseUrl + resource + query, { reqSettings });
  }
  post(resource) {
    let reqSettings = {
      method: 'POST'
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-shopify-access-token': this.config.token
      }
    }

    return fetch(this.baseUrl + resource, { reqSettings });
  }
  put(resource) {
    let reqSettings = {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-shopify-access-token': this.config.token
      }
    };

    return fetch (this.baseUrl + resource, { reqSettings });
  }
  delete(resource) {
    let reqSettings = {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-shopify-access-token': this.config.token
      }
    }
  }


  static validateSignature(query) {}
  static verifyWebhook(query) {}

}
