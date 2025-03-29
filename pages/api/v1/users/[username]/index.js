import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/users.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOnebyUsername(username);
  return response.status(200).json(userFound);
}
