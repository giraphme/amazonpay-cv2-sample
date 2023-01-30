## Setup 

Amazon Pay Seller のインテグレーションセントラルから下記を取得し、適宜配置。

- Public Key ID
  - .env の `AMAZON_PAY_PUBLIC_KEY_ID`
- プライベートキー
  - .env の `AMAZON_PAY_STORE_ID`
- Store ID
 - `./private.pem` に配置

## リクエストサンプル

```bash
$ npm i
$ npm run dev
```

### generateButton

```bash
$  curl -X GET 'http://localhost:4000/generate-button?callbackUrl=http://localhost:3000/checkout/amazonpay'
```

