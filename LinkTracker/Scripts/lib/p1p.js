(function () {
    if (!window.p1p) {
        window.p1p = {};
    }

    p1p.namespace = function(ns){
        if (!p1p[ns]) {
            p1p[ns] = {};
        }
    }

    p1p.getStringBuilder = function () {
        var data = [];
        var counter = 0;
        return {
            append: function (s) { data[counter++] = s; return this; },
            remove: function (i, j) { data.splice(i, j || 1); return this; },
            insert: function (i, s) { data.splice(i, 0, s); return this; },
            toString: function (s) { return data.join(s || ""); return this; }
        };
    };

    p1p.getLookupObject = function () {
        return {
            startDate: null,
            endDate: null,
            projectId: null,
            employeeId: null,
            teamName: null,
            customerId: null,
            statusId: null,
            category: null,
            linkBuildingMode: null,
            strategyId: null
        };
    };

    p1p.globalEvents = {
        serverProcessing: $.Callbacks(),
        serverProcessComplete: $.Callbacks()
    };

    getColorArray = function () {
        var chartColors = [
            "#95716A",
            "#B9C8B1",
            "#C4B397",
            "#999999",
            "#92BEC1",
            "#90B7FD"
        ]

        var m = chartColors.length, t, i;
            while (m) {
                i = Math.floor(Math.random() * m--);

                t = chartColors[m];
                chartColors[m] = chartColors[i];
                chartColors[i] = t;
            }
            return chartColors;
    }; 

}());