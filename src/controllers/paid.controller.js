const nasiyaModel = require("../models/nasiya.model");

const paidProduct = async (req, res) => {
  try {
    const { id, purchasesId, productId } = req.params;
    const { paid } = req.body;

    const nasiya = await nasiyaModel.findById(id);

    if (!nasiya) {
      return res
        .status(404)
        .json({ success: false, message: "Nasiya not found" });
    }

    const purchase = nasiya.purchases.find(
      (i) => String(i._id) === purchasesId
    );
    purchase.products = purchase.products.map((i) => {
      if (String(i._id) === productId) {
        i.paid.unshift({ price: paid });
        i.debt = i.debt - paid;
        return { ...i };
      }

      return i;
    });

    await nasiya.save();

    return res.status(200).json({
      success: true,
      message: "Paid",
      nasiya,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const paidPurchase = async (req, res) => {
  try {
    const { id, purchaseId } = req.params;
    let { paid } = req.body;

    const nasiya = await nasiyaModel.findById(id);

    if (!nasiya) {
      return res
        .status(404)
        .json({ success: false, message: "Nasiya not found" });
    }

    const purchase = nasiya.purchases.find((i) => {
      return String(i._id) == purchaseId;
    });
    if (!purchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    for (let product of purchase.products) {
      if (paid <= 0) break;

      const currentDebt = product.debt || 0;

      if (currentDebt > 0) {
        const payment = Math.min(currentDebt, paid);
        product.paid.unshift({
          price: payment,
          createdAt: new Date(),
        });
        product.debt = currentDebt - payment;
        paid -= payment;
      }
    }

    purchase.totalDebt = purchase.products.reduce(
      (sum, p) => sum + (p.debt || 0),
      0
    );

    await nasiya.save();

    return res.status(200).json({
      success: true,
      message: "Paid",
      nasiya,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const paidNasiya = async (req, res) => {
  try {
    const { id } = req.params;
    let { paid } = req.body;

    const nasiya = await nasiyaModel.findById(id);

    if (!nasiya) {
      return res
        .status(404)
        .json({ success: false, message: "Nasiya not found" });
    }



    for (let purchase of nasiya.purchases) {
      if (paid <= 0) break;

      for (let product of purchase.products) {
        const currentDebt = product.debt || 0;

        if (currentDebt > 0 && paid > 0) {
          const payment = Math.min(currentDebt, paid);

          product.paid.unshift({
            price: payment,
            createdAt: new Date(),
          });

          product.debt = currentDebt - payment;
          paid -= payment;
        }
      }

      purchase.totalDebt = purchase.products.reduce(
        (sum, p) => sum + (p.debt || 0),
        0
      );
    }
    await nasiya.save()

    return res.status(200).json({
      success: true,
      message: "Paid",
      nasiya,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { paidProduct, paidPurchase, paidNasiya };
