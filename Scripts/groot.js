(function ($, ko) {
    $(function () {
        "use strict";

        var getMonthArray,
            calVm,            
            currentElement,
            isValidDate,
            setUpVm,
            monthList = {},
            dayVm,
            dayOfWeekArray = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        (function () {            
            monthList[1] = "Jan";
            monthList[2] = "Feb";
            monthList[3] = "Mar";
            monthList[4] = "Apr";
            monthList[5] = "May";
            monthList[6] = "Jun";
            monthList[7] = "Jul";
            monthList[8] = "Aug";
            monthList[9] = "Sep";
            monthList[10] = "Oct";
            monthList[11] = "Nov";
            monthList[12] = "Dec";
        })();


        isValidDate = function (dateString) {
            return !isNaN(Date.parse(dateString));
        }

        getMonthArray = function (year, month, parent) {
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
            monthArray = [];

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
                monthArray.push(new dayVm(i, thisMonth - 1, (thisMonth === 1 ? lastYear : thisYear), false, parent));

            //This Month
            for (i = 1; i <= daysThisMonth; i++)
                monthArray.push(new dayVm(i, thisMonth, thisYear, true, parent));

            //Next Month
            for (i = 1; i <= daysToAddAfter; i++)
                monthArray.push(new dayVm(i, thisMonth + 1, (thisMonth === 12 ? nextYear : thisYear), false, parent));

            return monthArray;
        };

        calVm = {
            monthArray: ko.observableArray(),
            dayOfWeekArray: dayOfWeekArray,
            selectedDateString: ko.observable(),
            selectedShortDate: ko.observable()
        };

        dayVm = function (date, month, year, isActive, parent) {
            var _self = {};

            _self.date = date;
            _self.month = month;
            _self.year = year;
            _self.shortDate = "" + year + month + date;
            _self.state = isActive ? 'active' : 'inactive';

            _self.isSelectedCss = ko.computed(function () {
                return _self.shortDate === parent.selectedShortDate() ? 'selected' : '';
            });

            _self.selectDate = function (data) {
                parent.selectedShortDate(_self.shortDate);
                parent.selectedDateString(monthList[_self.month] + " " + _self.date + ", " + _self.year);

                currentElement.val(_self.month + "/" + _self.date + "/" + _self.year);
            };

            return _self;
        };

        setUpVm = function (currentDate) {
            var _monthArray = getMonthArray(currentDate.getFullYear(), currentDate.getMonth() + 1, calVm);
            calVm.selectedShortDate("" + currentDate.getFullYear() + (currentDate.getMonth() + 1) + currentDate.getDate());
            calVm.selectedDateString(monthList[(currentDate.getMonth() + 1)] + " " + currentDate.getDate() + ", " + currentDate.getFullYear());
            calVm.monthArray(_monthArray);
        };

        $('input[data-calendar]').on('focus', function () {
            if (!$('#contentDiv')[0]) {
                var _currentElement = $(this),
                _input = _currentElement.val(),
                _date = _input && isValidDate(_input) ? new Date(_input) : new Date(),
                _contentDiv = "<div id=\"contentDiv\" data-bind=\"template: {name:'calTemplate'}\"></div>";

                $(this).after(_contentDiv);

                currentElement = _currentElement;

                setUpVm(_date);

                ko.applyBindings(calVm, $('#contentDiv')[0]);
            }
        });

        $(document).on('click', function (e) {
            if ($(e.target).closest('.calContainer').length === 0 && !$(currentElement).is(":focus")) {
                $('#contentDiv').remove();
            }
        });

        //$('input[data-calendar]').on('focusout', function () {
            
        //    if (!$(".calContainer, .calWrapperHeaderDiv, .calHeaderDay, .calDayText, .calWrapperDiv, .calDay, .calDayText").is(":focus"))
        //        $('#contentDiv').remove();
        //});

        

        
    });

})(jQuery, ko);