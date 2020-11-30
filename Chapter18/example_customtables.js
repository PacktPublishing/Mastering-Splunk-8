require([
    "underscore",
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc/tableview",
    "splunkjs/mvc/simplexml/ready!"
], function(
   _,
   SearchManager,
   TableView
) {

    // Set up search managers
    var search1 = new SearchManager({
        id: "search1",
        search: "index=_internal | head 10000 | stats sparkline count by sourcetype | rangemap field=count low=0-100 elevated=101-1000 default=severe",
        earliest_time: "-1h@h",
        latest_time: "now",
        preview: true,
        cache: true
    });

    var search2 = new SearchManager({
        id: "search2",
        preview: true,
        cache: true,
        search: "index=_internal | stats count by sourcetype, source, host"
    });

    // Create a table
    var myplaintable = new TableView({
        id: "table-plain",
        managerid: "search1",
        el: $("#table-plain")
    }).render();

    // Create a custom table and set sparkline properties
    var mycustomcelltable = new TableView({
        id: "table-customcell",
        managerid: "search1",
        el: $("#table-customcell"),
        // Format the sparkline cell
        format: {
            "sparkline": [ // This field name is required
                {
                    "type": "sparkline", // This property must be "sparkline"

                    // Sparkline options
                    "options":
                    {
                        "type": "bar",
                        "height": "40px",
                        "barWidth": "5px",
                        "colorMap":
                        {
                            "100:": "#0033CC",
                            ":99": "#00FF00"
                        }
                    }
                }
            ]
        }
    });

    // Create a table for a custom row expander
    var mycustomrowtable = new TableView({
        id: "table-customrow",
        managerid: "search2",
        drilldown: "none",
        el: $("#table-customrow")
    });

    // Define icons for the custom table cell
    var ICONS = {
        severe: "alert-circle",
        elevated: "alert",
        low: "check-circle"
    };

    // Use the BaseCellRenderer class to create a custom table cell renderer
    var CustomCellRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cellData) {
            // This method returns "true" for the "range" field
            return cellData.field === "range";
        },

        // This render function only works when canRender returns "true"
        render: function($td, cellData) {
            console.log("cellData: ", cellData);

            var icon = "question";
            if(ICONS.hasOwnProperty(cellData.value)) {
                icon = ICONS[cellData.value];
            }
            $td.addClass("icon").html(_.template('<i class="icon-<%-icon%> <%- range %>" title="<%- range %>"></i>', {
                icon: icon,
                range: cellData.value
            }));
        }
    });

    // Use the BasicRowRenderer class to create a custom table row renderer
    var CustomRowRenderer = TableView.BaseRowExpansionRenderer.extend({
        canRender: function(rowData) {
            console.log("RowData: ", rowData);
            return true;
        },

        render: function($container, rowData) {
        // Print the rowData object to the console
        console.log("RowData: ", rowData);

        // Display some of the rowData in the expanded row
        $container.append("<div>"
            + "<b>rowIndex</b>: " + rowData.rowIndex + "<br>"
            + "<b>colspan</b>: " + rowData.colspan + "<br>"
            + "<b>fields</b>: " + rowData.fields + "<br>"
            + "<b>values</b>: " + rowData.values
            + "</div>");
        }
    });

    // Create an instance of the custom cell renderer,
    // add it to the table, and render the table
    var myCellRenderer = new CustomCellRenderer();
    mycustomcelltable.addCellRenderer(myCellRenderer);
    mycustomcelltable.render();

    // Create an instance of the custom row renderer,
    // add it to the table, and render the table
    var myRowRenderer = new CustomRowRenderer();
    mycustomrowtable.addRowExpansionRenderer(myRowRenderer);
    mycustomrowtable.render();
});

