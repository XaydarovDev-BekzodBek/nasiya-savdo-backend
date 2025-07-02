const { z } = require("zod");

const PaidSchema = z.object({
  paid: z.number(),
});

module.exports = { PaidSchema };
