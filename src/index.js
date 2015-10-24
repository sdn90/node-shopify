import crypto from "crypto";
import _ from "lodash";
import fetch from "node-fetch";
import querystring from "querystring";
import chalk from "chalk";

const red = chalk.bold.red;

function validateConfig(config) {
  const requiredKeys = ["shop", "api_key", "secret", "scope", "redirect_uri"];
  let missingKeys = requiredKeys.filter(key => {
    if( _.has(config, key)) {
      return false;
    } else {
      return true;
    }
  }).join(", ");

  if (missingKeys.length > 0) {
    console.error(red(`Configuration error: Missing ${missingKeys}`));
    throw new Error(`Configuration error`);
  }
}

export default class ShopifyAPI {

  constructor(config) {
    validateConfig(config);
    this.config = config;
    this.baseURL = "https://" + this.config.shop;
    this.reqHeaders = {
      "accept": "application/json",
      "content-type": "application/json",
      "x-shopify-access-token": this.config.accessToken || ""
    };
  }

  get(resource, queryObj = {}) {
    let query = querystring.stringify(queryObj);

    return fetch(this.baseURL + resource + query, {
      method: "GET",
      headers: this.reqHeaders
    });
  }

  post(resource, body = {}) {
    return fetch(this.baseURL + resource, {
      method: "POST",
      body: JSON.stringify(body),
      headers: this.reqHeaders
    });
  }

  put(resource, body = {}) {
    return fetch(this.baseURL + resource, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: this.reqHeaders
    });
  }

  delete(resource) {
    return fetch(this.baseURL + resource, {
      method: "DELETE",
      headers: this.reqHeaders
    });
  }

  authURL() {
    let queryObj = {
      clientID: this.config.key,
      scope: this.config.scope,
      redirectURI: this.config.redirectURI
    };
    let queryStr = querystring.stringify(queryObj);
    return `${this.baseURL}/admin/oauth/authorize?${queryStr}`;
  }

  verifySignature(query) {
    let sortedParams = _.chain(query)
      .omit(["hmac", "signature"])
      .pairs()
      .sort()
      .map(item => item.join("="))
      .join("&")
      .value();

    let digest = crypto.createHmac("sha256", this.config.secret)
      .update(sortedParams)
      .digest("hex");

    return query.hmac === digest;
  }

  verifyWebhook(body, hmac) {
    let digest = crypto.createHmac("sha256", this.config.secret)
    .update(body)
    .digest("base64");

    return hmac === digest;
  }

  verifyProxySignature(query) {
    let sortedParams = _.chain(query)
      .omit(["signature"])
      .pairs()
      .sort()
      .map(item => item.join("="))
      .join("")
      .value();

    let calculatedSignature = crypto.createHmac("sha256", this.config.secret)
      .update(sortedParams)
      .digest("hex");

    return calculatedSignature === query.signature;
  }

}

