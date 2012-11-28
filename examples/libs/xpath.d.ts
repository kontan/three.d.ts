/**
 * @author Kon - http://phyzkit.net/
 */
class XPathResult{
	static ANY_TYPE                     :number;	//	Whatever type naturally results from the given expression.
	static NUMBER_TYPE                  :number;	// A result set containing a single number. Useful, for example, in an XPath expression using the count() function.
	static STRING_TYPE                  :number;	// A result set containing a single string.
	static BOOLEAN_TYPE                 :number;	// A result set containing a single boolean value. Useful, for example, an an XPath expression using the not() function.
	static UNORDERED_NODE_ITERATOR_TYPE	:number;	// A result set containing all the nodes matching the expression. The nodes in the result set are not necessarily in the same order they appear in the document.
	static ORDERED_NODE_ITERATOR_TYPE   :number;	// A result set containing all the nodes matching the expression. The nodes in the result set are in the same order they appear in the document.
	static UNORDERED_NODE_SNAPSHOT_TYPE :number;	// A result set containing snapshots of all the nodes matching the expression. The nodes in the result set are not necessarily in the same order they appear in the document.
	static ORDERED_NODE_SNAPSHOT_TYPE   :number;	// A result set containing snapshots of all the nodes matching the expression. The nodes in the result set are in the same order they appear in the document.
	static ANY_UNORDERED_NODE_TYPE      :number;	// A result set containing any single node that matches the expression. The node is not necessarily the first node in the document that matches the expression.
	static FIRST_ORDERED_NODE_TYPE      :number;	// A result set containing the first node in the document that matches the expression.

	booleanValue:bool;
	invalidIteratorState:bool;
	numberValue:number;
	resultType:number;
	singleNodeValue:Node;
	snapshotLength:number;
	stringValue:string;

	constructor();
	iterateNext():Node;
	snapshotItem(index:number):Node;
}

interface XPATHDocument extends Document{
	evaluate(xpathExpression:string, contextNode:Node, namespaceResolver:(name:string)=>string, resultType:number, result:XPathResult):XPathResult;
}
