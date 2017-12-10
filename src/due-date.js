var DueDate =
{
	startDay:  0,
	startHour: 0,
	day:       0,
	hour:      0,

	init: function()
	{
		$('input[type="submit"]').click(this.submitEvent);
	},

	submitEvent: function(e)
	{
		e.preventDefault();

		DueDate.startDay  = parseInt($('select[name="start-day"] option:selected').val());
		DueDate.startHour = parseInt($('select[name="start-hour"] option:selected').val());
		DueDate.day       = parseInt($('input[name="day"]').val()) || 0;
		DueDate.hour      = parseInt($('input[name="hour"]').val()) || 0;

		DueDate.View.showResult();
	},

	View:
	{
		showResult: function()
		{
			DueDate.Calculate.init();

			$('p').html(this.getDay() + '<br />' + this.getHour() + '<br />' + this.getWeek());
		},

		getHour: function()
		{
			return '<b>Hour:</b> ' + $('select[name="start-hour"] option[value="' + DueDate.Calculate.getWitchHour() + '"]').text();
		},

		getDay: function()
		{
			return '<b>Day:</b> ' + $('select[name="start-day"] option[value="' + DueDate.Calculate.getWitchWorkday() + '"]').text();
		},

		getWeek: function()
		{
			var plusWeek = DueDate.Calculate.getWeeks();

			return plusWeek > 0
				? '<b>Week(s):</b> ' + (plusWeek === 1
					? 'Next week'
					: (plusWeek > 1
						? '+' + plusWeek.toString() + ' weeks'
						: 0)
					)
				: '';
		}
	},

	Calculate:
	{
		totalHours:          0,
		workDays:            0,
		weeklyWorkdayNumber: 5,
		numberOfHoursWorked: 8,
		deliveryDayNumber:   0,

		init: function()
		{
			DueDate.Calculate.totalHours = this.getHour();
			DueDate.Calculate.workDays   = this.getWorkday();
		},

		getHour: function()
		{
			var result = 0;

			if (DueDate.day > 0) {
				result = DueDate.day * this.numberOfHoursWorked
			}

			return result + DueDate.hour;
		},

		getWorkday: function()
		{
			return Math.floor(this.totalHours / this.numberOfHoursWorked);
		},

		getWitchWorkday: function()
		{
			var result,
				plusHour  = (this.totalHours - this.numberOfHoursWorked * this.workDays) + DueDate.startHour,
				dayNumber = parseInt(this.workDays.toString().split('').pop());

			if (plusHour > this.numberOfHoursWorked) {
				++dayNumber;
			}

			if (dayNumber > this.weeklyWorkdayNumber) {
				dayNumber -= this.weeklyWorkdayNumber;
			}

			result = DueDate.startDay + dayNumber;
			this.deliveryDayNumber = result > this.weeklyWorkdayNumber ? (result - this.weeklyWorkdayNumber) : result;

			return this.deliveryDayNumber;
		},

		getWitchHour: function()
		{
			var hour = this.totalHours < this.numberOfHoursWorked
				? DueDate.startHour + this.totalHours
				: this.totalHours - (this.workDays * this.numberOfHoursWorked)
		
			return	hour > this.numberOfHoursWorked
					? hour - this.numberOfHoursWorked
					: hour; 
		},

		getWeeks: function()
		{
			var plusHour = (this.totalHours - 8 * this.workDays) + DueDate.startHour;

			if (plusHour > 8) {
				++this.workDays;
			}

			return Math.floor(this.workDays / 5) + this.checkDay();
		},

		checkDay: function()
		{
			return DueDate.startDay > this.deliveryDayNumber ? 1 : 0;
		}
	}
};

DueDate.init();