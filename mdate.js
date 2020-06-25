const DAYS_PER_MONTH = [
	31, 29, 31, 30,
	31, 30, 31, 31,
	30, 31, 30, 31];

const MONTHS = [
	'January', 'February', 'March', 'April',
	'May', 'June', 'July', 'August',
	'September', 'October', 'November', 'December'];

const MONTHS_SHORT = [
	'Jan', 'Feb', 'Mar', 'Apr',
	'May', 'Jun', 'Jul', 'Aug',
	'Sep', 'Oct', 'Nov', 'Dec'];	

const DAYS_WEEK = [ 
	'Sunday', 'Monday', 'Tuesday', 'Wednesday',
	'Thrusday', 'Friday', 'Saturday'];

const DAYS_WEEK_SHORT = [
	'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];	

const STD_FORMAT = 'YYYY-MM-DD';

const CUTOFF_YEAR = 40,   // means that 2-digit year 39 is assumed to be 2039, but 40 means 1940
	  MS_PER_DAY = 1000 * 60 * 60 * 24;

var strMonths = MONTHS;
var strMonthsShort = MONTHS_SHORT;
var strDaysWeek = DAYS_WEEK;
var strDaysWeekShort = DAYS_WEEK_SHORT;

var today = null;


function Mdate (year, month, date) {

	var _isValid = false;
	var _year = 0,
		_month = 0,
		_date = 0,
		_day = 0;
	if (year && date) {
		this.dateObj = new Date(year, month, date);
		if ((this.dateObj.getFullYear() == year) 
		  && (this.dateObj.getMonth() == month) 
		  && (this.dateObj.getDate() == date)) { 
			_isValid = true;
			_year = parseInt(year);
			_month = parseInt(month);
			_date = parseInt(date);
			_day = this.dateObj.getDay();
		}
	}

	this.year = () => _year;
	this.month = () =>  _month;
	this.date = () => _date;
	this.day = () => _day;

	if (this.dateObj) { 
		this.getFullYear = () => this.dateObj.getFullYear(); 
		this.getMonth = () => this.dateObj.getMonth();
		this.getDate = () => this.dateObj.getDate();
		this.getDay = () => this.dateObj.getDay();
		this.getTime = () => this.dateObj.getTime();
	}	

	this.isValid = function () {
		return _isValid;
	};	

	this.format = function (strFormat) {
		if (!_isValid)
			return 'Invalid date';

		strFormat = strFormat || STD_FORMAT;		
		var monthToStr = (_month + 1).toString(); 

		var formattedDate = strFormat.replace('YYYY', _year)
			.replace('YY',  (_year % 100).toString() )
			.replace('DDD', strDaysWeek[_day])
			.replace('DD',  _date < 10 ? '0' + _date : _date )
			.replace(/D(?![a-z,áéíóúàèãõ])/, _date)
			.replace('MMMM', strMonths[_month])
			.replace('MMM', strMonthsShort[_month])
			.replace('MM', (_month < 9 ? '0' : '' ) + monthToStr)
			.replace(/M(?![a-z,áéíóúàèãõ])/, monthToStr);
			/* MM and MMMM must be processed last, because they may introduce 
			   new formatting (May contains M, December contains D and so on)   
			*/
		return formattedDate;	
	};

	this.toString = function () {
		if (!_isValid)
			return 'Invalid date';

		// returns the date in the YYYY-MM-DD format
		return _year + '-' +
			(_month + 1 < 10 ? '0' : '') + (_month + 1) + '-' +
			(_date < 10 ? '0' : '') + _date;
	};

	this.add = function (number, type) {
		if (!number || typeof(number) != 'number')
			return this;
		
		var year = _year,
			month = _month,
			date = _date;
		if (type)
			type = type[0];
		if (type === 'y') {
			year += number;
		}
		else if (type === 'm') {
			month += number;
		}
		else
			date += number;

		var tempDate = new Date(year, month, date);
		var newMdate = new Mdate( 
			tempDate.getFullYear(),
			tempDate.getMonth(),
			tempDate.getDate());

		if (((type === 'm') || (type === 'year')) && (tempDate.getMonth() > month))
			return newMdate.subtract(newMdate.date, 'days');
		else
			return newMdate;
	};

	this.subtract = function (number, type) {
		return this.add(-number, type);
	};

	this.startOf = function (type) {
		switch (type) {
			case 'year':
				return new Mdate(_year, 0, 1);
			case 'month':
				return new Mdate(_year, _month, 1);
			case 'quarter':
				return new Mdate(_year, _month - _month % 3, 1);		
			case 'week':
				var dayOfWeek = _day;
				return this.subtract(dayOfWeek, 'days');
			default: 
				return this;	
		}		
	};

	this.weekday = function (dayNo) {
		return this.startOf('week').add(dayNo, 'days');
	};

	this.diff = function (otherMdate) {
		return dateDiffInDays(this, otherMdate);
	};

}


function setToday() {
	var timer,
		now = new Date();
	today = new Mdate(
		now.getFullYear(),
		now.getMonth(),
		now.getDate());

	milisecs = Date.now() % MS_PER_DAY;
	timer = setTimeout(setToday, MS_PER_DAY - milisecs);
	if (timer.unref) {	
		// If we are running under node.js, we must call timer.unref() 
		// to prevent the event loop from waiting until the timer is executed
		timer.unref();	
	}	
}

function checkValid(year, month, date) {
	if (!year || month > 11 || DAYS_PER_MONTH[month] < date)
		return false;
	if ((month == 1) && (date == 29)) {
		return ((new Date(year, month, date)).getDate() == date);
	}
	return true;	 
}



// a and b are Mdate objects
function dateDiffInDays (a, b) {
	if (!a.isValid() || !b.isValid())
		return null;	
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.year(), a.month(), a.date());
    var utc2 = Date.UTC(b.year(), b.month(), b.date());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
}


