module.exports = class Features {
    constructor(query, qyuerString) {
        this.query = query;
        this.qyuerString = qyuerString;
    }

    search() {
        const keyword = this.qyuerString.keyword ? {
            name: {
                $regex: this.qyuerString.keyword,
                $options: "i"
            }
        } : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }
}