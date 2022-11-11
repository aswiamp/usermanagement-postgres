const _ = require("lodash");
//pagination
exports.getPagination = (page, size) => {
    const limit = size ? +size : 2;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
exports.getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, users,itemsperpage:limit,totalPages, currentPage };
};
//sorting
exports.sorted=(sortitems)=>{
    var orderArray=[];
    if (sortitems) {
        const sorts =sortitems.split(',');
        _.each(sorts, async(sort) => {
            let field = sort;
            let order = 'ASC';
            if (sort.charAt(0) === '-') {
                order = 'DESC';
                field = sort.substring(1); // everything after first char
            }
             orderArray.push([field, order]);
        });
    } else {
    // default ordering (createdAt)
     orderArray.push(['createdAt', 'DESC']);
  }
  return orderArray;
};