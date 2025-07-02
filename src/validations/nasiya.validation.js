const { z } = require("zod");

const nasiyaSchema = z.object({
  username: z.string(),
  phone: z.string().min(9, { message: "minimalni raqam 9 bo`lishi kerak" }),
  products: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
});

module.exports = { nasiyaSchema };
