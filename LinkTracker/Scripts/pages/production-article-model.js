/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/staticdata.js" />
(function () {
    p1p.namespace('articlemanager');

    var currentSummaryArticles;
    var selectedArticle;
    var allProjects;
    var selectedProject;

    var model = {
        topics: {
            projectsRetrieved: $.Callbacks(),
            summaryArticlesRetrieved: $.Callbacks(),
            articleSelected: $.Callbacks(),
            selectedArticleCleared: $.Callbacks(),
            articleSaved: $.Callbacks(),
            articleDeleted: $.Callbacks()
        },
        fetchProjects: function () {
            var self = this;
            $.getJSON('/api/Project/GetAllActive', function (data) {
                allProjects = data;
                self.topics.projectsRetrieved.fire();
            });
        },
        getProjects: function () {
            return allProjects;
        },
        selectProject: function(project){
            selectedProject = project;
        },
        getSelectedProject: function(){
            return selectedProject;
        },
        fetchSummaryArticles: function (projectId, onlyMine, includePublished) {
            
            if (!projectId) { projectId = 0; }

            var paramText = $.param({ projectId: projectId, onlyMine: onlyMine, includePublished: includePublished, teamId: 0 });

            $.getJSON('/api/Article/Search?' + paramText, function (data) {
                currentSummaryArticles = data;
                model.topics.summaryArticlesRetrieved.fire();            
            });
            
        },
        getSummaryArticles: function () {
            return currentSummaryArticles;
        },
        selectArticle: function (articleId) {
            var parmText = $.param({Id: articleId})
            $.getJSON('/api/Article/Get?' + parmText, function (data) {
                selectedArticle = data;
                model.topics.articleSelected.fire();
            });
        },
        saveArticle: function (article) {
            //if an article has an ID that means it already exists
            //TODO This will probably cause bugs since having an ID is dependent
            //on clearing the selected article.
            var url = article.Id ? '/api/Article/Update' : '/api/Article/Add';

            $.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(article),
                dataType: 'json'
            }).then(function () {
                model.topics.articleSaved.fire();
            });
        },
        clearSelectedArticle: function(){
            selectedArticle = null;
            this.topics.selectedArticleCleared.fire();
        },
        getSelectedArticle: function () {
            return selectedArticle;
        },

        deleteArticle: function (article) {
            var articleId = article.Id;

            $.getJSON('/api/Article/Delete?articleId=' + articleId, function () {
                model.topics.articleDeleted.fire();
            });
        },

        isArticleEditorDirty: function () {
            return isArticleEditorDirty;
        }
    };
    

    p1p.articlemanager.getModel = function () {
        return model;
    }

})();