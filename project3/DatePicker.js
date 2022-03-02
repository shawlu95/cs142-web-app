function DatePicker(id, dateCallBack) {
	this.id = id;

    this.registerCallback = function(cell, y, m, d, id, dateCallBack) {
        cell.addEventListener("click", function() {
            dateCallBack(id, {month: m, day:d, year: y});
        });
    };

	this.render = function(inputDate) {
        var node = document.createElement("TABLE");
		document.getElementById(id).appendChild(node); 
        document.getElementById(id).firstChild.setAttribute("id", "calendarTable" + id);
        var table = document.getElementById("calendarTable" + id);
        table.innerHTML = ""; //clean up the table first
        var rowHeader1 = table.insertRow(0);

        // Get the current month and year needed for the calendar header.
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var curMonth = inputDate.getMonth();
        var curMonthString = months[curMonth];
        var curYear = inputDate.getFullYear();
        
        // Create the cell for turning to last month.
        var lastMonthCell = rowHeader1.insertCell(0);
        lastMonthCell.innerHTML = "<";
        lastMonthCell.addEventListener("click", function(event){
            var lastMonthDate;
            if (curMonth === 0) {
                lastMonthDate = new Date(curYear - 1, 11, 1);
            } else {
                lastMonthDate = new Date(curYear, curMonth - 1, 1);
            }
            this.render(lastMonthDate);
        }.bind(this)); 

        // Create the title with info about the current month and year.
        var monthYearCell = rowHeader1.insertCell(1);
        monthYearCell.setAttribute("colspan", 5);
        monthYearCell.innerHTML =  curMonthString + " " + curYear;

        // Create the cell for turning to next month.
        var nextMonthCell = rowHeader1.insertCell(2);
        nextMonthCell.innerHTML = ">";
        nextMonthCell.addEventListener("click", function(event){
            var nextMonthDate;
            if (curMonth === 11) {
                nextMonthDate = new Date(curYear + 1, 0, 1);
            } else {
                nextMonthDate = new Date(curYear, curMonth + 1, 1);
            }
            this.render(nextMonthDate);
        }.bind(this)); 

        var rowDayOfWeek = table.insertRow();
        var daysOfWeekCell;
        var daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        for (var idx in daysOfWeek) {
            daysOfWeekCell = rowDayOfWeek.insertCell();
            daysOfWeekCell.innerHTML = daysOfWeek[idx];
        }

        // To fill in dates in the current month in rows, 
        // first get the weekday of the first day of the current month,
        // and calculate how many dates from last month should be put in the first row.
        var firstDateCurMonth = inputDate;
        firstDateCurMonth.setDate(1);
        var firstDateWeekday = firstDateCurMonth.getDay(); 

        // The weekday of the first day is exactly the number of how many days from last month
        // that should be included in the first row.
        // Use this number to find out the first date that should appear in the first row.
        var firstDateRowOne = firstDateCurMonth;
        firstDateRowOne.setDate(firstDateRowOne.getDate() - firstDateWeekday); 

        // Put all dates starting from the first date in row one into the rows of dates.
        // Use a while loop to write the HTML lines for each row,
        // until the first date of a row reaches next month.
        var nextMonth;
        if (curMonth === 11) {
            nextMonth = 0;
        } else {
            nextMonth = curMonth + 1;
        }
        var tempDate = firstDateRowOne;
        var tempMonth = tempDate.getMonth();

        var newRow;
        var i;
        var newDateCell;
        while (tempMonth !== nextMonth) { // TempMonth is the month of the first date in every row. Make sure tempMonth does not enter next month.
            newRow = table.insertRow(); 
            for (i = 0; i < 7; i++) { // Loop through seven days in a row.
                newDateCell = newRow.insertCell();
                newDateCell.innerHTML = tempDate.getDate();
                newDateCell.colspan = 1;
                if (tempDate.getMonth() === curMonth) {
                    this.registerCallback(newDateCell, curYear, tempDate.getMonth() + 1, tempDate.getDate(), id, dateCallBack);
                } else {
                    newDateCell.setAttribute("id", "wrongMonth");
                }
                tempDate.setDate(tempDate.getDate() + 1); // After filling in the date, add one day.
            }
            tempMonth = tempDate.getMonth(); // Now the tempDate is the first date of next week. Update the tempMonth.
        } 
	};
}
