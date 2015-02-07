/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />
(function () {
    p1p.namespace('manage');
    var isUserClient = false;
    var currentProfile = null;
    var model = {
        getTest: function () { return 'Testing Success!'; },

        topics: {
            isUserClientChecked: $.Callbacks(),
            profileChangesSaved: $.Callbacks(),
            changePasswordSuccessful: $.Callbacks(),
            changePasswordUnsuccessful: $.Callbacks(),
            userProfileRetrieved: $.Callbacks(),
        },

        getIsUserClient: function () { return isUserClient; },
        getCurrentProfile: function () { return currentProfile; },

        fetchUserProfile: function () {
            var url;
            if (isUserClient) {
                url = '/api/Customer/GetByUser';
            } else {
                url = '/api/Employee/GetByUser';
            }
            $.getJSON(url, function (data) {
                currentProfile = data;
                model.topics.userProfileRetrieved.fire();
            });
        },

        checkIsUserClient: function () {
            $.getJSON('/api/user/isuseringroup?roleName=Client', function (data) {
                isUserClient = data;
                model.topics.isUserClientChecked.fire();
            });
        },

        savePersona: function (info) {
            $.ajax({
                url: '/api/Customer/Update',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(info),
                dataType: 'json'
            }).then(function (data) {
                currentProfile = data;
                model.topics.personaSaved.fire();
            });
        },

        saveClientDetail: function (info) {
            $.ajax({
                url: '/api/Customer/Update',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(info),
                dataType: 'json'
            }).then(function (data) {
                currentProfile = data;
                model.topics.clientDetailSaved.fire();
            });
        },

        saveProfileChanges: function (info) {
            var apiUrl = null;
            if (isUserClient) {
                apiUrl = '/api/Customer/Update';
            } else {
                apiUrl = '/api/Employee/Update';
            }

            $.ajax({
                url: apiUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(info),
                dataType: 'json'
            }).then(function (data) {
                currentProfile = data;
                model.topics.profileChangesSaved.fire();
            });
        },

        changePassword: function (oldPw, newPw) {
            var paramText = $.param({
                oldPassword: oldPw,
                newPassword: newPw
            });
            $.getJSON('/api/User/ChangePassword?' + paramText, function (data) {
                model.topics.changePasswordSuccessful.fire();                
            });
        }
    };

    p1p.manage.getModel = function () { return model; };

}());