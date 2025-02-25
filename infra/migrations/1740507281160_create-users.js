exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primeryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    //for reference, GitHub limits usernames to 39 characters
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    //Why 254 in length? https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    //Why 60 in length? https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    //Why timestamp with timezone? https://justathoughts.com/2020/01/14/why-use-timestamp-with-timezone/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
