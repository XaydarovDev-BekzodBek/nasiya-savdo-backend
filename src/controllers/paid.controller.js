const nasiyaModel = require("../models/nasiya.model");

const paidProduct = async (req, res) => {
  try {
    const { id, purchasesId, productId } = req.params;
    const { paid } = req.body;

    const nasiya = await nasiyaModel.findById(id);
    if (!nasiya) {
      return res.status(404).json({ success: false, message: "Nasiya not found" });
    }

    const purchase = nasiya.purchases.id(purchasesId);
    if (!purchase) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }

    const product = purchase.products.id(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const payment = Math.min(product.debt || 0, paid);
    if (payment > 0) {
      product.paid.unshift({ price: payment, createdAt: new Date() });
      product.debt = (product.debt || 0) - payment;
    }

    purchase.totalDebt = purchase.products.reduce((sum, p) => sum + (p.debt || 0), 0);

    await nasiya.save();

    return res.status(200).json({ success: true, message: "Paid", nasiya });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const paidPurchase = async (req, res) => {
  try {
    const { id, purchaseId } = req.params;
    let { paid } = req.body;

    const nasiya = await nasiyaModel.findById(id);
    if (!nasiya) {
      return res.status(404).json({ success: false, message: "Nasiya not found" });
    }

    const purchase = nasiya.purchases.id(purchaseId);
    if (!purchase) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }

    for (let product of purchase.products) {
      if (paid <= 0) break;

      const currentDebt = product.debt || 0;
      if (currentDebt > 0) {
        const payment = Math.min(currentDebt, paid);
        product.paid.unshift({ price: payment, createdAt: new Date() });
        product.debt = currentDebt - payment;
        paid -= payment;
      }
    }

    purchase.totalDebt = purchase.products.reduce((sum, p) => sum + (p.debt || 0), 0);

    await nasiya.save();

    return res.status(200).json({ success: true, message: "Paid", nasiya });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const paidNasiya = async (req, res) => {
  try {
    const { id } = req.params;
    let { paid } = req.body;

    const nasiya = await nasiyaModel.findById(id);
    if (!nasiya) {
      return res.status(404).json({ success: false, message: "Nasiya not found" });
    }

    for (let purchase of nasiya.purchases) {
      if (paid <= 0) break;

      for (let product of purchase.products) {
        if (paid <= 0) break;

        const currentDebt = product.debt || 0;
        if (currentDebt > 0) {
          const payment = Math.min(currentDebt, paid);
          product.paid.unshift({ price: payment, createdAt: new Date() });
          product.debt = currentDebt - payment;
          paid -= payment;
        }
      }

      purchase.totalDebt = purchase.products.reduce((sum, p) => sum + (p.debt || 0), 0);
    }

    await nasiya.save();

    return res.status(200).json({ success: true, message: "Paid", nasiya });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { paidProduct, paidPurchase, paidNasiya };
