
dojo.byId = function(id, doc){
	//	summary:
	//		Returns DOM node with matching `id` attribute or `null`
	//		if not found, similar to "$" function in another library.
	//		If `id` is a DomNode, this function is a no-op.
	//
	//	id: String|DOMNode
	//	 	A string to match an HTML id attribute or a reference to a DOM Node
	//
	//	doc: Document?
	//		Document to work in. Defaults to the current value of
	//		dojo.doc.  Can be used to retrieve
	//		node references from other documents.
	//
	//	example:
	//	Look up a node by ID:
	//	| var n = dojo.byId("foo");
	//
	//	example:
	//	Check if a node exists.
	//	|	if(dojo.byId("bar")){ ... }
	//
	//	example:
	//	Allow string or DomNode references to be passed to a custom function:
	//	| var foo = function(nodeOrId){
	//	|	nodeOrId = dojo.byId(nodeOrId);
	//	|	// ... more stuff
	//	| }
	return (typeof id == "string") ? (doc || document).getElementById(id) : id; // DomNode
};
