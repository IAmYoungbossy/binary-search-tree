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
			if (nextRoot === null) {
				root.right = new Node(value, null, null);
				return root.right;
			}
			return this.insert(value, nextRoot);
		}
		nextRoot = root.left;
		if (nextRoot === null) {
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

	levelOrder(
		callback,
		queueArray = [],
		readArray = [this.root.data],
		currentNode = this.root
	) {
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
			this.levelOrder(callback, queueArray, readArray, currentNode);
		}

		if (callback) return readArray.map((item) => callback(item));
		return readArray;
	}

	preorder(callback, currentNode = this.root, array = []) {
		if (currentNode === null) return;

		// Read data.
		array.push(currentNode.data);

		// Recursive case.
		if (currentNode) {
			if (currentNode.left !== null)
				this.preorder(callback, currentNode.left, array);
			if (currentNode.right !== null)
				this.preorder(callback, currentNode.right, array);
		}

		if (callback) return array.map((item) => callback(item));
		return array;
	}

	inorder(callback, currentNode = this.root, array = []) {
		if (currentNode === null) return;

		if (currentNode) {
			// left recursion.
			if (currentNode.left !== null)
				this.inorder(callback, currentNode.left, array);

			// Read data.
			array.push(currentNode.data);

			// Right recursion.
			if (currentNode.right !== null)
				this.inorder(callback, currentNode.right, array);
		}

		if (callback) return array.map((item) => callback(item));
		return array;
	}

	postorder(callback, currentNode = this.root, array = []) {
		if (currentNode === null) return;

		if (currentNode) {
			// Left and right recursion.
			if (currentNode.left !== null)
				this.postorder(callback, currentNode.left, array);
			if (currentNode.right !== null)
				this.postorder(callback, currentNode.right, array);

			// Read data.
			array.push(currentNode.data);
		}

		if (callback) return array.map((item) => callback(item));
		return array;
	}

	// Measures tree height from input node.
	height(value, node = this.find(value), counter = 0, array = []) {
		if (node === null) return;
		array.push(counter);

		if (node.left !== null) this.height(value, node.left, counter + 1, array);
		if (node.right !== null) this.height(value, node.right, counter + 1, array);
		return array.sort((a, b) => a - b)[array.length - 1];
	}

	depth(value, root = this.root, counter = 0) {
		if (root.data == value) return counter;

		if (root.data < value) {
			if (root.right === null) return "Data Not Found.";
			return this.depth(value, root.right, counter + 1);
		}
		if (root.left === null) return "Data Not Found.";
		return this.depth(value, root.left, counter + 1);
	}

	isBalanced(node = this.root, result = []) {
		// Base case.
		if (node.left !== null && node.right !== null) {
			const leftNode = this.height(node.left.data);
			const rightNode = this.height(node.right.data);
			if (leftNode - rightNode > 1 || rightNode - leftNode > 1) result.push(1);
		}
		if (node.right && !node.left)
			if (node.right.right !== null || node.right.left !== null) result.push(2);
		if (node.left && !node.right)
			if (node.left.left !== null || node.left.right !== null) result.push(3);

		// Recursive case.
		if (node.left) this.isBalanced(node.left, result);
		if (node.right) this.isBalanced(node.right, result);

		if (result.length > 0) return "Not balanced.";
		else return "Balanced.";
	}

	rebalance() {
		if (this.isBalanced() === "Not balanced.") {
			this.root = buildTree(this.inorder());
			return "Rebalanced.";
		}
		return "Already balanced.";
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