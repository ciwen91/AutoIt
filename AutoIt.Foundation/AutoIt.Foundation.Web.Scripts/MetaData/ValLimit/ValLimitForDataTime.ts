namespace MetaData {
    export class ValLimitForDataTime extends ValLimitBase {
        DateMode:DateMode;

        constructor(dateType: string=null, dateMode: DateMode=DateMode.Date, parttern: string=null) {
            super(SimpleType.datetime, parttern);
            this.DateMode = dateMode;
        }

        ValidInner(val: string): List<string> {
            var msgGroup = new List<string>();

            //计算正则
            var dateRegex = '\\d{4}/\\d{2}/\\d{2}';
            var timeRegex = '\\d{2}:\\d{2}:\\d{2}';
            var regexStr = "";
           
            if (this.DateMode == DateMode.Date) {
                regexStr = dateRegex;
            }
            else if (this.DateMode == DateMode.Time) {
                regexStr = timeRegex;
            }
            else if (this.DateMode == DateMode.DateTime) {
                regexStr = `(${dateRegex})\\s+(${timeRegex})`;
            }

            regexStr = `^${regexStr}$`;
             

            //格式校验
            var eroMsg = this.DateMode == DateMode.Date ? "日期格式不正确!" : "时间格式不正确!";
            var regex = new RegExp(regexStr);

            if (!regex.test(val)) {
                msgGroup.Set(eroMsg);
            }
            //日期校验
            else {
                var dateStr = "";
                var timeStr = "";

                if (this.DateMode == DateMode.Date) {
                    dateStr = val;
                }
                else if (this.DateMode == DateMode.Time) {
                    timeStr = val;
                } else if(this.DateMode==DateMode.DateTime) {
                    dateStr = regex.exec(val)[1];
                    timeStr = regex.exec(val)[2];
                }

                var isValid = true;

                if (isValid&&dateStr) {
                    var date = new Date(dateStr);
                    var dateStrGroup = dateStr.split('/');

                    isValid = date.getFullYear() == parseInt(dateStrGroup[0]) &&
                        (date.getMonth() + 1) == parseInt(dateStrGroup[1]) &&
                        date.getDate() == parseInt(dateStrGroup[2]);
                }

                if (isValid && timeStr) {
                    var timeStrGroup = timeStr.split(':');
                    var hour = parseInt(timeStrGroup[0]);
                    var min = parseInt(timeStrGroup[1]);
                    var second = parseInt(timeStrGroup[1]);

                    isValid=hour >= 0 && hour < 24 && min >= 0 && min < 60 && second >= 0 && second < 60;
                }

                if (!isValid) {
                    msgGroup.Set(eroMsg);
                }
            }
         
            return msgGroup;
        }
    }
}