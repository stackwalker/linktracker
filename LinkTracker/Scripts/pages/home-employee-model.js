/// <reference path="../lib/kendo/js/kendo.all.min.js" />
/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="home-employee-model.js" />

(function () {
    p1p.namespace('home');
   
    var isUserAdmin = false;
    var onlyMine = false;
    var projects = [];
    var overviewLinks = [];
    var overviewArticles = [];
    var overviewOutreach = [];
    var overviewHours = [];
    var linksToActivate = [];
    var aggregateLinksToActivate = [];
    var sendToLeadership = [];
    var aggregateSendToLeadership = [];
    var outreachLinks = [];
    var aggregateOutreachLinks = [];
    var inCommunication = [];
    var aggregateInCommunication = [];
    var needsFollowUp = [];
    var aggregateNeedsFollowUp = [];
    var acquiredLinks = [];
    var aggregateAcquiredLinks = [];
    var scheduledLinks = [];
    var aggregateScheduledLinks = [];
    var teamId = 0;
    var aggregateInCommunicationByDate = {};
    var aggregateOutreachByDate = {};
    var isUserManager = false;
    var allTeams = [];
    var weeklyNeedsFollowUpAggregate = [];
    var aggregateHoursByProject = [];
    var aggregateHoursByActivity = [];
    var weekLabels = [];
    var aggregateNeedsOutreach = [];
    var needsOutreach = [];

    var model = {
        topics: {
            isUserAdminChecked: $.Callbacks(),
            projectsRetrieved: $.Callbacks(),
            linkDeleted: $.Callbacks(),
            linkActivated: $.Callbacks(),
            isUserManagerChecked: $.Callbacks(),
            teamsRetrieved: $.Callbacks(),
            reportRetrieved: $.Callbacks(),
            needsFollowUpRetrieved: $.Callbacks(),
            scheduledLinksRetrieved: $.Callbacks(),
            outreachLinksRetrieved: $.Callbacks(),
            inCommunicationLinksRetrieved: $.Callbacks(),
            linksToActivateRetrieved: $.Callbacks(),
            sendToLeadershipLinksRetrieved: $.Callbacks(),
            acquiredLinksRetrieved: $.Callbacks(),
            outreachLinksRetrieved: $.Callbacks(),
            overviewHoursRetrieved: $.Callbacks(),
            overviewOutreachRetrieved: $.Callbacks(),
            needsOutreachLinksRetrieved: $.Callbacks(),
            retrievingReport: $.Callbacks()
        },

        getWeeklyNeedsFollowUpAggregate: function () {
            return weeklyNeedsFollowUpAggregate;
        },

        checkIsUserAdmin: function () {
            $.getJSON('/api/user/isuseringroup?roleName=Admin', function (data) {
                isUserAdmin = data;
                model.topics.isUserAdminChecked.fire();
            });
        },

        checkIsUserManager: function () {
            $.getJSON('/api/user/isuseringroup?roleName=Manager', function (data) {
                isUserManager = data;
                model.topics.isUserManagerChecked.fire();                
            })
        },

        fetchTeams: function () {
            $.getJSON('/api/Team/GetAll', function (data) {
                allTeams = data;
                model.topics.teamsRetrieved.fire();
            });
        },

        getAggregateHoursByProject: function () {
            return aggregateHoursByProject;
        },

        getAggregateHoursByActivity: function () {
            return aggregateHoursByActivity;
        },

        getTeams: function () {
            return allTeams;
        },

        setTeam: function (id) {
            if (id === "") {
                teamId = 0;
            } else {
                teamId = id;
            }
        },

        getIsUserManager: function () {
            return isUserManager;
        },

        getIsUserAdmin: function () {
            return isUserAdmin;
        },
                
        getLinksToActivate: function () {
            return linksToActivate;
        },

        getAggregateLinksToActivate: function () {
            return aggregateLinksToActivate;
        },

        getSendToLeadership: function () {
            return sendToLeadership;
        },

        getAggregateSendToLeadership: function () {
            return aggregateSendToLeadership
        },

        getOutreachLinks: function () {
            return outreachLinks;
        },

        getAggregateOutreachLinks: function () {
            return aggregateOutreachLinks;
        },

        getInCommunication: function () {
            return inCommunication;
        },

        getAggregateInCommunication: function () {
            return aggregateInCommunication;
        },

        getNeedsFollowUp: function () {
            return needsFollowUp;
        },

        getAggregateNeedsFollowUp: function () {
            return aggregateNeedsFollowUp;
        },

        getAcquiredLinks: function () {
            return acquiredLinks;
        },

        getAggregateAcquiredLinks: function () {
            return aggregateAcquiredLinks;
        },

        getOverviewOutreach: function () {
            return overviewOutreach;
        },

        getOverviewHours: function () {
            return overviewHours;
        },

        getOverviewArticles: function () {
            return overviewArticles;
        },

        getAggregateScheduledLinks: function () {
            return aggregateScheduledLinks;
        },

        getScheduledLinks: function () {
            return scheduledLinks;
        },

        getWeekLabels: function () {
            return weekLabels;
        },

        getNeedsOutreach: function () {
            return needsOutreach;
        },

        getAggregateNeedsOutreach: function () {
            return aggregateNeedsOutreach;
        },

        fetchProjects: function () {

            $.getJSON('/api/project/getprojectsforcurrentuserteam', function (data) {
                projects = data;
                model.topics.projectsRetrieved.fire();
            });
        },

        fetchOverviewData: function (projectId, startDate, endDate) {
            model.topics.retrievingReport.fire();

            var paramText = {
                projectId: 0,
                onlyMine: onlyMine,
                startDate: startDate,
                endDate: endDate,
                teamId: teamId
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/Report/GetEmployeeDashboardReport?' + $.param(paramText), function (data) {
                aggregateNeedsFollowUp = data.NeedsAttentionProjectAggregates;
                weeklyNeedsFollowUpAggregate = data.NeedsAttentionWeeksAggregates;
                aggregateScheduledLinks = data.ScheduledLinkAggregates;
                aggregateOutreachLinks = buildAggregatesForStackedBar(data.OutreachLinkAggregates);
                aggregateInCommunication = buildAggregatesForStackedBar(data.InCommunicationLinkAggregates);
                aggregateLinksToActivate = buildAggregatesForStackedBar(data.LinksToActivateAggregates);
                aggregateSendToLeadership = buildAggregatesForStackedBar(data.SendToLeadershipLinkAggregates);
                aggregateAcquiredLinks = data.AcquiredLinkAggregates;
                aggregateHoursByActivity = data.TimeEntryActivityAggregates;
                aggregateHoursByProject = data.TimeEntryProjectAggregates;
                aggregateOutreachByDate = data.OutreachAggregatesByDate;
                aggregateInCommunicationByDate = data.InCommunicationLinkAggregatesByDate;
                overviewArticles = data.Articles;
                weekLabels = data.Weeks;
                aggregateNeedsOutreach = buildAggregatesForStackedBar(data.NeedsOutreachLinkAggregates);

                model.topics.reportRetrieved.fire();
            });
        },

        fetchNeedsFollowUp: function (projectId) {
            var todayDate = new Date();
            var nfEndDate = new Date();

            nfEndDate.setDate(todayDate.getDate() - 5);          

            var paramText = {
                projectId: 0,
                status: 0,                
                linkStrategy: 0,
                onlyMine: onlyMine,
                categoryId: 0,
                startDate: null,
                endDate: nfEndDate.toDateString(),
                includeNotInUse: false,
                teamId: teamId,
                isActive: false
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/link/search?' + $.param(paramText), function (data) {
                needsFollowUp = data;
                model.topics.needsFollowUpRetrieved.fire();
            });
        },

        fetchScheduledLinks: function (projectId) {
            var paramText = {
                projectId: 0,
                status: 11,
                linkStrategy: 0,
                onlyMine: onlyMine,
                categoryId: 0,
                startDate: null,
                endDate: null,
                includeNotInUse: true,
                teamId: teamId,
                isActive: false
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/link/search?' + $.param(paramText), function (data) {
                scheduledLinks = data;
                model.topics.scheduledLinksRetrieved.fire();
            });
        },

        fetchOutreachLinks: function (projectId) {
            var paramText = {
                projectId: 0,
                status: 2,
                linkStrategy: 0,
                onlyMine: onlyMine,
                categoryId: 0,
                startDate: null,
                endDate: null,
                includeNotInUse: true,
                teamId: teamId,
                isActive: false
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/link/search?' + $.param(paramText), function (data) {
                outreachLinks = data;
                model.topics.outreachLinksRetrieved.fire();
            });
        },

        fetchInCommunication: function (projectId) {
            var paramText = {
                projectId: 0,
                status: 3,
                linkStrategy: 0,
                onlyMine: onlyMine,
                categoryId: 0,
                startDate: null,
                endDate: null,
                includeNotInUse: true,
                teamId: teamId,
                isActive: false
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/link/search?' + $.param(paramText), function (data) {
                inCommunication = data;
                model.topics.inCommunicationLinksRetrieved.fire();
            });
        },

        fetchLinksToActivate: function (projectId) {
            var paramText = {
                projectId: 0,
                status: 14,
                linkStrategy: 0,
                onlyMine: onlyMine,
                categoryId: 0,
                startDate: null,
                endDate: null,
                includeNotInUse: true,
                teamId: teamId,
                isActive: false
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/link/search?' + $.param(paramText), function (data) {
                linksToActivate = data;
                model.topics.linksToActivateRetrieved.fire();
            });
        },

        fetchSendToLeadership: function (projectId) {
            var paramText = {
                projectId: 0,
                status: 7,
                linkStrategy: 0,
                onlyMine: onlyMine,
                categoryId: 0,
                startDate: null,
                endDate: null,
                includeNotInUse: true,
                teamId: teamId,
                isActive: false
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/link/search?' + $.param(paramText), function (data) {
                sendToLeadership = data;
                model.topics.sendToLeadershipLinksRetrieved.fire();
            });
        },

        fetchAcquiredLinks: function (projectId, startDate, endDate) {
            var paramText = {
                projectId: 0,
                status: 10,
                linkStrategy: 0,
                onlyMine: onlyMine,
                categoryId: 0,
                startDate: startDate,
                endDate: endDate,
                includeNotInUse: true,
                teamId: teamId,
                isActive: true
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/link/search?' + $.param(paramText), function (data) {
                acquiredLinks = data;
                model.topics.acquiredLinksRetrieved.fire();
            });
        },

        fetchNeedsOutreach: function (projectId) {
            var paramText = {
                projectId: 0,
                status: 1,
                linkStrategy: 0,
                onlyMine: onlyMine,
                categoryId: 0,
                startDate: null,
                endDate: null,
                includeNotInUse: true,
                teamId: teamId,
                isActive: false
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/link/search?' + $.param(paramText), function (data) {
                needsOutreach = data;
                model.topics.needsOutreachLinksRetrieved.fire();
            });
        },

        fetchHours: function (projectId, startDate, endDate) {
            var paramText = {
                projectId: 0,
                onlyMine: onlyMine,
                startDate: startDate,
                endDate: endDate,
                teamId: teamId,
                activity: null
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/timeentry/search?' + $.param(paramText), function (data) {
                overviewHours = data;
                model.topics.overviewHoursRetrieved.fire();
            });
        },

        fetchOutreach: function (projectId, startDate, endDate) {
            var paramText = {
                linkId: 0,
                projectId: 0,
                typeId: 0,
                actionId: 0,
                startDate: startDate,
                endDate: endDate,
                onlyMine: onlyMine,
                teamId: teamId,
            }

            if (projectId) {
                paramText.projectId = projectId;
            }

            $.getJSON('/api/outreach/search?' + $.param(paramText), function (data) {
                overviewOutreach = data;
                model.topics.overviewOutreachRetrieved.fire();
            });
        },


        fetchUserTeam: function () {
            $.getJSON('/api/team/GetIdByCurrentUser', function (data) {
                teamId = data;
                model.checkIsUserAdmin();
            });
        },

        getProjects: function () {
            return projects;
        },

        setOnlyMine: function (bool) {
            onlyMine = bool;
        },

        deleteLink: function (linkId) {
            $.getJSON('/api/Link/Delete?LinkId=' + linkId, function () {
                model.topics.linkDeleted.fire();
            });
        },

        activateLink: function (link) {
            $.ajax({
                url: '/api/link/activate',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(link),
                dataType: 'json',
            }).then(function () {
                model.fetchLinksToActivate();
                model.topics.linkActivated.fire();
            });
        },

        getAggregateInCommunicationByDate: function () {
            return aggregateInCommunicationByDate;
        },

        getAggregateOutreachByDate: function () {
            return aggregateOutreachByDate;
        }

    }    

    function buildAggregatesForStackedBar(aggregates) {
        var aggregate = [];

        $.each(aggregates, function (i, a) {
            aggregate.push({ Name: a.Name, data: [a.Aggregate] });
        });

        return aggregate;
    }

    p1p.home.getModel = function () {
        return model;
    }

}());