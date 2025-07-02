const {z} = require("zod")

const AuthSchema = z.object({
  login: z.string(),
  password: z.string(),
});


module.exports = {AuthSchema}