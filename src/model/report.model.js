const fees_receipts = require("../models/feesReceipt");
const salaryReceipt = require("../models/salaryReceipt");

async function GetReport(section) {
  const data = await fees_receipts.aggregate([
    {
      $lookup: {
        from: "fees",
        localField: "fees_id",
        foreignField: "_id",
        as: "fees",
        pipeline: [
          {
            $lookup: {
              from: "academics",
              localField: "_id",
              foreignField: "fees_id",
              as: "academics",
              pipeline: [
                {
                  $lookup: {
                    from: "students",
                    localField: "student_id",
                    foreignField: "_id",
                    as: "students",
                    pipeline: [
                      {
                        $lookup: {
                          from: "basic_infos",
                          localField: "basic_info_id",
                          foreignField: "_id",
                          as: "basic_info",
                        },
                      },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "classes",
                    localField: "class_id",
                    foreignField: "_id",
                    as: "class",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "transactions",
        localField: "transaction_id",
        foreignField: "_id",
        as: "transaction",
      },
    },
    {
      $lookup: {
        from: "admins",
        localField: "admin_id",
        foreignField: "_id",
        as: "admin",
      },
    },
  ]);

  const filterPrimary = data.filter((m) => {
    return m?.fees[0]?.academics[0]?.class[0]?.is_primary == section && !m.is_deleted;
  });
  filterPrimary.reverse();
  return filterPrimary;
}

async function GetSalaryReport() {
  const data = await salaryReceipt.aggregate([
    {
      $lookup: {
        from: "admins",
        localField: "admin_id",
        foreignField: "_id",
        as: "admin",
      },
    },
    {
      $lookup: {
        from: "staffs",
        localField: "staff_id",
        foreignField: "_id",
        as: "staff",
        pipeline: [
          {
            $lookup: {
              from: "basic_infos",
              localField: "basic_info_id",
              foreignField: "_id",
              as: "basic_info",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "transactions",
        localField: "transaction_id",
        foreignField: "_id",
        as: "transaction",
      },
    },
  ]);

   const SalaryData = data.filter((m) => {
    return !m.is_deleted;
  });

  SalaryData.reverse();
  return SalaryData;
}

async function getYearlyReport(section) {
  const MonthlyData = await fees_receipts.aggregate([
    {
      $lookup: {
        from: "transactions",
        localField: "transaction_id",
        foreignField: "_id",
        as: "transaction",
      },
    },
    {
      $lookup: {
        from: "fees",
        localField: "fees_id",
        foreignField: "_id",
        as: "fees",
        pipeline: [
          {
            $lookup: {
              from: "academics",
              localField: "_id",
              foreignField: "fees_id",
              as: "academics",
              pipeline: [
                {
                  $lookup: {
                    from: "classes",
                    localField: "class_id",
                    foreignField: "_id",
                    as: "class",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);

  const obj = {
    1: {
      value: 0,
      Month: "January",
      noOfTransaction: 0,
    },
    2: {
      value: 0,
      Month: "February",

      noOfTransaction: 0,
    },
    3: {
      value: 0,

      Month: "March",
      noOfTransaction: 0,
    },
    4: {
      value: 0,
      Month: "April",
      noOfTransaction: 0,
    },
    5: {
      value: 0,
      Month: "May",
      noOfTransaction: 0,
    },
    6: {
      value: 0,
      Month: "June",
      noOfTransaction: 0,
    },
    7: {
      value: 0,
      Month: "July",
      noOfTransaction: 0,
    },
    8: {
      value: 0,
      Month: "August",
      noOfTransaction: 0,
    },
    9: {
      value: 0,
      Month: "September",
      noOfTransaction: 0,
    },
    10: {
      value: 0,
      Month: "October",
      noOfTransaction: 0,
    },
    11: {
      value: 0,
      Month: "November",
      noOfTransaction: 0,
    },
    12: {
      value: 0,
      Month: "December",
      noOfTransaction: 0,
    },
  };

  var Years = {};

  const filterPrimary = MonthlyData.filter((m) => {
    return m?.fees[0]?.academics[0]?.class[0]?.is_primary == section && !m.is_deleted;
  });

  const filterData = filterPrimary.map((m) => {
    let mon = new Date(m.date).getMonth() + 1;
    let y = new Date(m.date).getFullYear();

    if (!Years[y]) {
      Years[y] = JSON.parse(JSON.stringify(obj));
    }

    if (Years[y][mon]?.Month) {
      Years[y][mon].value += m?.transaction[0]?.amount;
      Years[y][mon].noOfTransaction++;
    }

    return mon;
  });

  if (filterPrimary.length < 1) {
    let y = new Date().getFullYear();
    Years[y] = JSON.parse(JSON.stringify(obj));
  }
  return Years;
}

module.exports = {
  getYearlyReport,
  GetReport,
  GetSalaryReport,
};
