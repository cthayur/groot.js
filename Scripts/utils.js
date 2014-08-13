/*jslint nomen: true plusplus: true */
(function (window) {
    "use strict";
    
    var app     = {},
        utils   = {};
    
    utils.dayOfWeekArray = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    
    utils.isValidDate = function (dateString) {
        return !isNaN(Date.parse(dateString));
    };
    
    utils.getDaysInMonth = function (year, month) {
        return new Date(year, month, 0).getDate();
    };
    
    utils.getMonthRelatedInfo = function (year, month) {
        var _self = {};
        
        _self.gridCount           = 42;
        _self.currentDate         = new Date(year, month - 1);
        
        _self.thisMonth           = _self.currentDate.getMonth() + 1;
        _self.lastMonth           = _self.thisMonth - 1;
        _self.nextMonth           = _self.thisMonth + 1;
        
        _self.thisYear            = _self.currentDate.getFullYear();
        _self.lastYear            = _self.thisYear - 1;
        _self.nextYear            = _self.thisYear + 1;
        
        _self.thisDayOfTheWeek    = _self.currentDate.getDay();
        _self.thisDate            = _self.currentDate.getDate();
        _self.daysThisMonth       = utils.getDaysInMonth(_self.thisYear, _self.thisMonth);
        _self.daysPreviousMonth   = utils.getDaysInMonth(_self.thisYear, _self.thisMonth - 1);

        //Days to add before is the same as the numeric current day of the week
        _self.daysToAddbefore     = new Date(_self.thisYear, _self.lastMonth, 1).getDay();

        //Days to add after end of this month is 42 - days in this month - days already added before the start of this month
        _self.daysToAddAfter      = _self.gridCount - _self.daysThisMonth - _self.daysToAddbefore;
        
        return _self;
    };
    
    
    utils.monthList = (function () {
        var _monthList = {};
        
        _monthList[1] = "Jan";
        _monthList[2] = "Feb";
        _monthList[3] = "Mar";
        _monthList[4] = "Apr";
        _monthList[5] = "May";
        _monthList[6] = "Jun";
        _monthList[7] = "Jul";
        _monthList[8] = "Aug";
        _monthList[9] = "Sep";
        _monthList[10] = "Oct";
        _monthList[11] = "Nov";
        _monthList[12] = "Dec";
        
        return _monthList;
    }());
    
    //Assign utils to app
    app.utils = utils;
    
    //Assign app to groot
    window.groot = app;
}(window));