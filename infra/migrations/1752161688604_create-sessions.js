exports.up = (pgm) => {
  pgm.createTable("sessions", {
    id: {
      type: "uuid",
      primeryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    token: {
      type: "varchar(96)", // Why 96 in length? Facebook's access token is 64 characters long.
      notNull: true,
      unique: true,
    },

    user_id: {
      type: "uuid",
      notNull: true,
    },

    //Why timestamp with timezone? https://justathoughts.com/2020/01/14/why-use-timestamp-with-timezone/
    expires_at: {
      type: "timestamptz",
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
