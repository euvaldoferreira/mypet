import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import users from "models/users.js";

const router = createRouter();

//router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

/*
async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}
*/
async function postHandler(request, response) {
  const userInputValues = request.body;
  const newUser = await users.create(userInputValues);
  return response.status(201).json(newUser);
}
