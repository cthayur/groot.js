(function ($, ko) {
    $(function () {
        //$(document).on('DOMNodeInserted', function (e) {
        //    if (e.target.id == 'test') {
        //        alert('#test was inserted')
        //    }
        //});        

        var getMonthDays,
            test,
            selectedDate = ko.observable(),
            dayOfWeekArray = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];


        

        getMonthDays = function (year, month) {
            "use strict";

            var i,
            gridCount = 42,
            daysToAddbefore,
            daysToAddAfter,
            now = new Date(year, month - 1),
            thisMonth = now.getMonth() + 1,
            thisYear = now.getFullYear(),
            lastYear = thisYear - 1,
            nextYear = thisYear + 1,
            thisDayOfTheWeek = now.getDay(),
            thisDate = now.getDate(),
            daysThisMonth,
            daysPreviousMonth,
            getDaysInMonth,
            getPreviousMonthDays,
            monthArray = [],
            dayVm;

            dayVm = function (date, month, year, isActive) {
                var _self = {};
                var _t = test;

                _self.date = date;
                _self.month = month;
                _self.year = year;
                _self.shortDate = "" + year + month + date;
                _self.state = isActive ? 'active' : 'inactive';

                _self.isSelectedCss = ko.computed(function () {
                    return _self.shortDate === selectedDate() ? 'selected' : '';
                });

                _self.selectDate = function (data) {

                    selectedDate(_self.shortDate);

                    $('#selectedDate').text(_self.date);
                    var _xx = _t;
                };

                

                return _self;
            };

            getDaysInMonth = function (year, month) {
                return new Date(year, month, 0).getDate()
            };

            daysThisMonth = getDaysInMonth(thisYear, thisMonth);
            daysPreviousMonth = getDaysInMonth(thisYear, thisMonth - 1);

            //Days to add before is the same as the numeric current day of the week
            daysToAddbefore = new Date(thisYear, thisMonth - 1, 1).getDay();

            //Days to add after end of this month is 42 - days in this month - days already added before the start of this month
            daysToAddAfter = gridCount - daysThisMonth - daysToAddbefore;

            //Last Month
            for (i = daysPreviousMonth - daysToAddbefore + 1; i <= daysPreviousMonth; i++)
                monthArray.push(new dayVm(i, thisMonth - 1, (thisMonth === 1 ? lastYear : thisYear), false));

            //This Month
            for (i = 1; i <= daysThisMonth; i++)
                monthArray.push(new dayVm(i, thisMonth, thisYear, true));

            //Next Month
            for (i = 1; i <= daysToAddAfter; i++)
            monthArray.push(new dayVm(i, thisMonth + 1, (thisMonth === 12 ? nextYear : thisYear), false));

            return monthArray;
        };

        test = {
            monthArray: ko.observableArray(),
            dayOfWeekArray : dayOfWeekArray,
            year: ko.observable(2014),
            month: ko.observable(8),
            refreshCal: function () {
                this.monthArray(getMonthDays(this.year(), this.month()))
            }
        };

        ko.applyBindings(test, $('#contentDiv')[0]);
    });

})(jQuery, ko);