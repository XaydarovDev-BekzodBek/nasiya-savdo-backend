const nasiyaModel = require("../models/nasiya.model");

const create = (type) => async (req, res) => {
  try {
    const { username, phone, products } = req.body;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const oldNasiya = await nasiyaModel.findOne({
      username,
      phone,
      type
    });
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const totalDebt = totalPrice;
    if (!oldNasiya) {
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
    
      const todayNasiya = oldNasiya.purchases.find(
        (i) => i.date >= todayStart && i.date <= todayEnd
      );
      if (!todayNasiya) {
        oldNasiya.purchases.push({
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
      } else {
        todayNasiya.products.push(
          ...products.map((p) => ({
            ...p,
            totalPrice: p.price * p.quantity,
            debt: p.price * p.quantity,
            paid: [],
          }))
        );
        todayNasiya.totalQuantity = totalQuantity + todayNasiya.totalQuantity;
        todayNasiya.totalPrice = totalPrice + todayNasiya.totalPrice;
        todayNasiya.totalDebt = totalDebt + todayNasiya.totalDebt;
      }
      await oldNasiya.save();
      return res
        .status(201)
        .json({ message: "ok", success: true, [type]: oldNasiya });
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
      [type]: {
        ...nasiya._doc,
        purchases: nasiya.purchases.reverse(),
        totalQuantity,
        totalPrice,
        totalDebt,
      },
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

const updatePurchase = (type) => async (req, res) => {
  try {
    const { id, purchaseId } = req.params;
    const { products } = req.body;

    const nasiya = await nasiyaModel.findById(id);
    if (!nasiya || nasiya.type !== type) {
      return res.status(404).json({ message: `${type} not found` });
    }

    const purchase = nasiya.purchases?.find(
      (i) => String(i._id) === purchaseId
    );

    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const totalDebt = totalPrice;

    purchase.products = products;
    purchase.totalDebt = totalDebt;
    purchase.totalQuantity = totalQuantity;
    purchase.totalPrice = totalPrice;
    purchase.date = new Date();
    await nasiya.save();
    return res.status(200).json({
      success: true,
      message: `${type} updated`,
      [type]: nasiya,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { create, findAll, findOne, update, destroy, updatePurchase };
