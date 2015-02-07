/// <reference path="../lib/kendo/js/jquery.js" />
/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/kendo/js/kendo.all.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="keywordresearchmodel.js" />
(function () {
    var model = p1p.keywordresearch.getModel();

    function initUi() {
        
        $('#selectClient').kendoComboBox();
        $('#selectUrl').kendoComboBox();

        taskStatus();
        keywordConcepts();
        keywordCompetitors();
    }

    function taskStatus() {
        var tasks = model.getKeywordTasks();

        $.each(tasks, function (i, tsk) {
            var row = $('<tr/>');
            $.data(row, 'task', tsk);
            row.append('<td>' + tsk.Name + '</td>');
            row.append('<td>' + tsk.Description + '</td>');
            row.append('<td><input class="taskcompletionstatus"/></td>');

            $('#tblKeywordTasks').append(row);

        });

        $('.taskcompletionstatus').kendoSlider({
            min: 0,
            max: 100,
            smallStep: 10,
            largeStep: 25,
            value: 0
        });
    }

    function keywordConcepts() {
        $.each(model.getKeywordConcepts(), function (i, concept) {
            var conceptContainer = $('<div class="conceptcontainer"/>');
            var conceptHeader = $('<div class="heading-brown">Concept ' + (i+1) + ':  ' + concept.Concept + '</div>');
            conceptContainer.append(conceptHeader);
            conceptContainer.append('<div class="keywordentry"/>');
            $('#keywordconcepts').append(conceptContainer);
        });

        $('.keywordentry').kendoGrid({
            editable: true,
            toolbar: ["create"],
            columns: [
                { field: "RecommendationOrdinal", title: "Recommendation"},
                { field: "Keyword", title: "Keyword" },
                { field: "SearchVolume", title: "Search Volume" },
                { field: "CurrentRank", title: "Rank" },
                { field: "LandingPage", title: "Ranking Landing Page" },
                { command: "destroy", title: "&nbsp;", width: 90 }
            ]
        });
    }

    function keywordCompetitors() {
        $.each(model.getKeywordConcepts(), function (i, concept) {
            var competitorContainer = $('<div class="competitorcontainer"/>');
            var competitorHeader = $('<div class="heading-orange">Concept ' + (i + 1) + ':  ' + concept.Concept + '</div>');
            competitorContainer.append(competitorHeader);
            competitorContainer.append('<div class="competitorentry"/>');
            $('#keywordcompetitors').append(competitorContainer);
        });

        $('.competitorentry').kendoGrid({
            editable: true,
            toolbar: ["create"],
            columns: [
                { field: "Url", title: "Url" },
                { field: "AverageDomainAuthority", title: "Avg. DA" },
                { field: "DomainAuthority", title: "DA" },
                { field: "PageAuthority", title: "PA" },
                { field: "Notes", title: "Notes"}, 
                { command: "destroy", title: "&nbsp;", width: 90 }
            ]
        });
    }

    $(initUi);
})();