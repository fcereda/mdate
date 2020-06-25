var meses = [ 
	'Janeiro', 'Fevereiro', 'Marco', 'Abril',
	'Maio', 'Junho', 'Julho','Agosto',
	'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];


function writeln(str) {
	console.log.apply(this, arguments);
}

function Node (data, next) {
	this.data = data;
	this.next = next;
	
	this.display = function () {
		var str = '',
			node = this;
		do {
			str += node.data;
			if (node.next) {
				str += ' -> ';
			}	
			node = node.next;
		} while (node);
		writeln(str);
	};
}

function createLinkedList (arr) {
	var firstNode,
		oldNode,
		newNode;
	for (var i=0; i<arr.length; i++) {
		newNode = new Node(arr[i]);
		if (!firstNode)
			firstNode = newNode;
		if (oldNode) {
			oldNode.next = newNode;
		}
		oldNode = newNode;
	}

	return firstNode;
}

function invertLinkedList (llist) {
	var previous = null,
		current = llist,
		newNode;

	do {
		newNode = new Node(current.data, previous);
		previous = newNode;
		current = current.next;
	} while (current);	

	return previous;
}

var llist = createLinkedList(meses);
writeln('ORIGINAL LIST:');
llist.display();

var invertedList = invertLinkedList(llist);
writeln('\nINVERTED LIST:');
invertedList.display();