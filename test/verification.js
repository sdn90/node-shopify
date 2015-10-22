import expect from "expect";
import ShopifyAPI from "./../src/index";

describe("verification", () => {
  it("should verify API requests", () => {
    const Shopify = new ShopifyAPI({
      shop: "some-shop.myshopify.com",
      secret: "hush"
    });

    let req = {
      shop: "some-shop.myshopify.com",
      code: "a94a110d86d2452eb3e2af4cfb8a3828",
      timestamp: "1337178173",
      signature: "6e39a2ea9e497af6cb806720da1f1bf3",
      hmac: "2cb1a277650a659f1b11e92a4a64275b128e037f2c3390e3c8fd2d8721dac9e2"
    };

    let isValid = Shopify.verifySignature(req);

    expect(isValid).toBe(true);
  });
});
