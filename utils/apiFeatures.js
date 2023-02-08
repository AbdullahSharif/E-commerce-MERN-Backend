class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
        // console.log(this.query);
        // console.log(queryStr);
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }

        } : {}

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr };

        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(field => delete queryStrCopy[field]);

        // for price.
        // for this we will pass the value in url such as 
        // http://localhost:9000/api/allRoutes/products/allProducts?price[gt]=1200&price[lt]=2000
        let queryCopyStr = JSON.stringify(queryStrCopy);
        // now we will simply add $ sign before the lt, lte, gt and gte operators in the query string of the url.
        queryCopyStr = queryCopyStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);


        this.query.find(JSON.parse(queryCopyStr));
        return this;
    }

    pagination(resultsPerPage) {
        const currentPage = this.queryStr.page || 1;

        const itemsToSkip = resultsPerPage * (currentPage - 1);

        this.query = this.query.limit(resultsPerPage).skip(itemsToSkip);
        return this;
    }


}

module.exports = ApiFeatures;