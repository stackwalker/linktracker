/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />

(function () {
    p1p.namespace('hoursUpload');
    var failedHours = [];

    var model = {

        topics: {
            hoursFileUploaded: $.Callbacks(),
            hoursParsed: $.Callbacks(),
            hoursSaved: $.Callbacks(),
        },

        getFailedHours: function () { return failedHours; },

        saveHours: function (hours) {
            $.ajax({
                url: '/api/TimeEntry/Add',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(hours),
                dataType: 'json'
            }).then(function (data) {
                failedHours = data;
                model.topics.hoursSaved.fire();
                console.log(failedHours);
            });
        }
    }

    p1p.hoursUpload.getModel = function () {
        return model;
    }

}());