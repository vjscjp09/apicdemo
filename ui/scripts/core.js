(function (nx) {
    /**
     * define application
     */
    var Shell = nx.define(nx.ui.Application, {
        methods: {
            start: function (topoLogyData) {
                //your application main entry
                var topodata = topoLogyData;
                // initialize a topology
                var topo = new nx.graphic.Topology({
                    // set the topology view's with and height
                    width: 580,
                    height: 580,
                    // node config
                    nodeConfig: {
                        // label display name from of node's model, could change to 'model.id' to show id
                        label: 'model.name'
                    },
                    // link config
                    linkConfig: {
                        // multiple link type is curve, could change to 'parallel' to use parallel link
                        linkType: 'parallel'
                    },
                    // show node's icon, could change to false to show dot
                    showIcon: true
                });

                //set data to topology
                topo.data(topodata);
                //attach topology to document
                topo.attach(this);
            }
        }
    });

    /**
     * create application instance
     */
    var shell = new Shell();

/*    var topologyData ={};
    var url = "https://sandboxapic.cisco.com/api/v0/routing-path/40.0.5.13/40.0.0.15";
    $.ajax({
        url: url,
        type: "GET",
        context: document.body,
        success:function(data){
            topoLogyData = {
                nodes: data.response[0].nodes,
                links: data.response[0].links
            };
            shell.start(topoLogyData);
        }
    });*/

// SAMPLE - START
    var sampleTopologyData = {
        nodes: [
            {"id": 0, "x": 410, "y": 100, "name": "12K-1"},
            {"id": 1, "x": 410, "y": 280, "name": "12K-2"},
            {"id": 2, "x": 660, "y": 280, "name": "Of-9k-03"},
            {"id": 3, "x": 660, "y": 100, "name": "Of-9k-02"},
            {"id": 4, "x": 180, "y": 190, "name": "Of-9k-01"}
        ],
        links: [
            {"source": 0, "target": 1},
            {"source": 1, "target": 2},
            {"source": 1, "target": 3},
            {"source": 4, "target": 1},
            {"source": 2, "target": 3},
            {"source": 2, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 0, "target": 4},
            {"source": 0, "target": 4},
            {"source": 0, "target": 3}
        ]
    };

    var sampleData = function(topodata){
        /**
         * invoke start method
         */
        shell.start(topodata);
    };
    sampleData(topologyData);
// SAMPLE -END

})(nx);