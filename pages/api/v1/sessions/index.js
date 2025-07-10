import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import authentication from "models/authentication.js";
import session from "models/session.js";
import * as cookie from "cookie";

const router = createRouter();

//router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const authenticatedUser = await authentication.getAuthenticateUser(
    userInputValues.email,
    userInputValues.password,
  );

  const newSession = await session.create(authenticatedUser.id);

  const setCookie = cookie.serialize("session_id", newSession.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    path: "/",
  });
  response.setHeader("Set-Cookie", setCookie);

  return response.status(201).json(newSession);
}
