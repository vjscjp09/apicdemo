var app = (function(nx){
    var headers = [];
    var tableRows = [];
    var colMin = 1;
    var colMax = 10;
    var baseApiUrl = "https://sandboxapic.cisco.com/api/v0/";
    var root = 'host';
    var backUrl = "";
    var createTableData = function(data){
        tableRows = [];
        if (data[0] === undefined) {
            tableRows.push(data);
        }
        else {
            $.each(data,function(key,val){
                tableRows.push(data[key]);
            });
        }
    };
    var createHeaders = function(data){
        headers = [];
        $.each(data,function(key,val){
            headers.push(key);
        });
    };
    var routingParams=[];



    var updateSourceDestination= function (){

        var condition=(routingParams.length==0);
        var source=(condition)?'?':routingParams[0];
        var destination=(condition)?'?':routingParams[1];
        $("#source").text(source);
        $("#destination").text(destination);
    };
    var Shell = nx.define(nx.ui.Application, {
        methods: {
            start: function (topoLogyData) {
                //your application main entry
                var topodata = topoLogyData;
                // initialize a topology
                var topo = new nx.graphic.Topology({
                    // set the topology view's with and height
                    width: 800,
                    height: 800,
                    // node config
                    nodeConfig: {
                        // label display name from of node's model, could change to 'model.id' to show id
                        label: 'model.id'
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
                console.log(topo);
                topo.attach(this);
            },
            getContainer: function() {
                return new nx.dom.Element(document.getElementById('topo-container'));
            }

        }
    });
    var shell=new Shell();


    var sampleTopologyData = {
        nodes: [
            {"id": 0, "x": 410, "y": 100, "name": "12K-1"},
            {"id": "7895a45f-47aa-42ee-9d06-c66d3b784594", "x": 410, "y": 280, "name": "12K-2"},
            {"id": 2, "x": 660, "y": 280, "name": "Of-9k-03"},
            {"id": 3, "x": 660, "y": 100, "name": "Of-9k-02"},
            {"id": 4, "x": 180, "y": 190, "name": "Of-9k-01"}
        ],
        links: [
            {"source": 0, "target": "7895a45f-47aa-42ee-9d06-c66d3b784594"},
            {"source": "7895a45f-47aa-42ee-9d06-c66d3b784594", "target": 2},
            {"source": "7895a45f-47aa-42ee-9d06-c66d3b784594", "target": 3},
            {"source": 4, "target": "7895a45f-47aa-42ee-9d06-c66d3b784594"},
            {"source": 4, "target": 2},
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

    return{
        clearRoutingParams:function(){
            routingParams=[];
        },
		baseApiUrl:baseApiUrl,
        updateSourceDestination:updateSourceDestination,
        init: function() {
            $(".menuitem").on("click", function(event) {
                root = $(this).attr("href");
                event.preventDefault();
                app.callService(baseApiUrl + root,'GET',false);
                app.createTable("table1");
            });
            $("body").on("click","a.child", function(event){
                backUrl = baseApiUrl + root;
                $("#backUrl").attr("href",backUrl).show();
                event.preventDefault();
                app.callService($(this).attr("href"),'GET',false);
                app.createTableDescription("table1");
            });

            $("body").on("click","a.hostIp",function(event){


                event.preventDefault();
                var ip=$(this).attr("id");
                if(routingParams.length==2){
                    routingParams=[];
                }
                routingParams.push(ip);
                updateSourceDestination();
            });

            $("div").on("click","#backUrl", function(event){
                event.preventDefault();
                app.callService($(this).attr("href"),'GET',false);
                app.createTable("table1");
                $(this).hide();
            });
        },
        callService : function(url,type,async){
            $.ajax({
                url: url,
                type: type||"GET",
                async:async||false,
                context: document.body,
                success:function(data){
                 createHeaders(data.response[0] !== undefined ? data.response[0] : data.response);
                 createTableData(data.response);

                },
                error:function(errorData){

                }
            });

        },
        getCount : function(url,type,async,elementId){
            $.ajax({
                url: url,
                type: type||"GET",
                async:async||false,
                context: document.body,
                success:function(data){
                    $("#"+elementId).html(data.response);
                }
            });
        },
		getTopology:function(source,destination){

            if(routingParams.length!=2){
                alert('Source/Destination missing or the same');
                return false;
            }


			 $.ajax({
				url:app.baseApiUrl+'routing-path/'+routingParams[0]+'/'+routingParams[1],
				success:function(data){
                    $('#topo-container').html("");
                    var mapping=formatJson.updateData(data);
                    $('.nav-tabs a[href="#topology"]').tab('show')
                   //shell.start(sampleTopologyData);
                    try {
                        var topologyData={nodes: mapping.nodes, links: mapping.links};
                        console.log(JSON.stringify(topologyData));
                        shell.start(topologyData);

                    }
                    catch(ex){
                        console.log(ex);
                        console.log('error while rendering topology');
                        console.log('using sample data');
                        shell.start(sampleTopologyData);
                    }
				}
			 });
			
		},
        createTable : function(elId){
            $("#"+elId).find('thead').empty();
            $("#"+elId).find('tbody').empty();
            $("#"+elId).find('tfoot').empty();
            var head = $('#'+elId).find('thead');
            var tbody = $('#'+elId).find('tbody');
            var cols = '<tr>';
            for(var i in headers ){

                    var th = '<th>' + headers[i] + '</th>';
                    cols = cols + th;

            }
            cols = cols + "</tr>";
            head.append(cols);

            for(var k in tableRows ) {

                var tr = '<tr>';
                if (typeof  tableRows[k] === 'object'){
                    for (var j in tableRows[k]) {
                        if (j == "id") {
                            var td = '<td><a class="child" href="'+baseApiUrl+root+"/"+tableRows[k][j]+'">' + tableRows[k][j] + '</a></td>';
                            tr = tr + td;
                        }// Need to Generalize this
                        else if(j =='hostIp'){
                            var td = '<td><a class="hostIp" href="#" id="'+tableRows[k][j]+'">' + tableRows[k][j] + '</a></td>';
                            tr = tr + td;
                        }

                        else {
                            var td = '<td>' + tableRows[k][j] + '</td>';
                            tr = tr + td;
                        }
                    }
                    tr = tr + "</tr>"
                }
                tbody.append(tr);
            }
        },
        createTableDescription : function(elId){
            $("#"+elId).find('thead').empty();
            $("#"+elId).find('tbody').empty();
            $("#"+elId).find('tfoot').empty();
            var head = $('#'+elId).find('thead');
            var tbody = $('#'+elId).find('tbody');
            var cols = '';
            var array = $.map(tableRows[0], function(value, index) {
                return [value];
            });
            for(var i in headers) {
                cols += '<tr>';
                var td = '<td>' + headers[i] + '</td>';
                cols = cols + td;
                td = '<td>' + array[i] + '</td>';
                cols = cols + td;
                cols = cols + "</tr>";
            }
            head.append(cols);
            /*for(var i in headers ){

                var th = '<th>' + headers[i] + '</th>';
                cols = cols + th;

            }
            cols = cols + "</tr>";
            head.append(cols);

            for(var k in tableRows ) {
                var tr = '<tr>';
                if (typeof  tableRows[k] === 'object') {
                    for (var j in tableRows[k]) {
                        if (j == "id") {
                            var td = '<td><a class="child" href="' + baseApiUrl + root + "/" + tableRows[k][j] + '">' + tableRows[k][j] + '</a></td>';
                            tr = tr + td;
                        } else {
                            var td = '<td>' + tableRows[k][j] + '</td>';
                            tr = tr + td;
                        }
                    }
                    tr = tr + "</tr>"
                }
                tbody.append(tr);
            }*/
        }
    }

})(nx);