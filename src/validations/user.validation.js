const { z } = require("zod");

const userSchema = z.object({
  username: z.string().optional(),
  login: z.string().optional(),
  password: z.string(),
});

module.exports = { userSchema };
