module.exports.DbDate = class DbDate {
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    toFormattedString() {
        return this.year + "-" + this.month + "-" + this.day;
    }
};