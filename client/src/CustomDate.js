import moment from './moment-with-locales.custom';

export default class CustomDate {
    constructor(year, month, day) {
        if (!year || !month || !day) {
            let now = moment();

            year = parseInt(now.format("YYYY"));
            month = parseInt(now.format("M"));
            day = parseInt(now.format("D"));
        }

        this.year = year;
        this.month = month;
        this.day = day;

        this.stringFormat = "YYYY-M-D"; // should be the same as the DbDate format on the server
    }

    toFormattedString() {
        return this.year + "-" + this.month + "-" + this.day;
    }

    toMoment() {
        return moment(this.year + "-" + this.month + "-" + this.day, this.stringFormat);
    }

    format(targetFormat, locale = "en") {
        return this.toMoment().locale(locale).format(targetFormat);
    }
}