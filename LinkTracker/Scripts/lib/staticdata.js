(function () {
    p1p.namespace("staticdata");

    p1p.staticdata.initializeStaticData = function (callback) {
        var staticData = {};
        var localDataVer = localStorage['p1pStaticDataVersion'];
        var remoteDataVer;

        $.ajax({
            url: '/api/StaticData/GetStaticDataVersion',
            type: 'GET',
            async: false,
            dataType: 'json'
        }).then(function (data) {
            remoteDataVer = data;
        });

        if (localDataVer != remoteDataVer) {
            getStaticData();
        }

        function getStaticData() {
            $.ajax({
                url: '/api/StaticData/GetBillingCycles',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.BillingCycles = data;
            });

            $.ajax({
                url: '/api/StaticData/GetSiteCategories',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.SiteCategories = data;
            });

            $.ajax({
                url: '/api/StaticData/GetLinkLocations',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.LinkLocations = data;
            });

            $.ajax({
                url: '/api/StaticData/GetLinkStatuses',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.LinkStatuses = data;
            });

            $.ajax({
                url: '/api/StaticData/GetOutreachActions',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.OutreachActions = data;
            });

            $.ajax({
                url: '/api/StaticData/GetOutreachTypes',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.OutreachTypes = data;
            });

            $.ajax({
                url: '/api/StaticData/GetLinkTypes',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.LinkTypes = data;
            });

            $.ajax({
                url: '/api/StaticData/GetLinkStrategies',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.LinkStrategies = data;
            });

            $.ajax({
                url: '/api/StaticData/GetLinkBuildingModes',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.LinkBuildingModes = data;
            });

            $.ajax({
                url: '/api/StaticData/GetArticleStatuses',
                type: 'GET',
                async: false,
                dataType: 'json'
            }).then(function (data) {
                staticData.ArticleStatuses = data;
            });
            localStorage['staticData'] = JSON.stringify(staticData);
            localStorage['p1pStaticDataVersion'] = remoteDataVer;
        }

        callback();
    };

    p1p.staticdata.getBillingCycles = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.BillingCycles;
    };

    p1p.staticdata.getSiteCategories = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.SiteCategories;
    };

    p1p.staticdata.getLinkLocations = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.LinkLocations;
    };

    p1p.staticdata.getLinkStatuses = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.LinkStatuses;
    };

    p1p.staticdata.getOutreachActions = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.OutreachActions;
    };
    
    p1p.staticdata.getOutreachTypes = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.OutreachTypes;
    };

    p1p.staticdata.getLinkTypes = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.LinkTypes;
    };

    p1p.staticdata.getLinkStrategies = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.LinkStrategies;
    };

    p1p.staticdata.getLinkBuildingModes = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.LinkBuildingModes;
    };

    p1p.staticdata.getArticleStatuses = function () {
        var staticData = JSON.parse(localStorage['staticData']);
        return staticData.ArticleStatuses;
    };

}());