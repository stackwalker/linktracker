/// <reference path="../lib/p1p.js" />
(function () {
    p1p.namespace('winnersadministration');

    var activeLinks;

    var model = {
        topics: {
            activeLinksRetrieved: $.Callbacks()
        },
        fetchActiveLinks: function(){
            var startDate = kendo.toString(kendo.parseDate(new Date(1970, 0, 1)), "MM/dd/yyyy");
            var endDate = kendo.toString(kendo.parseDate(new Date()), "MM/dd/yyyy");
            var params = $.param({
                projectId: 0,
                status: 10,
                category: null,
                linkStrategy: 0,
                onlyMine: false,
                startDate: startDate,
                endDate: endDate,
                includeNotInUse: true,
                teamId: 0,
                isActive: true
            });

            $.getJSON('/api/Link/Search?' + params, function (data) {
                activeLinks = data;
                model.topics.activeLinksRetrieved.fire();
            });
        },
        updateLink: function (link) {
            $.ajax({
                url: '/api/link/update',
                type: 'POST',
                data: link,
                dataType: 'json',
            }).then(function (data) {
                model.fetchActiveLinks();
            });
        },
        getActiveLinks: function () {
            return activeLinks;
        }
    };

    p1p.winnersadministration.getModel = function () {
        return model;
    };
})();