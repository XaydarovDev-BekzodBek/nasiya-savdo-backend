const nasiyaModel = require("../models/nasiya.model");

const statistic = async (req, res) => {
  try {
    let nasiya = await nasiyaModel.find({});
    const totalUsta = nasiya.filter((i) => i.type === "usta").length;
    const totalKlient = nasiya.filter((i) => i.type === "klient").length;

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const todayData = nasiya.filter((i) => {
      const createdAtString = new Date(i.createdAt).toISOString().split("T")[0];
      return createdAtString === todayString;
    });

    nasiya = nasiya.filter((i) => {
      return i.purchases.reduce((a, b) => a + b.totalDebt, 0) > 0;
    });
    return res.status(200).json({
      success: true,
      message: "statistic",
      statistic: {
        total: {
          usta: totalUsta,
          klient: totalKlient,
          nasiya: {
            totalDebt: nasiya.reduce(
              (a, b) =>
                a + b.purchases.reduce((acc, item) => acc + item.totalDebt, 0),
              0
            ),
            usta: nasiya.filter((i) => i.type === "usta").length,
            klient: nasiya.filter((i) => i.type === "klient").length,
            tovar: nasiya.reduce((a, b) => {
              return (
                a +
                b.purchases.reduce((acc, item) => acc + item.totalQuantity, 0)
              );
            }, 0),
          },
        },
        today: {
          nasiya: todayData
            .filter((i) => {
              return i.purchases.reduce((a, b) => a + b.totalDebt, 0) > 0;
            })
            .reduce((a, b) => {
              return (
                a + b.purchases.reduce((acc, item) => acc + item.totalDebt, 0)
              );
            }, 0),
          tovar: todayData.reduce((a, b) => {
            return (
              a + b.purchases.reduce((acc, item) => acc + item.totalQuantity, 0)
            );
          }, 0),
          usta: todayData.filter((i) => i.type === "usta").length,
          klient: todayData.filter((i) => i.type === "klient").length,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { statistic };
