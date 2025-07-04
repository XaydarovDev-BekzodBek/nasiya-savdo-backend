const { model, Schema } = require("mongoose");

const nasiyaSchema = new Schema(
  {
    username: { type: String },
    phone: { type: String },
    purchases: [
      {
        products: [
          {
            name: String,
            quantity: Number,
            price: Number,
            totalPrice: Number,
            debt: Number,
            paid: [{ price: Number, createdAt: Date }],
            date: { type: Date, default: Date.now },
          },
        ],
        totalQuantity: Number,
        totalDebt: Number,
        totalPrice: Number,
        date: Date,
      },
    ],
    type: { type: String, enum: ["usta", "klient"] },
  },
  { timestamps: true }
);

const nasiyaModel = model("nasiya", nasiyaSchema);

module.exports = nasiyaModel;
