import user from "models/user.js";
import password from "models/password";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

async function getAuthenticateUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail, providedPassword);
    await validatePassword(providedPassword, storedUser.password);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Authentication data does not match.",
        action: "Check that the data sent is correct.",
      });
    }
    throw error;
  }
  async function findUserByEmail(providedEmail) {
    let storedUser;
    try {
      storedUser = await user.findOnebyEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new UnauthorizedError({
          message: "Email does not match.",
          action: "Check the sent email.",
        });
      throw error;
    }
    return storedUser;
  }

  async function validatePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Password does not match.",
        action: "Check the sent password.",
      });
    }
  }
}

const authentication = {
  getAuthenticateUser,
};

export default authentication;
