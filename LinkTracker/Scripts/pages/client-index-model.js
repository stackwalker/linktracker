/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />

(function () {
    p1p.namespace('client');

    var currentAccountId;
    var availableProjects;
    var selectedProject;
    var periodHours;
    var periodOutreach;
    var periodLinks;
    var totalHours;
    var hoursPerLink;
    var totalOutreach;
    var linksInCommunication;
    var linksPending;
    var linksScheduled;
    var totalLinks;
    var averageDomainAuthority;
    var uniqueDomainCount;
    var sitesTargeted;
    var aggregateHours;
    var aggregateOutreach;
    var aggregateLinksByType;
    var aggregateAnchorText;
    var currentCustomer;
    var isUserClient;
    var activeLinks;
    var truncatedAggregateAnchorText = [];
    var cycleStart;

    var model = {

        topics: {
            periodDataRetrieved: $.Callbacks(),
            projectsRetrieved: $.Callbacks(),
            customerRetrieved: $.Callbacks(),
            projectSelected: $.Callbacks(),
            isUserClientChecked: $.Callbacks(),
            clientOutreachBuilt: $.Callbacks(),
            activeLinksBuilt: $.Callbacks(),
            serverProcessing: $.Callbacks(),
            cycleStartRetrieved: $.Callbacks(),
        },

        getAvailableProjects: function () { return availableProjects; },
        getCurrentHours: function () { return periodHours; },
        getCurrentOutreach: function () { return periodOutreach; },
        getCurrentLinks: function () { return periodLinks; },
        getTotalHours: function () { return totalHours; },
        getHoursPerLink: function () { return hoursPerLink; },
        getTotalOutreach: function () { return totalOutreach; },
        getLinksInCommunication: function () { return linksInCommunication; },
        getLinksPending: function () { return linksPending; },
        getScheduled: function () { return linksScheduled; },
        getTotalLinks: function () { return totalLinks; },
        getAverageDomainAuthority: function () { return averageDomainAuthority; },
        getUniqueDomainCount: function () { return uniqueDomainCount; },
        getAggregateHours: function () { return aggregateHours; },
        getAggregateOutreach: function () { return aggregateOutreach; },
        getAggregateLinksByType: function () { return aggregateLinksByType; },
        getAggregateAnchorText: function () { return aggregateAnchorText; },
        getCurrentCustomer: function () { return currentCustomer; },
        getSelectedProject: function () { return selectedProject; },
        getActiveLinks: function () { return activeLinks; },
        getAggregateAnchorTextTrunc: function () { return truncatedAggregateAnchorText },
        getSitesTargeted: function () { return sitesTargeted },
        getCycleStart: function () { return cycleStart },

        fetchCycleStart: function (projectId) {
            $.getJSON('/api/clientreport/getcyclestart?projectId=' + projectId, function (data) {
                cycleStart = data;
                model.topics.cycleStartRetrieved.fire();
            });
        },

        getIsUserClient: function () {
            return isUserClient;
        },

        fetchCustomerForUser: function () {
            $.getJSON('/api/Customer/GetByUser', function (data) {
                currentCustomer = data;
                model.topics.customerRetrieved.fire();
                console.log(data);
            });
        },

        checkIsUserClient: function () {
            $.getJSON('/api/User/IsUserInGroup?roleName=Client', function (data) {
                isUserClient = data;
                model.topics.isUserClientChecked.fire();
            });
        },

        fetchProjects: function () {
            var url;

            if (isUserClient) {
                url = '/api/Project/GetProjectsForUser';
            } else {
                url = '/api/Project/GetAll';
            }
            $.getJSON(url, function (data) {
                availableProjects = data;                
                model.topics.projectsRetrieved.fire();
            });
        },

        selectProject: function (projId) {
            selectedProject = $.grep(availableProjects, function (prj) {
                return prj.Id == projId;
            })[0];
            model.topics.projectSelected.fire();
        },

        fetchPeriodData: function (startDate, endDate) {
            model.topics.serverProcessing.fire();
            var paramText = $.param({ projectId: selectedProject.Id, startDate: startDate, endDate: endDate });
            truncatedAggregateAnchorText = [];

            $.getJSON('/api/ClientReport/GetPeriodData?' + paramText, function (data) {
                periodHours = data.PeriodHours;
                periodOutreach = data.PeriodOutreach;
                periodLinks = data.PeriodLinks;
                totalHours = data.TotalHours;
                hoursPerLink = data.HoursPerLink;
                totalOutreach = data.TotalOutreachCount;
                linksInCommunication = data.LinksInCommunicationCount;
                linksPending = data.LinksPendingCount;
                linksScheduled = data.ScheduledCount;
                totalLinks = data.TotalLinkCount;
                averageDomainAuthority = data.AverageDomainAuthority;
                uniqueDomainCount = data.UniqueDomainCount;
                aggregateHours = data.AggregateHoursByActivity;
                aggregateOutreach = data.AggregateOutreach;
                aggregateLinksByType = data.AggregateLinksByType;
                aggregateAnchorText = data.AggregateAnchorText;
                truncateAggregateAnchorText(data.AggregateAnchorText);
                sitesTargeted = data.SitesTargetedCount;

                buildActiveLinks();
                model.topics.periodDataRetrieved.fire();
            });
        }
    };

    function truncateAggregateAnchorText(allanchortext) {
        $.each(allanchortext, function (i, anchortext) {
            if (anchortext.Unit.length > 40) {
                anchortext.Unit = anchortext.Unit.substring(0, 39) + "...";
            }
            truncatedAggregateAnchorText.push({ Unit: anchortext.Unit, Value: anchortext.Value })
        });
    }


    function buildActiveLinks() {
        activeLinks = $.grep(periodLinks, function (l) {
            return l.LinkStatus.Name === "Link Acquired";
        });
    }

    p1p.client.getModel = function () {
        return model;
    };

})();