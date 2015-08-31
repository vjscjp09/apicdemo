formatJson = {updateData: function updateData(res) {
    var obj = {},
        self = this;
    obj = _.extend(res.response[0], obj);
    console.log("length", obj.nodes.length);
    var nodes = self.updateNodes(obj.nodes);

    self.updateSource(obj.nodes, obj.links);
    self.updateTarget(obj.nodes, obj.links);
    return obj;

},

updateNodes: function(nodes) {

    var ids = _.uniq(_.pluck(nodes, 'id'));


    _.each(ids, function(id, index) {
        var node = _.findWhere(nodes, {
            id: id
        });
        if (node) {
            node.oldId = id;
            node.id = index;

        }

    });

},
updateTarget: function(nodes, links) {


    _.each(nodes, function(node) {

        var tempLinks = _.where(links, {
            target: node.oldId
        });
        _.each(tempLinks, function(tempLink) {
            tempLink.target = node.id;


        });
    });


},
updateSource: function(nodes, links) {


    _.each(nodes, function(node) {

        var tempLinks = _.where(links, {
            source: node.oldId
        });
        _.each(tempLinks, function(tempLink) {
            tempLink.source = node.id;


        });
    });

}

}