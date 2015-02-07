/// <reference path="../lib/kendo/js/jquery.js" />
/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />

(function () {
    p1p.namespace('keywordresearch');

    var model = {
        topics: {

        },
        getKeywordTasks: function () {
            return [
                { Id: 1, Name: 'Average Search Volume', Description: 'Download Google Keyword Planner Report to obtain average monthly search volume and keyword ideas' },
                { Id: 2, Name: 'Competitive Landscape', Description: 'Investigate and report on PA/DA of page 1 Google search results' },
                { Id: 3, Name: 'Current Rankings', Description: 'Pull ranking position and current ranking landing page using rank tracker tool, double check positions in StartPage.Com' },
                { Id: 4, Name: 'Targets and Landing Pages', Description: 'Isolate ideal head keywords & sub keywords from Keyword Discovery report using a combination of search volume and competitive landscape ' }
            ];
        },
        getKeywordConcepts: function () {
            return [
                { Id: 1, Concept: 'Boise Real Estate', Intent: 'Increase search volume for real estate in Boise specifically' },
                { Id: 2, Concept: 'Boise Home Values', Intent: 'Drive traffic for home valuation searches in Boise' },
                { Id: 3, Concept: 'Boise Sale By Owner', Intent: 'Focus on by owner searches in Boise' }
            ];
        }
    };

    p1p.keywordresearch.getModel = function () {
        return model;
    };
})();