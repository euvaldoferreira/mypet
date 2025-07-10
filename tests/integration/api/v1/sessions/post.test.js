import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import session from "models/session";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/sessions", () => {
  describe("Anonymouse user", () => {
    test("With incorrect `email` but correct `password`", async () => {
      await orchestrator.createUser({
        password: "senha-correta",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "email.errado@tabcover.com",
          password: "senha-correta",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Authentication data does not match.",
        action: "Check that the data sent is correct.",
        status_code: 401,
      });
    });

    test("With correct `email` but incorrect `password`", async () => {
      await orchestrator.createUser({
        email: "email.correto@tabcover.com.br",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "email.correto@tabcover.com.br",
          password: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Authentication data does not match.",
        action: "Check that the data sent is correct.",
        status_code: 401,
      });
    });

    test("With incorrect `email` and incorrect `password`", async () => {
      await orchestrator.createUser();
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "email.incorreto@tabcover.com.br",
          password: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Authentication data does not match.",
        action: "Check that the data sent is correct.",
        status_code: 401,
      });
    });

    test("With correct `email` and correct `password`", async () => {
      const createdUser = await orchestrator.createUser({
        email: "tudo.correto@tabcover.com.br",
        password: "tudo-correto",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "tudo.correto@tabcover.com.br",
          password: "tudo-correto",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        user_id: createdUser.id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.token).toHaveLength(96);
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const expiresAt = new Date(responseBody.expires_at);
      const createdAt = new Date(responseBody.created_at);

      expiresAt.setMilliseconds(0);
      createdAt.setMilliseconds(0);
      expect(expiresAt - createdAt).toBe(session.EXPIRATION_IN_MILLISECONDS);

      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: responseBody.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        httpOnly: true,
        path: "/",
      });
    });
  });
});
