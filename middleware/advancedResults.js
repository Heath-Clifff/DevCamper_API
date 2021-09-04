const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  // Copy req.query
  let reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete req.params[param]);

  // Convery reqQuery into string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators($gte, $lte etc)
  queryStr = queryStr.replace(
    /\b(lte|gte|lt|gt|in)\b/g,
    (match) => `$${match}`
  );

  // Finding Resource
  query = model.find(JSON.parse(queryStr));

  // SELECT Fields
  if (req.query.select) {
    let fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // SORT
  if (req.query.sort) {
    let fields = req.query.sort.split(',').join(' ');
    query = query.sort(fields);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }
  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
