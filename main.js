var mdate = require('./mdate.js');

const YMD = 'YYYY-MM-DD';
const DMY = 'DD-MM-YYYY';
const MDY = 'MM-DD-YYYY';
const bras = 'DD/MM/YYYY';
const longBras = 'D de MMMM de YYYY';

var datas = [ {
	data: '2016-12-10',
	format: YMD
}, {
	data: '1/1/2017',
	format: bras
}, {
	data: '12-10-2016',
	format: MDY
}, {
	data: '1-6-2016',
	format: DMY
}, {
	data: '32/32/2011',
	format: bras
}, {
	data: '1/6',
	format: 'DD/MM'
}];

var meses = [ 
	'Janeiro', 'Fevereiro', 'Marco', 'Abril',
	'Maio', 'Junho', 'Julho','Agosto',
	'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

var diasSemana = [
	'Domingo', 'Segunda-feira', 'Terca-feira',
	'Quarta-feira', 'Quinta-feira', 'Sexta-feira',
	'Sábado'];

function writeln(str) {
	console.log.apply(this, arguments);
}

writeln(mdate());
writeln('\nTESTING DATES:\n\n');
for (var i=0; i<datas.length; i++) {
	writeln(datas[i].data);
	writeln(mdate(datas[i].data, datas[i].format));
}	

writeln('\nTESTING PARSING');
writeln(mdate('2012', '11', '06')); 
writeln(mdate(2012, 11, 06)); 
writeln(mdate(1481418577000));
writeln(mdate('5/10/72', 'DD/MM/YY'));
writeln(mdate('01-09-11', 'YY-MM-DD'));
writeln(mdate());

writeln('\nTESTING FORMAT METHOD');
writeln(mdate('2012', '11', '06').format('YYYY-MM-DD')); 
writeln(mdate('1972-08-20').format('DD/MM/YY'));
writeln(mdate(2012, 11, 06).format('DD/MM/YYYY')); 
writeln(mdate(1481418577000).format('MM-DD-YYYY'));
writeln('Today is ', mdate().format('MMMM D, YYYY'));
writeln('Tomorrow will be ' + mdate().add(1, 'day').format('DDD, DD MMM YYYY'));

mdate.locale({
	months: meses, 
	daysWeek: diasSemana
});
writeln('Hoje é ' + mdate().format('D de MMMM de YYYY') + mdate().format(', DDD'));
writeln('Hoje é ' + mdate().format('DD/MMM/YYYY'));

writeln('\nACOCHAMBRANDO');
writeln(new Date(2015, 14, -365));

writeln('\n TESTING VALIDITY');
writeln(mdate('2016-02-29'));
var fev29 = new Date(2016, 01, 29);
writeln(fev29.getDate());

writeln('\nTESTING ADDITION');
writeln('Data atual: ' + mdate().format(longBras));
writeln('Mais 30 dias: ' + mdate().add(30, 'days').format(bras));
writeln('Menos 365 dias: ' + mdate().subtract(365, 'days').format(longBras));
writeln('Mais 2 meses: ' + mdate().add(2, 'months').format(longBras));
writeln('Mais um ano: ' + mdate().add(1, 'year').format(longBras));
writeln('Mais um ano e meio: ' + mdate().add(1.5, 'year').format(longBras));  // THIS IS AN ERROR!
writeln(mdate(2016, 0, 31).add(1, 'month').format(longBras));	// THIS IS AN ERROR!

writeln('\nTESTING startOf');
writeln('Start of week: ' + mdate().startOf('week').format(longBras));
writeln('Start of year: ' + mdate().startOf('year').format(longBras));
writeln('Start of month: ' + mdate().startOf('month').format(longBras));
writeln('Start of quarter: ' + mdate().startOf('quarter').format(longBras));

writeln('\nDATE DIFF');
writeln(mdate('2016-12-31').diff(mdate('2016-12-31').subtract(1, 'month')) + ' days');
writeln(mdate('2016-3-31').subtract(1, 'month').format(longBras));
writeln(mdate('15', 'DD').format(longBras)); //add(16).format(longBras));

writeln('\nFORMATS ARRAY');
writeln(mdate('12', ['YYYY-MM-DD', 'MM-DD', 'DD/MM', 'DD']).format(longBras));
writeln(mdate('1/12', ['YYYY-MM-DD', 'MM-DD', 'DD/MM', 'DD']).format(longBras));
writeln(mdate('12-32', ['YYYY-MM-DD', 'MM-DD', 'DD/MM', 'DD']).format(longBras));		// This is wrong!!
writeln(mdate('2012-5-12', ['YYYY-MM-DD', 'MM-DD', 'DD/MM', 'DD']).format(longBras));
writeln(mdate(1282218577000, ['YYYY-MM-DD', 'MM-DD', 'DD/MM', 'DD']).format(longBras));  

writeln("\nCREATING MDATE FROM DATE OBJECT");
writeln(mdate(new Date()).format(longBras));

writeln('\nCLONING A MDATE OBJECT');
writeln(mdate(mdate().add(1)).format(longBras));

/*
writeln('\nTESTING SPEED')
var start = Date.now();
var thisdate = mdate();
for (var i=0; i<1000000; i++)
	thisdate.format('DD/MM/YYYY, DDD');
var end = Date.now();
writeln('Time elapsed ' + (end - start).toString() + ' miliseconds');
*/

writeln(mdate.locale());

writeln('THIS SHOULD BE INVALID: ' + mdate('2012-99-1').format(longBras));

writeln('TESTING GETTERS');
writeln(mdate().dateObj);
writeln(diasSemana[mdate().getDay()] + ', '+ mdate().getFullYear() + '-' + mdate().getMonth() + '-' + mdate().getDate());

writeln('TESTING year, month, date AND day methods');
var testDay = mdate('2016-10-01', 'YYYY-MM-DD');
testDay = mdate();
writeln('year = ', testDay.year());
writeln('month = ', testDay.month());
writeln('date = ', testDay.date());
writeln('day = ', testDay.day());
writeln(mdate().toString());
