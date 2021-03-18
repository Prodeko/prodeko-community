const session = require("express-session");
const querystring = require("querystring");
const axios = require("axios");
const ms = require("ms");

/**
 * Custom Directus endpoint to handle OAuth2 authentication with Prodeko's
 * Django backend.
 *
 * Executes a flow of redirecting users to log in to Prodeko OAuth, fetching
 * authentication tokens from OAuth2 provider, fetching data related to the
 * user account, mirroring it into a Directus account and authenticating said
 * account.
 */
module.exports = function registerEndpoint(
  router,
  { services, exceptions, database, env }
) {
  const config = {
    origin: env.PUBLIC_URL,
    prefix: "/custom/prodeko-auth",
  };

  // Map relevant .env variables to config object
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith("OAUTH_PRODEKO") === false) continue;

    // OAUTH_PRODEKO_<CONFIG_KEY> = value
    const parts = key.split("_");
    parts.splice(0, 2); // discart OAUTH_PRODEKO -prefix

    const configKey = parts.join("_").toLowerCase();
    config[configKey] = value;
  }

  const { InvalidQueryException } = exceptions;
  const { UsersService, AuthenticationService } = services;

  /** Checks whether an account with a given email address exists */
  async function emailHasAccount(email) {
    const user = await database("directus_users").where({ email }).first();
    return !!user;
  }

  /** Fetches a role id by its name */
  async function getRoleByName(name) {
    const role = await database("directus_roles").where({ name }).first();
    return role.id;
  }

  // When a user is directed to this url (/custom/prodeko-auth), begins the
  // authentication process
  router.get("/", (req, res) => {
    if (req.query?.redirect && req.session) {
      req.session.redirect = req.query.redirect;
    }

    const query = querystring.stringify({
      client_id: config.key,
      response_type: "code",
      redirect_uri: `${config.origin}${config.prefix}/authenticate`,
      scope: config.scope,
    });

    // First we request the user to sign in to their account in Prodeko OAuth to
    // receive an authorization code
    res.redirect(`${config.authorize_url}?${query}`);
  });

  // After OAuth sends us the code in a query parameter, we can use it to request
  // an authentication token
  router.get("/authenticate", async (req, res) => {
    const code = req.query.code;
    if (!code) {
      throw new InvalidQueryException("No code returned from Prodeko OAuth2");
    }

    const query = querystring.stringify({
      client_id: config.key,
      client_secret: config.secret,
      code,
      redirect_uri: `${config.origin}${config.prefix}/authenticate`,
      grant_type: "authorization_code",
    });

    const tokenResponse = await axios.post(`${config.access_url}`, query, {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const tokenData = tokenResponse.data;

    // With the token we can request the user's profile data
    const userResponse = await axios.get(`${config.profile_url}`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = userResponse.data;
    const email = userData.email;

    // If the email doesn't yet exist in Directus, we create a new user for
    // that email and authorize it with an appropriate role
    if (!(await emailHasAccount(email))) {
      const userService = new UsersService({ schema: req.schema });

      let role;
      if (userData.is_superuser) {
        role = await getRoleByName("Admin");
      } else if (userData.is_staff) {
        role = await getRoleByName("Editor");
      } else {
        role = await getRoleByName("Guild member");
      }

      await userService.create({
        email,
        status: "active",
        first_name: userData.first_name,
        last_name: userData.last_name,
        role,
      });
    }

    // Lastly, we authenticate the user as the new Directus user, so that
    // they can access protected endpoints in the CMS
    const authenticationService = new AuthenticationService({
      schema: req.schema,
    });
    const data = await authenticationService.authenticate({ email });

    res.cookie("directus_refresh_token", data.refreshToken, {
      httpOnly: true,
      domain: env.REFRESH_TOKEN_COOKIE_DOMAIN,
      maxAge: ms(env.REFRESH_TOKEN_TTL),
      secure: env.REFRESH_TOKEN_COOKIE_SECURE ?? false,
      sameSite: env.REFRESH_TOKEN_COOKIE_SAME_SITE || "strict",
    });

    return res.redirect(config.redirect_uri);
  });
};
