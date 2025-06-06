const { createSNICallback } = require('anchor-pki/auto-cert/sni-callback');
const { TermsOfServiceAcceptor } = require('anchor-pki/auto-cert/terms-of-service-acceptor');
const https = require('node:https');
const app = require('./server.js');

const SNICallback = createSNICallback({
  name: 'sni-callback',
  tosAcceptors: TermsOfServiceAcceptor.createAny(),
  cacheDir: 'tmp/acme',
  allowIdentifiers: ['otbivnushka.lcl.host'],
  directoryUrl: ['https://acme-v02.api.letsencrypt.org/directory']
});

https.createServer({SNICallback}, app).
  listen(80);