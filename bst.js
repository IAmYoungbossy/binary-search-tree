class Node {
	constructor(data, left, right) {
		this.data = data;
		this.left = left;
		this.right = right;
	}
}

class Tree {
	constructor(root) {
		this.root = root;
	}
}

const sortedArray = mergeSort([
	1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324,
]);

function mergeSort(array) {
	let leftArray, rightArray, leftMergeSort, rightMergeSort;
	if (array.length < 2) return array;
	let midPoint = array.length / 2;

	if (array.length % 2 === 0) leftArray = array.splice(0, midPoint);
	else leftArray = array.splice(0, Math.ceil(midPoint));
	rightArray = array.splice(0);

	leftMergeSort = mergeSort(leftArray);
	rightMergeSort = mergeSort(rightArray);

	while (leftMergeSort.length && rightMergeSort.length) {
		if (leftMergeSort[0] < rightMergeSort[0]) array.push(leftMergeSort.shift());
		else array.push(rightMergeSort.shift());
	}

	return [...array, ...leftMergeSort, ...rightMergeSort];
}

const rootNode = buildTree(removeDuplicates(sortedArray));

function buildTree(array, start = 0, end = array.length - 1) {
	if (start > end) return null;
	let midPoint = Math.floor((start + end) / 2);

	let left = buildTree(array, start, midPoint - 1);
	let right = buildTree(array, midPoint + 1, end);

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
	if (node.right !== null) {
		prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
	}
	console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
	if (node.left !== null) {
		prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
	}
}

prettyPrint(rootNode);