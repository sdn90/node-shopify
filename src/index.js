import crypto from "crypto";
import _ from "lodash";
import fetch from "node-fetch";
import querystring from "querystring";

export default class ShopifyAPI {

  constructor(config) {
   this.config = config;
    this.baseUrl = "https://" + this.config.domain;
    this.reqHeaders = {
      "accept": "application/json",
      "content-type": "application/json",
      "x-shopify-access-token": this.config.accessToken || ""
    };
  }

  get(resource, queryObj = {}) {
    let query = querystring.stringify(queryObj);

    return fetch(this.baseUrl + resource + query, {
      method: "GET",
      headers: this.reqHeaders
    });
  }

  post(resource, body = {}) {
    return fetch(this.baseUrl + resource, {
      method: "POST",
      body: JSON.stringify(body),
      headers: this.reqHeaders
    });
  }

  put(resource, body = {}) {
    return fetch(this.baseUrl + resource, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: this.reqHeaders
    });
  }

  delete(resource) {
    return fetch(this.baseUrl + resource, {
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

  validateSignature(query) {
    let queryStr = querystring.stringify(
      _.omit(query, ["hmac", "signature"])
    );
    let digest = crypto.createHmac("sha256", this.config.secret)
      .update(queryStr)
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
      .map(item => { return item.join("="); })
      .join("")
      .value();

    let calculatedSignature = crypto.createHmac("sha256", this.config.secret)
      .update(sortedParams)
      .digest("hex");

    return calculatedSignature === query.signature;
  }

}

