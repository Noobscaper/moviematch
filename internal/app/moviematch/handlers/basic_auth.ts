import { Response, ServerRequest } from "http/server.ts";
import { BasicAuth } from "/types/moviematch.d.ts";
import { getConfig } from "/internal/app/moviematch/config.ts";
import { RouteHandler } from "../types.ts";

export const isAuthorized = (
  basicAuth: BasicAuth,
  req: ServerRequest,
): boolean => {
  const auth = req.headers.get("Authorization");
  const { userName, password } = basicAuth;

  if (auth === `Basic ${btoa(`${userName}:${password}`)}`) {
    return true;
  }

  return false;
};

export const respondRequiringAuth = (): Response => {
  return {
    headers: new Headers([
      ["WWW-Authenticate", 'Basic realm="MovieMatch", charset="UTF-8"'],
    ]),
    status: 401,
  };
};

export const handler: RouteHandler = (req) => {
  const config = getConfig();

  if (!config.basicAuth || isAuthorized(config.basicAuth, req)) {
    return Promise.resolve();
  }

  return Promise.resolve(respondRequiringAuth());
};
