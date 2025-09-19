// Email Template passwort vergessen admin dashboard
const forgotPasswordTemplate = {
  subject: `Passwort zurücksetzen`,
  html: `<p>Wir haben gehört, dass Sie Ihr Passwort verloren haben. Das tut uns leid!</p>

  <p>Aber keine Sorge! Sie können den folgenden Link verwenden, um Ihr Passwort zurückzusetzen:</p>
  <p><a href="<%= url %>"><%= url %></a></p>

  <p>Danke.</p>`,
  text: `Wir haben gehört, dass Sie Ihr Passwort verloren haben. Das tut uns leid!

  Aber keine Sorge! Sie können den folgenden Link verwenden, um Ihr Passwort zurückzusetzen:
  <%= url %>

  Danke.`,
}

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
  forgotPassword: {
    emailTemplate: forgotPasswordTemplate
  }
});