function mdate (strDate, strFormat) {

	function formatToRegex (format) {

		var strRegex = format.replace('YYYY', '(\\d{4})')
			.replace('YY', '(\\d{2})')
			.replace('MM', '(\\d{1,2})')
			.replace('DD', '(\\d{1,2})');

		return new RegExp(strRegex);	

	}

	function yyToYYYY (yy) {
		yy = parseInt(yy);
		if (yy >= 100)
			return yy;
		yy += (yy < CUTOFF_YEAR ? 2000 : 1900);
		return yy;
	}

	if (today === null) {
		setToday();
	}

	// Funcao sem argumentos: retorna a data de hoje

	if (!arguments.length || (arguments[0] === []) || (arguments[0] === {})) {
		return new Mdate(today.year(), today.month(), today.date());
	}

	// Trata os casos de 1 ou 3 argumentos para a funcao

	var newDate = null;
	if (arguments.length >= 3) {
		newDate = new Date(arguments[0], arguments[1], arguments[2]);
	}
	else if (typeof(arguments[0]) == 'number') {
		newDate = new Date(arguments[0]);
	}	
	else if (arguments[0] instanceof Date) {
		newDate = arguments[0];
	}
	else if (arguments[0] instanceof Mdate) {
		return new Mdate(arguments[0].year(),
			arguments[0].month(),
			arguments[0].date());
	}
	if (newDate) {	
		return new Mdate(
			newDate.getFullYear(),
			newDate.getMonth(),
			newDate.getDate());
	}

	// A seguir, tratamos os casos com 2 argumentos 
		
	if (Array.isArray(strFormat)) {
		// strFormat é um Array
		if (strFormat.length) {
			var newMdate;
			for (var i = 0; i < strFormat.length; i++) {
				newMdate = mdate(strDate, strFormat[i]);
				if (newMdate.isValid()) {
					return newMdate;
				}
			}
			// If we reached this point, the string didn't match 
			// any format in the array, so we return an invalid Mdate
			return new Mdate(0);	
		}
		else {
			// Array vazio é convertido para STD_FORMAT	
			strFormat = STD_FORMAT; 
		}	
	}

	if (!strFormat)
		strFormat = STD_FORMAT;

	var regex = formatToRegex(strFormat),
		positions = {},
		formatsRegex = /(YYYY|YY|MM|DD)/g,
		index = 1,
		result;


	
	while ((components = formatsRegex.exec(strFormat)) !== null) {
		positions[components[0]] = index;
		index++;
	}

	var result = regex.exec(strDate);
	if (!result) {
		return new Mdate(0);  // returns an invalid Mdate
	}


	var year = result[positions['YYYY']];
	var shortYear = result[positions['YY']];
	year = year ? parseInt(year) : (shortYear ? yyToYYYY(shortYear) : today.year());
	var month = result[positions['MM']];
	month = month ? parseInt(month) - 1 : today.month();
	var day = result[positions['DD']];
	day = day ? parseInt(day) : today.day(); 

	return new Mdate(year, month, day);

	return new Mdate( 
		parseInt(result[positions['YYYY']]),
		parseInt(result[positions['MM']])-1,
		parseInt(result[positions['DD']]));

};


mdate.locale = function (locale) {

	function getLocaleObj() {
		return {
			months : strMonths,
			monthsShort: strMonthsShort,
			daysWeek: strDaysWeek,
			daysWeekShort: strDaysWeekShort
		};

	}

	if (!locale)
		return getLocaleObj();

	if (locale === 'default') {
		strMonths = MONTHS;
		strMonthsShort = MONTHS_SHORT;
		strDaysWeek = DAYS_WEEK;
		strDaysWeekShort = DAYS_WEEK_SHORT;
		return getLocaleObj();
	}

	var hasMonths = false,
		hasDaysWeek = false;

	if (locale.months && locale.months.length && (locale.months.length === 12)) {
		strMonths = locale.months;
		hasMonths = true;
	}
	if (locale.monthsShort && locale.monthsShort.length && (locale.monthsShort.length === 12)) {
		strMonthsShort = locale.monthsShort;
	}
	else if (hasMonths) {
		strMonthsShort = strMonths.map((month) => month.substr(0, 3));
	}

	if (locale.daysWeek && locale.daysWeek.length && (locale.daysWeek.length === 7)) {
		strDaysWeek = locale.daysWeek;
		hasDaysWeek = true;
	}
	if (locale.daysWeekShort && locale.daysWeekShort.length && (locale.daysWeekShort.length === 7)) {
		strDaysWeekShort = locale.daysWeekShort;
	}
	else if (hasDaysWeek) {
		strDaysWeekShort = strDaysWeek.map((dayWeek) => dayWeek.substr(0, 3));
	}

	return getLocaleObj();
}


// We only export the mdate() function

module.exports =  mdate;
