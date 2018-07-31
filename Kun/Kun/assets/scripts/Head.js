
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(parentNode) {
        this._parentNode = parentNode
    },

    update() {
        if(this._parentNode) this.node.x = this._parentNode.x
    },
});
