import crypto from 'crypto';
import _omit from 'lodash/object/omit';

export default class ShopifyAPI {
  constructor(config) {
    this.config = config;
    this.baseUrl = 'https://' + this.config.domain;
    this.reqHeaders = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-shopify-access-token': this.config.token
    }
  }

  get(resource, queryObj) {
    let reqSettings = { method: 'GET', this.reqHeaders }
    let query = querystring.stringify(queryObj);

    return fetch(this.baseUrl + resource + query, { reqSettings });
  }
  post(resource) {
    let reqSettings = { method: 'POST', this.reqHeaders }

    return fetch(this.baseUrl + resource, { reqSettings });
  }
  put(resource) {
    let reqSettings = { method: 'PUT', this.reqHeaders };

    return fetch(this.baseUrl + resource, { reqSettings });
  }
  delete(resource) {
    let reqSettings = { method: 'DELETE', this.reqHeaders }

    return fetch(this.baseUrl + resource, { reqSettings });
  }
  validateSignature(query) {
    let queryObj = _omit(query, ['hmac', 'signature']);
    let queryStr = querystring.stringify(queryObj);

    let digest = crypto.createHmac('sha256', this.config.secret)
      .update(queryStr)
      .digest('hex');

    return query.hmac === digest;
  }
  verifyWebhook(body, hmac) {
    let digest = crypto.createHmac('sha256', this.config.secret)
      .update(body)
      .digest('base64')

    return hmac === digest;
  }
}
