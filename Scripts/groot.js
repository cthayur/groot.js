/*jslint nomen: true plusplus: true */
(function ($, ko, groot) {
    "use strict";
    
    $(function () {

        var getMonthArray,
            calVm,
            currentElement,
            setUpVm,
            DayVm,
            utils = groot.utils;

        getMonthArray = function (year, month, parent) {

            var i,
                monthInfo = utils.getMonthRelatedInfo(year, month),
                monthArray = [];
            
            //Last Month
            for (i = monthInfo.daysPreviousMonth - monthInfo.daysToAddbefore + 1; i <= monthInfo.daysPreviousMonth; i++) {
                monthArray.push(new DayVm(i, monthInfo.lastMonth, (monthInfo.thisMonth === 1 ? monthInfo.lastYear : monthInfo.thisYear), false, parent));
            }

            //This Month
            for (i = 1; i <= monthInfo.daysThisMonth; i++) {
                monthArray.push(new DayVm(i, monthInfo.thisMonth, monthInfo.thisYear, true, parent));
            }

            //Next Month
            for (i = 1; i <= monthInfo.daysToAddAfter; i++) {
                monthArray.push(new DayVm(i, monthInfo.nextMonth, (monthInfo.thisMonth === 12 ? monthInfo.nextYear : monthInfo.thisYear), false, parent));
            }

            return monthArray;
        };

        calVm = {
            monthArray: ko.observableArray(),
            dayOfWeekArray: utils.dayOfWeekArray,
            selectedDateString: ko.observable(),
            selectedShortDate: ko.observable(),
			selectedDate: ko.observable(),
			nextMonth: function () {
				var _monthArray,
                    _currentDate = this.selectedDate();
                
				_currentDate.setMonth(_currentDate.getMonth() + 1);
				_monthArray = getMonthArray(_currentDate.getFullYear(), _currentDate.getMonth() + 1, calVm);
				
                calVm.monthArray(_monthArray);
                calVm.selectedDateString(utils.monthList[(_currentDate.getMonth() + 1)] + " "  + _currentDate.getFullYear());
            },
			prevMonth: function () {
				var _monthArray,
                    _currentDate = this.selectedDate();
				
                _currentDate.setMonth(_currentDate.getMonth() - 1);
				_monthArray = getMonthArray(_currentDate.getFullYear(), _currentDate.getMonth() + 1, calVm);
				
				calVm.monthArray(_monthArray);
				calVm.selectedDateString(utils.monthList[(_currentDate.getMonth() + 1)] + " "  + _currentDate.getFullYear());
			}
        };

        DayVm = function (date, month, year, isActive, parent) {
            var _self = {};

            _self.date = date;
            _self.month = month;
            _self.year = year;
            _self.shortDate = String(year) + month + date;
            _self.state = isActive ? 'active' : 'inactive';

            _self.isSelectedCss = ko.computed(function () {
                return _self.shortDate === parent.selectedShortDate() ? 'selected' : '';
            });

            _self.selectDate = function (data) {
                parent.selectedShortDate(_self.shortDate);

                currentElement.val(_self.month + "/" + _self.date + "/" + _self.year);
            };

            return _self;
        };

        setUpVm = function (currentDate) {
            var _monthArray = getMonthArray(currentDate.getFullYear(), currentDate.getMonth() + 1, calVm);
            calVm.selectedShortDate(String(currentDate.getFullYear()) + (currentDate.getMonth() + 1) + currentDate.getDate());
            calVm.selectedDateString(utils.monthList[(currentDate.getMonth() + 1)] + " "  + currentDate.getFullYear());
            calVm.monthArray(_monthArray);
			calVm.selectedDate(currentDate);
        };

        $('input[data-calendar]').on('focus', function () {
            if (!$('#contentDiv')[0]) {
                var _currentElement = $(this),
                    _input = _currentElement.val(),
                    _date = _input && utils.isValidDate(_input) ? new Date(_input) : new Date(),
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
    });

}(window.jQuery, window.ko, window.groot));