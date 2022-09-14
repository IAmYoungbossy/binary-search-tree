class Node {
	constructor(data, left, right) {
		this.data = data;
		this.left = left;
		this.right = right;
	}
}

class Tree {
	constructor(array) {
		this.root = buildTree(removeDuplicates(mergeSort(array)));
	}

	// Method returns deleted node.
	delete(value, root = this.root, prevRoot = null) {
		let nextRoot;
		if (root.data === value) {
			// Deletes leaf node.
			if (root.left === null && root.right === null) {
				if (prevRoot.left !== null && prevRoot.left.data === value)
					prevRoot.left = null;
				else prevRoot.right = null;
				return root;
			}

			// Deletes node with only valid right property linked.
			if (root.left === null) {
				if (prevRoot.left !== null && prevRoot.left.data === value)
					prevRoot.left = root.right;
				else prevRoot.right = root.right;
				return root;
			}

			// Deletes node with only valid left property linked.
			if (root.right === null) {
				if (prevRoot.left !== null && prevRoot.left.data === value)
					prevRoot.left = root.right;
				else prevRoot.right = root.right;
				return root;
			}

			/** For node with both left and right properties linked the getNextBigNum
			 * function gets an array of all numbers to right of the data to be deleted. */
			function getNextBigNum(nextNum, array = []) {
				if (nextNum === null) return array;
				array.push(nextNum.data);
				if (nextNum.right !== null) getNextBigNum(nextNum.right, array);
				if (nextNum.left !== null) getNextBigNum(nextNum.left, array);
				return array;
			}

			/** The return array from nextBigNum is passed to mergeSoft and the
			 * list number taken. */
			let nextBigNum = mergeSort(getNextBigNum(root.right))[0];
			this.delete(nextBigNum);
			const deletedRoot = { ...root };
			root.data = nextBigNum;
			return deletedRoot;
		}

		// Recursively checks for a value until found or not found.
		if (root.data < value) {
			nextRoot = root.right;
			if (nextRoot == null) return "Data not found.";
			return this.delete(value, nextRoot, (prevRoot = root));
		}
		nextRoot = root.left;
		if (nextRoot == null) return "Data not found.";
		return this.delete(value, nextRoot, (prevRoot = root));
	}

	// Method returns inserted node
	insert(value, root = this.root) {
		let nextRoot;
		if (root.data == value) return "Data already exist.";
		if (root.data < value) {
			nextRoot = root.right;
			if (nextRoot == null) {
				root.right = new Node(value, null, null);
				return root.right;
			}
			return this.insert(value, nextRoot);
		}
		nextRoot = root.left;
		if (nextRoot == null) {
			root.left = new Node(value, null, null);
			return root.left;
		}
		return this.insert(value, nextRoot);
	}

	// Method returns found node.
	find(value, root = this.root) {
		let nextRoot;
		if (root.data == value) return root;
		if (root.data < value) {
			nextRoot = root.right;
			if (nextRoot == null) return "Data Not Found.";
			return this.find(value, nextRoot);
		}
		nextRoot = root.left;
		if (nextRoot == null) return "Data Not Found.";
		return this.find(value, nextRoot);
	}

	levelOrder(queueArray = [], readArray = [], currentNode = this.root) {
		// Base case for termination
		if (currentNode.left === null && currentNode.right === null) return;

		// Condition for pushing unread node to queueArray
		if (currentNode.left !== null && currentNode.right !== null)
			queueArray.push(currentNode.left, currentNode.right);
		if (currentNode.left !== null && currentNode.right === null)
			queueArray.push(currentNode.left);
		if (currentNode.right !== null && currentNode.left === null)
			queueArray.push(currentNode.right);

		// Condition for recursion
		while (queueArray.length) {
			readArray.push(queueArray[0].data);
			currentNode = queueArray.shift();
			this.levelOrder(queueArray, readArray, currentNode);
		}

		// Returned value
		return readArray;
	}
}

// Array sorting Algorithm
function mergeSort(array) {
	let leftArray, rightArray, leftMergeSort, rightMergeSort;
	// Base case for termination
	if (array.length < 2) return array;
	let midPoint = array.length / 2;

	// Splits array to two seperate halves.
	if (array.length % 2 === 0) leftArray = array.splice(0, midPoint);
	else leftArray = array.splice(0, Math.ceil(midPoint));
	rightArray = array.splice(0);

	// Recursively calls itself until array length is one, then it returns.
	leftMergeSort = mergeSort(leftArray);
	rightMergeSort = mergeSort(rightArray);

	// Starts sorting from one length array into one array from bottom to way up
	while (leftMergeSort.length && rightMergeSort.length) {
		if (leftMergeSort[0] < rightMergeSort[0]) array.push(leftMergeSort.shift());
		else array.push(rightMergeSort.shift());
	}

	/** Where some numbers are left in either left/rightMergeSort due to length
	 * difference between the arrays, left over numbers are then joined here and returned. */
	return [...array, ...leftMergeSort, ...rightMergeSort];
}

/** Function gets midpoint of array make it root node, repeat same for
 * both left and right of midpont until no longer possible. */
function buildTree(array, start = 0, end = array.length - 1) {
	let midPoint = Math.floor((start + end) / 2);

	// Base case for termination.
	if (start > end) return null;

	// Recursive case
	let left = buildTree(array, start, midPoint - 1);
	let right = buildTree(array, midPoint + 1, end);

	// Level 0 (zero) root
	let node = new Node(array[midPoint], left, right);
	return node;
}

function removeDuplicates(array) {
	for (let i = 0; i < array.length && i >= 0; i++) {
		for (let j = 0; j < i && j >= 0; j++) {
			if (array[i] === array[j]) array.splice(i, 1), i--, j--;
		}
	}
	return array;
}

function prettyPrint(node, prefix = "", isLeft = true) {
	if (node.right !== null)
		prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
	console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
	if (node.left !== null)
		prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
}

const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

prettyPrint(tree.root);
console.log(tree.levelOrder());
