/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />

(function () {

    p1p.namespace('linkbuilding');

    var allProjects;
    var allArticles;
    var allUsernames = [];
    var currentLink;
    var articlesForProject;
    var modeId = 1;
    var outreachForCurrentLink;
    var isCopy = false;
    var currentUser;
    var isDuplicateRootUrl = false;
    var filteredLinks = [];
    var onlyMine = true;
    var personas;
    var selectedProject;

    var model = {
        topics: {
            allProjectsRetrieved: $.Callbacks(),
            allArticlesRetrieved: $.Callbacks(),
            articleSaved: $.Callbacks(),
            allEmployeeUsernamesRetrieved: $.Callbacks(),
            currentLinkSet: $.Callbacks(),
            outreachRetrieved: $.Callbacks(),
            currentUserRetrieved: $.Callbacks(),
            linkSaved: $.Callbacks(),
            linkUpdated: $.Callbacks(),
            activeRequested: $.Callbacks(),
            duplicateCheckRetrieved: $.Callbacks(),
            outreachSaved: $.Callbacks(),
            filteredLinksRetrieved: $.Callbacks(),
            personasRetrieved: $.Callbacks(),            
        },       

        fetchAllProjects: function () {
            $.getJSON('/api/Project/GetAll', function (data) {
                allProjects = data;
                model.topics.allProjectsRetrieved.fire();
            });
        },

        selectProject: function(project){
            selectedProject = project;
            model.fetchPersonas(selectedProject.Id);
        },
        getSelectedProject: function(){
            return selectedProject;
        },
        getAllProjects: function () {
            return allProjects;
        },

        getActiveProjects: function () {
            return $.grep(allProjects, function (project) {
                return project.IsActive;
            });
        },

        fetchAllArticles: function (projectId) {
            var paramtext = $.param({
                projectId: projectId,
                onlyMine: false,
                includePublished: false,
                teamId: 0
            })
            $.getJSON('/api/article/Search?' + paramtext, function (data) {
                allArticles = data;
                model.topics.allArticlesRetrieved.fire();
            });
        },

        getArticles: function () {
            return allArticles;
        },

        saveArticle: function (article) {
            $.ajax({
                url: '/api/article/add',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(article),
                dataType: 'json'
            }).then(function () {
                model.topics.articleSaved.fire();
            });
        },

        fetchAllEmployeeUsernames: function () {
            $.getJSON('/api/employee/getall', function (data) {
                var allEmployees = data;
                $.each(allEmployees, function (i, employee) {
                    allUsernames.push({ Username: employee.Username });
                });
                model.topics.allEmployeeUsernamesRetrieved.fire();
            });
        },

        fetchPersonas: function (projectId) {
            
            $.getJSON('/api/project/getpersonasforproject?projectid=' + projectId, function (data) {
                personas = data;
                model.topics.personasRetrieved.fire();
            });
        },
        getAllEmployeeUsernames: function () {
            return allUsernames;
        },

            setMode: function (id) {
            modeId = id;
        },

        getMode: function () {
            return modeId;
        },

        fetchOutreachForLink: function () {
            $.getJSON('/api/outreach/getallforlink?linkid=' + currentLink.Id, function (data) {
                outreachForCurrentLink = data;
                model.topics.outreachRetrieved.fire();
            });
        },

        getOutreach: function () {
            return outreachForCurrentLink;
        },

        fetchCurrentUser: function () {
            $.getJSON('/api/user/getcurrentuser', function (data) {
                currentUser = data;
                model.topics.currentUserRetrieved.fire();
            });
        },

        getCurrentUser: function () {
            return currentUser;
        },

        setCurrentLink: function (link) {
            currentLink = link;
            model.selectProject(link.Project);
            model.topics.currentLinkSet.fire();
        },

        getCurrentLink: function () {
            return currentLink;
        },

        clearCurrentLink: function () {
            currentLink = null;
        },

        setIsCopy: function (bool) {
            isCopy = bool;
        },

        getIsCopy: function () {
            return isCopy;
        },

        getPersonas: function(){
            return personas;
        },

        saveLink: function (link) {
            $.ajax({
                url: '/api/link/add',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(link),
                dataType: 'json'
            }).then(function (data) {
                model.setCurrentLink(data);
                model.topics.linkSaved.fire();
            });
        },

        updateLink: function (link) {
            $.ajax({
                url: '/api/link/update',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(link),
                dataType: 'json',
            }).then(function (data) {
                model.setCurrentLink(data);
                model.topics.linkUpdated.fire();
            })
        },

        requestActive: function (link) {
            $.ajax({
                url: '/api/link/requestactive',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(link),
                dataType: 'json',
            }).then(function (data) {
                model.setCurrentLink(data);
                model.topics.activeRequested.fire();
            })
        },

        isDuplicateRootUrlCheck: function (url, projectId) {
            var paramText = $.param({
                url: url,
                projectId: projectId
            });
            $.getJSON('/api/link/isduplicateurl?' + paramText, function (data) {
                isDuplicateRootUrl = data;
                model.topics.duplicateCheckRetrieved.fire();
            });
        },

        getIsDuplicateRootUrl: function () {
            return isDuplicateRootUrl;
        },

        saveOutreach: function (outreach) {
            if (currentLink.LinkStatus.Id == 1) {
                currentLink.LinkStatus.Id = 2
                model.updateLink(currentLink);
            }
            $.ajax({
                url: '/api/outreach/add',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(outreach),
                dataType: 'json'
            }).then(function (data) {
                model.topics.outreachSaved.fire();
            });
        },

        fetchFilteredLinks: function (projectId, status, categoryId, linkStrategy, startDate, endDate) {
            if (!projectId) {
                projectId = 0;
            }
            if (!status) {
                status = 0;
            }
            if (!linkStrategy) {
                linkStrategy = 0;
            }
            if (!categoryId) {
                categoryId = 0;
            }

            var paramText = $.param({
                projectId: projectId,
                status: status,                
                linkStrategy: linkStrategy,
                onlyMine: onlyMine,
                categoryId: categoryId,
                startDate: startDate,
                endDate: endDate,
                includeNotInUse: true,
                teamId: 0,
                isActive: false
            });
            
            $.getJSON('/api/link/Search?' + paramText, function (data) {
                filteredLinks = data;
                model.topics.filteredLinksRetrieved.fire();
            });
        },

        getFilteredLinks: function () {
            return filteredLinks;
        },

        setOnlyMine: function (bool) {
            onlyMine = bool;
        },

        fetchLink: function (id) {
            $.getJSON('/api/link/get?linkid=' + id, function (data) {
                model.setCurrentLink(data);
            });
        }

    }

    p1p.linkbuilding.getModel = function () {
        return model;
    }

})();