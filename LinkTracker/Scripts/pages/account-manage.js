/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="managemodel.js" />
(function () {
    var model = p1p.manage.getModel();

    function initui() {
        console.log(model.getTest());

        model.checkIsUserClient();

        model.topics.isUserClientChecked.add(function () {
            manageContent();
        });

        
        $('#resetProfile').click(function () {
            manageContent();
        });

        function manageContent() {
            var profile;
            model.fetchUserProfile();

            if (!model.getIsUserClient()) {
                $('#profile-first-name').prop('disabled', true);
                $('#profile-last-name').prop('disabled', true);
            }

            if (model.getIsUserClient()) {
                $('.clientInfo').fadeIn('fast');
            }

            model.topics.userProfileRetrieved.add(populateProfile);

            $('#saveProfileChanges').click(saveProfileChanges);
            $('#savePassword').click(savePassword);

            function populateProfile() {
                profile = model.getCurrentProfile();

                $('#profile-first-name').val(profile.FirstName);
                $('#profile-last-name').val(profile.LastName);
                $('#email').val(profile.Email);

                if (model.getIsUserClient()) {
                    $('#profile-business-name').val(profile.BusinessName);
                    $('#website').val(profile.WebsiteURL);
                    $('#phone').val(profile.Phone);
                    $('#profile-street-address').val(profile.StreetAddress);
                    $('#profile-city').val(profile.City);
                    $('#profile-state').val(profile.State);
                    $('#profile-zip').val(profile.Zip);
                }
            }

            function saveProfileChanges() {
                profile.FirstName = $('#profile-first-name').val();
                profile.LastName = $('#profile-last-name').val();
                profile.Email = $('#email').val();

                if (model.getIsUserClient()) {
                    profile.BusinessName = $('#profile-business-name').val();
                    profile.WebsiteURL = $('#website').val();
                    profile.Phone = $('#phone').val();
                    profile.StreetAddress = $('#profile-street-address').val();
                    profile.City = $('#profile-city').val();
                    profile.State = $('#profile-state').val();
                    profile.Zip = $('#profile-zip').val();
                }

                model.saveProfileChanges(profile);
                
                model.topics.profileChangesSaved.add(function () {
                    $('#changesSavedConfirmation').fadeIn('fast');
                });
            }


            function savePassword() {
                model.topics.changePasswordSuccessful.add(function () {
                    $('#pwSavedConfirmation').fadeIn('fast');
                });

                model.topics.changePasswordUnsuccessful.add(function () {
                    $('#pwNotSavedConfirmation').fadeIn('fast');
                });
                if ($('#newPw').val()) {
                    if (!$('#pw').val()) {
                        $('#noPw').fadeIn('fast');
                    } else {
                        if ($('#newPw').val().length < 6) {
                            $('#pwNotLong').fadeIn('fast');
                        } else {
                            if ($('#newPw').val() !== $('#confirmNewPw').val()) {
                                $('#pwNotMatch').fadeIn('fast');
                            } else {
                                model.changePassword($('#pw').val(), $('#newPw').val());
                            }
                        }
                    }
                }
            }
        }
    }

    $(initui);

}());