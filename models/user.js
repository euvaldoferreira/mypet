import { ValidationError, NotFoundError } from "infra/errors.js";
import password from "models/password.js";
import database from "infra/database.js";

async function findOnebyUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        LOWER(username) = LOWER($1)
      LIMIT 
        1
      ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "User not found.",
        action: "Try another username.",
      });
    }
    return results.rows[0];
  }
}

async function findOnebyEmail(email) {
  const userFound = await runSelectQuery(email);

  return userFound;

  async function runSelectQuery(email) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        LOWER(email) = LOWER($1)
      LIMIT 
        1
      ;`,
      values: [email],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "User not found.",
        action: "Try another email.",
      });
    }
    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueUserName(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3) 
      RETURNING 
      *;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOnebyUsername(username);

  if ("username" in userInputValues) {
    if (
      currentUser.username.toLowerCase() !==
      userInputValues.username.toLowerCase()
    ) {
      await validateUniqueUserName(userInputValues.username);
    }
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }
  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
      UPDATE 
        users 
      SET 
        username = $2, 
        email = $3, 
        password = $4,
        updated_at = timezone('UTC', now())
      WHERE 
        id = $1
      RETURNING 
        *
      ;`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });
    return results.rows[0];
  }
}

async function validateUniqueUserName(username) {
  const results = await database.query({
    text: `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        LOWER(username) = LOWER($1);`,
    values: [username],
  });
  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "This username is already in use.",
      action: "Try another username.",
    });
  }
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        LOWER(email) = LOWER($1);`,
    values: [email],
  });
  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "This email is already in use.",
      action: "Try another email.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOnebyUsername,
  findOnebyEmail,
  update,
};

export default user;
