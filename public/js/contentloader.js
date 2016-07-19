/*
	This is content loader for MirageRun
	Feature:
	- Loads HTML of game state in container
*/

(function () {
    var blocks = {};
    var loader;

    var Loader = {
    	init: function(loadElement) {
    		loader = loadElement;
    	},
    	addBlock: function(name, node, ctor) {
    		blocks[name] = {
    			node: node,
    			ctor: ctor
    		};
    	},
    	setBlock: function(name, initData) {
    		loader.innerHTML = blocks[name].node.innerHTML;
    		blocks[name].ctor(initData);
    	}
    };

    window.Loader = Loader;
}());