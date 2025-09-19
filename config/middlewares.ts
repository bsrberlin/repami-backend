module.exports = ({ env }) => [
  'strapi::logger',
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: { "script-src": ["'self'", "'unsafe-inline'", "maps.googleapis.com", "http://localhost:1337"] },
      },
    },
  },
  'strapi::poweredBy',
  {
    name: 'strapi::cors',
    config: {
      headers: '*',
      origin: env("STRAPI_ORIGIN") ?? ["*"]
    }
  },
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
