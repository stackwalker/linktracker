/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/kendo/js/jquery.min.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/kendo/js/kendo.all.min.js" />
/// <reference path="../lib/localsettings.js" />

(function () {

    p1p.namespace('projectinformation');

    var projects = [];
    var socialAccounts = [];
    var personas = [];
    var personaSocialAccounts = [];
    var keywordsForProject = [];
    var landingPages = [];
    var keywordsForLandingPages = [];
    var isUserAdminOrManager = false;
    var keywordsForLandingPage = [];
    var image;

    var model = {
        topics: {
            projectsRetrieved: $.Callbacks(),
            socialAccountSaved: $.Callbacks(),
            socialAccountsRetrieved: $.Callbacks(),
            socialAccountDeleted: $.Callbacks(),
            socialAccountUpdated: $.Callbacks(),
            personasRetrieved: $.Callbacks(),
            personaSaved: $.Callbacks(),
            personaUpdated: $.Callbacks(),
            personaSocialAccountSaved: $.Callbacks(),
            socialAccountsForPersonaRetrieved: $.Callbacks(),
            personaSocialAccountDeleted: $.Callbacks(),
            keywordsRetrieved: $.Callbacks(),
            landingPagesRetrieved: $.Callbacks(),
            landingPageSaved: $.Callbacks(),
            keywordSaved: $.Callbacks(),
            landingPageUpdated: $.Callbacks(),
            keywordUpdated: $.Callbacks(),
            landingPageDeleted: $.Callbacks(),
            keywordDeleted: $.Callbacks(),
            keywordRemovedFromLandingPage: $.Callbacks(),
            keywordAddedToLandingPage: $.Callbacks(),
            projectUpdated: $.Callbacks(),
            keywordsForLandingPagesRetrieved: $.Callbacks(),
            personaDeleted: $.Callbacks(),
            isUserAdminOrManagerChecked: $.Callbacks(),
            keywordsForLandingPageRetrieved: $.Callbacks(),
            imageUploaded: $.Callbacks()
        },

        uploadImage: function (i) {
            image = i;
            model.topics.imageUploaded.fire();
        },

        getImage: function () {
            return image;
        },

        checkIsUserAdminOrManager: function () {
            $.getJSON('/api/User/isuseringroup?roleName=admin', function (data) {
                isUserAdminOrManager = data;
                if (!isUserAdminOrManager) {
                    $.getJSON('/api/user/isuseringroup?roleName=manager', function (data) {
                        isUserAdminOrManager = data;
                        model.topics.isUserAdminOrManagerChecked.fire();
                    });
                } else {
                    model.topics.isUserAdminOrManagerChecked.fire();
                }
            });
        },

        getIsUserAdminOrManager: function () {
            return isUserAdminOrManager;
        },

        updateProject: function (project) {
            $.ajax({
                url: '/api/project/update',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(project),
                dataType: 'json'
            }).then(function() {
                model.topics.projectUpdated.fire();
            });
        },

        fetchKeywordsForProject: function (projectId) {
            $.getJSON('/api/project/GetKeywordsForProject?projectId=' + projectId, function (data) {
                keywordsForProject = data;
                model.topics.keywordsRetrieved.fire();
            });
        },

        getKeywords: function () {
            return keywordsForProject;
        },

        fetchLandingPagesForProject: function (projectId) {
            $.getJSON('/api/project/getlandingpagesforproject?projectId=' + projectId, function (data) {
                landingPages = data;
                model.topics.landingPagesRetrieved.fire();
            })
        },

        fetchKeywordsForLandingPages: function (projectId) {
            $.getJSON('/api/project/getkeywordsforlandingpages?projectId=' + projectId, function (data) {
                keywordsForLandingPages = data;
                model.topics.keywordsForLandingPagesRetrieved.fire();
            });
        },

        getKeywordsForLandingPages: function () {
            return keywordsForLandingPages;
        },

        fetchKeywordsForLandingPage: function (landingPageId) {
            $.getJSON('/api/project/getkeywordsforlandingpage?landingPageId=' + landingPageId, function (data) {
                keywordsForLandingPage = data;
                model.topics.keywordsForLandingPageRetrieved.fire();
            });
        },

        getKeywordsForLandingPage: function () {
            return keywordsForLandingPage;
        },        

        getLandingPages: function () {
            return landingPages;
        },

        saveLandingPage: function (landingPage) {
            $.ajax({
                url: '/api/project/addlandingpage',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(landingPage),
                dataType: 'json'
            }).then(function () {
                model.topics.landingPageSaved.fire();
            })
        },

        saveKeyword: function (keyword) {
            $.ajax({
                url: '/api/project/addkeyword',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(keyword),
                dataType: 'json'
            }).then(function() {
                model.topics.keywordSaved.fire();
            });
        },

        updateLandingPage: function (landingPage) {
            $.ajax({
                url: '/api/project/updatelandingpage',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(landingPage),
                dataType: 'json'
            }).then(function () {
                model.topics.landingPageUpdated.fire();
            });
        },

        updateKeyword: function (keyword) {
            $.ajax({
                url: '/api/project/updatekeyword',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(keyword),
                dataType: 'json'
            }).then(function () {
                model.topics.keywordUpdated.fire();
            });
        },
        
        deleteLandingPage: function (landingPageId) {
            $.getJSON('/api/project/deletelandingpage?landingpageId=' + landingPageId, function () {
                model.topics.landingPageDeleted.fire();
            });
        },

        deleteKeyword: function (keywordId) {
            $.getJSON('/api/project/deletekeyword?keywordid=' + keywordId, function () {
                model.topics.keywordDeleted.fire();
            });
        },

        addKeywordToLandingPage: function (landingPageId, keywordId) {
            var paramText = $.param({
                landingPageId: landingPageId,
                keywordId: keywordId,
                priority: 0
            });
            $.getJSON('/api/project/addkeywordtolandingpage?' + paramText, function () {
                model.topics.keywordAddedToLandingPage.fire();
            });
        },

        removeKeywordFromLandingPage: function (landingPageId, keywordId) {
            var paramText = $.param({
                landingPageId: landingPageId,
                keywordId: keywordId
            });
            $.getJSON('/api/project/removekeywordfromlandingpage?' + paramText, function () {
                model.topics.keywordRemovedFromLandingPage.fire();
            });
        },

        fetchPersonas: function (projectId) {
            $.getJSON('/api/project/getpersonasforproject?projectid=' + projectId, function(data) {
                personas = data;
                model.topics.personasRetrieved.fire();
            });
        },

        getPersonas: function () {
            return personas;
        },

        deletePersona: function (personaId) {
            $.getJSON('/api/project/deletepersona?personaId=' + personaId, function () {
                model.topics.personaDeleted.fire();
            });
        },

        savePersona: function (persona) {
            $.ajax({
                url: '/api/project/addpersona',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(persona),
                dataType: 'json'
            }).then(function () {
                model.topics.personaSaved.fire();
            });
        },

        updatePersona: function (persona) {
            $.ajax({
                url: '/api/project/updatepersona',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(persona),
                dataType: 'json'
            }).then(function () {
                model.topics.personaUpdated.fire();
            });
        },

        savePersonaSocialAccount: function(acct) {
            $.ajax({
                url: '/api/project/addpersonasocialaccount',
                type: 'Post',
                contentType: 'application/json',
                data: JSON.stringify(acct),
                dataType: 'json'
            }).then(function () {
                model.topics.personaSocialAccountSaved.fire();
            });
        },

        deletePersonaSocialAccount: function (acctId) {
            $.getJSON('/api/project/deletePersonaSocialAccount?socialAccountId=' + acctId, function () {
                model.topics.personaSocialAccountDeleted.fire();
            });
        },
        
        saveSocialAccount: function (acct) {
            $.ajax({
                url: '/api/project/addsocialaccount',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(acct),
                dataType: 'json'
            }).then(function () {
                model.topics.socialAccountSaved.fire();
            });
        },

        fetchSocialAccounts: function (projectId) {
            $.getJSON('/api/project/getSocialAccountsForProject?projectId=' + projectId, function (data) {
                socialAccounts = data;
                model.topics.socialAccountsRetrieved.fire();
            });
        },

        fetchSocialAccountsForPersona: function (personaId) {
            $.getJSON('/api/project/getSocialAccountsForPersona?personaId=' + personaId, function (data) {
                personaSocialAccounts = data;
                model.topics.socialAccountsForPersonaRetrieved.fire();
            })
        },

        getSocialAccountsForPersona: function () {
            return personaSocialAccounts;
        },

        getSocialAccounts: function () {
            return socialAccounts;
        },

        deleteSocialAccount: function (socialAccountId) {
            $.getJSON('/api/project/deleteSocialAccount?socialAccountId=' + socialAccountId, function () {
                model.topics.socialAccountDeleted.fire();
            });
        },

        updateSocialAccount: function (socialAccount) {
            $.ajax({
                url: '/api/project/updatesocialaccount',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(socialAccount),
                dataType: 'json'
            }).then(function () {
                model.topics.socialAccountUpdated.fire();
            });
        },

        fetchProjects: function () {
            $.getJSON('/api/project/getall', function (data) {
                projects = data;
                model.topics.projectsRetrieved.fire();
            });
        },

        getProjects: function () {
            return projects;
        },


    };

    p1p.projectinformation.getModel = function () {
        return model;
    }

}());