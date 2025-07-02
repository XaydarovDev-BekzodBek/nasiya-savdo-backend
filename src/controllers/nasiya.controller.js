const nasiyaModel = require("../models/nasiya.model");

const create = (type) => async (req, res) => {
  try {
    const { username, phone, products } = req.body;
    const oldUser = await nasiyaModel.findOne({ username, phone });
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const totalDebt = totalPrice;
    if (!oldUser) {
      const newNasiya = new nasiyaModel({
        username,
        phone,
        type,
        purchases: [
          {
            date: new Date(),
            products: products.map((p) => ({
              ...p,
              totalPrice: p.price * p.quantity,
              debt: p.price * p.quantity,
              paid: [],
            })),
            totalQuantity,
            totalPrice,
            totalDebt,
          },
        ],
      });

      await newNasiya.save();
      return res
        .status(201)
        .json({ message: `${type} created`, success: true, [type]: newNasiya });
    } else {
      if (oldUser.type !== type) {
        return res.status(404).json({
          success: false,
          message: `${type} not found`,
        });
      }
      oldUser.purchases.push({
        date: new Date(),
        products: products.map((p) => ({
          ...p,
          totalPrice: p.price * p.quantity,
          debt: p.price * p.quantity,
          paid: [],
        })),
        totalQuantity,
        totalPrice,
        totalDebt,
      });
      await oldUser.save();
      return res
        .status(200)
        .json({ message: "ok", success: true, [type]: oldUser });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const findAll = (type) => async (req, res) => {
  try {
    const datas = await nasiyaModel.aggregate([
      { $match: { type } },
      { $unwind: "$purchases" },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          phone: { $first: "$phone" },
          purchases: { $push: "$purchases" },
          createdAt: { $first: "$createdAt" },
          totalDebt: { $sum: "$purchases.totalDebt" },
        },
      },
    ]);

    return res
      .status(200)
      .json({ success: true, message: "list of data", datas });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const findOne = (type) => async (req, res) => {
  try {
    let nasiya = await nasiyaModel.findById(req.params.id);
    if (!nasiya || nasiya.type !== type) {
      return res
        .status(404)
        .json({ success: true, message: `${type} not found` });
    }

    const totalQuantity = nasiya.purchases.reduce(
      (a, b) => a + b.totalQuantity,
      0
    );

    const totalDebt = nasiya.purchases.reduce((a, b) => a + b.totalDebt, 0);
    const totalPrice = nasiya.purchases.reduce((a, b) => a + b.totalPrice, 0);

    return res.status(200).json({
      success: true,
      message: `${type} found`,
      [type]: { ...nasiya._doc,purchases:nasiya.purchases.reverse(), totalQuantity, totalPrice, totalDebt },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const update = (type) => async (req, res) => {
  try {
    const { username, phone, products } = req.body;

    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const totalDebt = totalPrice;

    const nasiya = await nasiyaModel.findByIdAndUpdate(
      req.params.id,
      {
        username,
        phone,
        purchases: [
          {
            date: new Date(),
            products: products.map((p) => ({
              ...p,
              totalPrice: p.price * p.quantity,
              debt: p.price * p.quantity,
              paid: [],
            })),
            totalQuantity,
            totalPrice,
            totalDebt,
          },
        ],
      },
      { new: true }
    );

    if (!nasiya || nasiya.type !== type) {
      return res.status(404).json({
        success: false,
        message: `${type} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${type} updated`,
      [type]: nasiya,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const destroy = (type) => async (req, res) => {
  try {
    const nasiya = await nasiyaModel.findByIdAndDelete(req.params.id);

    if (!nasiya || nasiya.type !== type) {
      return res.status(404).json({
        success: false,
        message: `${type} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${type} deleted`,
      [type]: nasiya,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { create, findAll, findOne, update, destroy };
