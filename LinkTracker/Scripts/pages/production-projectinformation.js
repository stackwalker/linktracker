/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/kendo/js/jquery.min.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/kendo/js/kendo.all.min.js" />
/// <reference path="../lib/localsettings.js" />
/// <reference path="production-projectinformation-model.js" />


(function () {

    var model = p1p.projectinformation.getModel();

    function initUi() {

        model.fetchProjects();
        model.checkIsUserAdminOrManager();

        $('#tabstrip').kendoTabStrip({
            animation: {
                open: {
                    effects: 'fadeIn'
                }
            }
        });

        $('#select-project').kendoComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            change: function () {
                if ($('#select-project').val()) {
                    var projectId = $('#select-project').val();
                    model.fetchSocialAccounts(projectId);
                    model.fetchPersonas(projectId);
                    model.fetchKeywordsForProject(projectId);
                    model.fetchLandingPagesForProject(projectId);
                    model.fetchLandingPagesForProject($('#select-project').val());

                    var project = $('#select-project').data('kendoComboBox').dataSource.data()[$('#select-project').data('kendoComboBox').select()];

                    $('#big-win').val(project.BigWin);
                    $('#special-requirements').val(project.SpecialRequirements);
                    $('#custom-strategy').val(project.Strategy);
                }
            }
        });

        model.topics.projectsRetrieved.add(function () {
            $('#select-project').data('kendoComboBox').dataSource.data(model.getProjects());
        });

        $('.no-tab').click(function (event) {
            var ts = $('#tabstrip').data('kendoTabStrip');
            ts.enable(ts.tabGroup.children('li:eq(3)'), false);
        });

        socialAccountsTab();
        keywordLandingPageTab();
        personaTab();

    }

    function socialAccountsTab() {
        var selectedAccount;
        socialAccountsGrid();

        function socialAccountsGrid() {
            newSocialAccountWindow();

            $('#grd-social-accounts').kendoGrid({
                scrollable: true,
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    { field: "Name", title: "Name" },
                    { field: "Url", title: "URL" },
                    { field: "Username", title: "Username" },
                    { field: "Password", title: "Password" },
                    { command: { text: "Save", click: updateSocialAccount }, width: '85px' },
                    { command: { text: "Delete", click: deleteSocialAccount }, width: '85px' }
                ],
                editable: true,
                toolbar: [{ name: "create-social-account", text: "New Social Account" }],
                selectable: 'single',
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedAccount = grid.dataItem($(this));
                    });
                }
            });

            $('.k-grid-create-social-account').click(function () {
                $('#win-new-social-account').data('kendoWindow').open();
                $('#win-new-social-account').data('kendoWindow').toFront();
            });

            model.topics.socialAccountsRetrieved.add(function () {
                $('#grd-social-accounts').data('kendoGrid').dataSource.data(model.getSocialAccounts());
            });

            function newSocialAccountWindow() {

                $('#win-new-social-account').kendoWindow({
                    title: "New Social Account",
                    visible: false,
                    width: '700px',
                });

                $('#win-new-social-account').data('kendoWindow').center();
                $('#win-new-social-account').closest('.k-window').css({
                    position: 'fixed',
                    margin: 'auto',
                    top: '10%'
                });

                $('#btn-save-social-account').click(function () {
                    var socialAccount = {
                        Name: $('#new-name').val(),
                        URL: $('#new-url-social-account').val(),
                        Username: $('#new-username').val(),
                        Password: $('#new-password').val(),
                        ProjectId: $('#select-project').data('kendoComboBox').value()
                    }

                    if (!$('#select-project').val()) {
                        alert('You must select a project');
                    } else {
                        model.saveSocialAccount(socialAccount);
                    }

                    model.topics.socialAccountSaved.add(function () {
                        model.fetchSocialAccounts($('#select-project').data('kendoComboBox').value());
                        clearNewSocialAccount();
                        $('#win-new-social-account').data('kendoWindow').close();
                    });
                });

                function clearNewSocialAccount() {
                    $('#new-name').val('');
                    $('#new-url-social-account').val('');
                    $('#new-username').val('');
                    $('#new-password').val('');
                }
            }

            function updateSocialAccount() {
                if (confirm('Are you sure you want to update the ' + selectedAccount.Name + ' acount?')) {
                    model.updateSocialAccount(selectedAccount);
                }
            }

            model.topics.socialAccountUpdated.add(function () {
                model.fetchSocialAccounts($('#select-project').val());
            });

            function deleteSocialAccount() {
                if (confirm('Are you sure you want to delete the ' + selectedAccount.Name + ' account?')) {
                    model.deleteSocialAccount(selectedAccount.Id);
                }
            }

            model.topics.socialAccountDeleted.add(function () {
                model.fetchSocialAccounts($('#select-project').val());
            });
        }
    }
    //End Customer Social Accounts Page

    //Start Keywords & Landing Pages Page
    function keywordLandingPageTab() {
        
        keywordGrid();
        landingPageGrid();

        $('#save-strategies').click(function () {
            var project = $('#select-project').data('kendoComboBox').dataSource.data()[$('#select-project').data('kendoComboBox').select()];
            project.BigWin = $('#big-win').val();
            project.SpecialRequirements = $('#special-requirements').val();
            project.Strategy = $('#custom-strategy').val();

            if (!model.getIsUserAdminOrManager()) {
                alert('You do not have permission to save project strategies.');
            } else {
                model.updateProject(project);
            }
        });

        model.topics.projectUpdated.add(function () {
            model.fetchProjects();
        });

        function keywordGrid() {
            var selectedKeyword;

            newKeywordWindow();

            $('#grd-keywords').kendoGrid({
                scrollable: true,
                sortable: true,
                filterable: true,
                selectable: 'single',
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    { field: "Text", title: "Keyword" },
                    { field: "ProjectPriority", title: "Priority" },
                    { command: { text: "Save", click: updateKeyword }, width: '85px' },
                    { command: { text: "Delete", click: deleteKeyword }, width: '85px' }
                ],
                editable: true,
                toolbar: [{ name: "create-keyword", text: "New Keyword" }],
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedKeyword = grid.dataItem($(this));
                    });
                }
            });

            model.topics.keywordsRetrieved.add(function () {
                $('#grd-keywords').data('kendoGrid').dataSource.data(model.getKeywords());
            });

            $('.k-grid-create-keyword').click(function () {
                $('#win-new-keyword').data('kendoWindow').open();
                $('#win-new-keyword').data('kendoWindow').toFront();
            });

            function newKeywordWindow() {

                $('#win-new-keyword').kendoWindow({
                    title: "New Keyword",
                    visible: false,
                    width: '700px',
                });

                $('#win-new-keyword').data('kendoWindow').center();
                $('#win-new-keyword').closest('.k-window').css({
                    position: 'fixed',
                    margin: 'auto',
                    top: '10%'
                });

                $('#btn-save-keyword').click(function () {
                    var keyword = {
                        Text: $('#new-keyword').val(),
                        ProjectPriority: $('#new-priority-keyword').val(),
                        ProjectId: $('#select-project').val()
                    }
                    if (!$('#select-project').val()) {
                        alert('You must select a project.');
                    } else {
                        model.saveKeyword(keyword);
                    }

                    model.topics.keywordSaved.add(function () {
                        model.fetchKeywordsForProject($('#select-project').val());
                        clearNewKeyword();
                        $('#win-new-keyword').data('kendoWindow').close();
                    });
                });

                function clearNewKeyword() {
                    $('#new-keyword').val('');
                    $('#new-priority-keyword').val('');
                }
            }

            function updateKeyword() {
                model.updateKeyword(selectedKeyword);

                model.topics.keywordUpdated.add(function () {
                    model.fetchKeywordsForProject($('#select-project').val());
                });
            }

            function deleteKeyword() {
                model.deleteKeyword(selectedKeyword.Id);
            
                model.topics.keywordDeleted.add(function () {
                    model.fetchKeywordsForProject($('#select-project').val());
                });
            }
        }

        function landingPageGrid() {
            var selectedLandingPageId;
            var selectedKeywordId;
            

            newLandingPageWindow();
            newLandingPageKeywordWindow();

            model.topics.landingPagesRetrieved.add(function () {
                gridLandingPages();
            });

            function gridLandingPages() {
                $('.landing-page-row').remove();
                $('.keyword-row').remove();
                $.each(model.getLandingPages(), function (i, lp) {
                    var row = $('<tr class="landing-page-row" id="lp-' + lp.Id + '" />');
                    $.data(row, 'landingPage', lp);
                    row.append('<td class="edit-url">' + lp.LandingPageUrl + '</td>');
                    row.append('<td class="edit-priority">' + lp.Priority + '</td>');
                    row.append('<td class="attach-keyword"></td>"');
                    row.append('<td class="delete-landing-page"></td>');

                    $('#grd-custom-landing-page .heading-blue').after(row);
                });

                

                $('.landing-page-row').click(function () {                                   
                    selectedLandingPageId = this.id.split('-')[1];                        

                    if (!$('#lp-' + selectedLandingPageId).hasClass('selected-row')) {
                        model.fetchKeywordsForLandingPage(selectedLandingPageId);
                        $('.attach-keyword').html('');
                        $('.delete-landing-page').html('');
                        var editedUrl = $('#edit-url').val();
                        $('.selected-row .edit-url').html(editedUrl);
                        var editedPriority = $('#edit-priority').val();
                        $('.selected-row .edit-priority').html(editedPriority);
                        $('.landing-page-row').removeClass('selected-row');
                        $('#lp-' + selectedLandingPageId).addClass('selected-row');
                        var originalUrl = $('#lp-' + selectedLandingPageId + ' .edit-url').text();
                        var originalPriority = $('#lp-' + selectedLandingPageId + ' .edit-priority').text();

                        $('#lp-' + selectedLandingPageId + ' .edit-url').html('<input id="edit-url" />');
                        $('#edit-url').focus();
                        $('#edit-url').val(originalUrl);
                        $('#lp-' + selectedLandingPageId + ' .edit-priority').html('<input id="edit-priority" value="' + originalPriority + '" />');
                        $('#lp-' + selectedLandingPageId + ' .attach-keyword').html('<input id="select-keyword" />');
                        $('#lp-' + selectedLandingPageId + ' .delete-landing-page').html('<button class="smallbutton" id="btn-delete-landing-page">Delete</button>');

                        $('#select-keyword').kendoComboBox({
                            placeholder: 'Attach Keyword',
                            dataTextField: 'Text',
                            dataValueField: 'Id',
                            dataSource: model.getKeywords(),
                            change: function () {
                                model.addKeywordToLandingPage(selectedLandingPageId, $('#select-keyword').val());
                            }
                        });

                        $('#btn-delete-landing-page').click(function () {
                            model.deleteLandingPage(selectedLandingPageId);
                        });

                    }

                    $('#edit-url, #edit-priority').change(function () {
                        var landingPage = {
                            Id: selectedLandingPageId,
                            ProjectId: $('#select-project').val(),
                            Priority: $('#edit-priority').val(),
                            LandingPageUrl: $('#edit-url').val()
                        }
                        model.updateLandingPage(landingPage);
                    });
                });

                model.topics.landingPageDeleted.add(function () {
                    model.fetchLandingPagesForProject($('#select-project').val());
                });

                model.topics.keywordAddedToLandingPage.add(function () {
                    var editedUrl = $('#edit-url').val();
                    $('.selected-row .edit-url').html(editedUrl);
                    var editedPriority = $('#edit-priority').val();
                    $('.selected-row .edit-priority').html(editedPriority);
                    $('.landing-page-row').removeClass('selected-row');
                    $('#lp-' + selectedLandingPageId).click();
                });

                model.topics.keywordsForLandingPageRetrieved.add(function () {
                    $('.keyword-row').remove();
                    $.each(model.getKeywordsForLandingPage(), function (i, kw) {
                        var row = $('<tr class="keyword-row" id="kw-' + kw.Id + '" />');
                        row.append('<td class="empty-cell"></td>');
                        row.append('<td>' + kw.Text + '</td>');
                        row.append('<td class="edit-keyword-priority">' + kw.LandingPagePriority + '</td>');
                        row.append('<td class="remove-keyword empty-cell"></td>');
                        $('#lp-' + selectedLandingPageId).after(row);
                        $('#kw-' + kw.Id).data('keyword', kw);
                    });
                    var row = $('<tr class="keyword-header keyword-row" />');
                    row.append('<td class="empty-cell"></td>');
                    row.append('<td class="heading-blue">Keyword</td>');
                    row.append('<td class="heading-blue">Priority</td>');
                    $('#lp-' + selectedLandingPageId).after(row);

                    $('.keyword-row').click(function () {
                        selectedKeywordId = this.id.split('-')[1];
                        if (!$('#kw-' + selectedKeywordId).hasClass('selected-keyword')) {
                            $('.remove-keyword').addClass('empty-cell');
                            $('.remove-keyword').html('');
                            var editedPriority = $('#edit-keyword-priority').val();
                            $('.selected-keyword .edit-keyword-priority').html(editedPriority);
                            $('.keyword-row').removeClass('selected-keyword');
                            $('#kw-' + selectedKeywordId).addClass('selected-keyword');
                            var originalPriority = $('#kw-' + selectedKeywordId + ' .edit-keyword-priority').text();

                            $('#kw-' + selectedKeywordId + ' .edit-keyword-priority').html('<input class="k-input" id="edit-keyword-priority" />');
                            $('#edit-keyword-priority').focus();
                            $('#edit-keyword-priority').val(originalPriority);
                            $('#kw-' + selectedKeywordId + ' .remove-keyword').html('<button class="smallbutton" id="remove-keyword">Remove</button>');
                            $('#kw-' + selectedKeywordId + ' .remove-keyword').removeClass('empty-cell');
                        }

                        $('#edit-keyword-priority').change(function () {
                            var keyword = $('#kw-' + selectedKeywordId).data('keyword');
                            keyword.LandingPagePriority = $('#edit-keyword-priority').val();

                            model.updateKeyword(keyword);
                        });

                        $('#remove-keyword').click(function () {
                            model.removeKeywordFromLandingPage(selectedLandingPageId, selectedKeywordId);
                        });

                        model.topics.keywordUpdated.add(function () {
                            model.fetchKeywordsForLandingPage(selectedLandingPageId);
                        });

                        model.topics.landingPageUpdated.add(function () {
                            model.fetchLandingPagesForProject($('#select-project').val());
                        });
                    });
                });


                model.topics.keywordRemovedFromLandingPage.add(function () {
                    var editedUrl = $('#edit-url').val();
                    $('.selected-row .edit-url').html(editedUrl);
                    var editedPriority = $('#edit-priority').val();
                    $('.selected-row .edit-priority').html(editedPriority);
                    $('.landing-page-row').removeClass('selected-row');
                    $('#lp-' + selectedLandingPageId).click();
                });
                                
                $('#btn-new-landing-page').click(function () {
                    $('#win-new-landing-page').data('kendoWindow').open();
                    $('#win-new-landing-page').data('kendoWindow').toFront();
                });

                
            }



            function newLandingPageWindow() {

                $('#win-new-landing-page').kendoWindow({
                    title: "New Landing Page",
                    visible: false,
                    width: '600px',
                });

                $('#win-new-landing-page').data('kendoWindow').center();
                $('#win-new-landing-page').closest('.k-window').css({
                    position: 'fixed',
                    margin: 'auto',
                    top: '10%'
                });

                $('#btn-save-landing-page').click(function () {
                    var landingPage = {
                        LandingPageUrl: $('#new-url-landing-page').val(),
                        Priority: $('#new-priority-landing-page').val(),                        
                        ProjectId: $('#select-project').val()
                    }
                    if (!$('#select-project').val()) {
                        alert('You must select a project');
                    } else {
                        model.saveLandingPage(landingPage);
                    }

                    model.topics.landingPageSaved.add(function () {
                        model.fetchLandingPagesForProject($('#select-project').val());
                        clearNewLandingPage();
                        $('#win-new-landing-page').data('kendoWindow').close();
                    });
                });



                function clearNewLandingPage() {
                    $('#new-url-landing-page').val('');
                    $('#new-priority-landing-page').val('');
                    $('#new-landing-page-keyword').val('');
                }

            }

            function newLandingPageKeywordWindow() {
                landingPageSelectKeywords();

                $('#win-new-landing-page-keyword').kendoWindow({
                    title: "New Landing Page Keyword",
                    visible: false,
                    width: '775px',
                });

                $('#win-new-landing-page-keyword').data('kendoWindow').center();
                $('#win-new-landing-page-keyword').closest('.k-window').css({
                    position: 'fixed',
                    margin: 'auto',
                    top: '10%'
                });

                $('#btn-save-landing-page-keyword').click(function () {
                    if (!$('#landing-page-keyword-attach').val() || !$('#new-landing-page-keyword').val() || !$('#landing-page-keyword-priority').val()) {
                        alert('Please fill all fields to attach a keyword.');
                    } else {
                        model.addKeywordToLandingPage($('#landing-page-keyword-attach').val(), $('#new-landing-page-keyword').val(), $('#landing-page-keyword-priority').val());
                    }
                });

                function clearNewLandingPageKeyword() {
                    $('#new-landing-page-keyword').data('kendoComboBox').value(null);
                    $('#landing-page-keyword-attach').data('kendoComboBox').value(null);
                    $('#landing-page-keyword-priority').val(null);
                }

                function landingPageSelectKeywords() {
                    $("#new-landing-page-keyword").kendoComboBox({
                        dataTextField: "Text",
                        dataValueField: "Id",
                        placeholder: "Select Keyword",
                    });

                }

                model.topics.keywordsRetrieved.add(function () {
                    $('#new-landing-page-keyword').data('kendoComboBox').dataSource.data(model.getKeywords());
                });
            }

        }

    }
    //End Keywords & Landing Pages Page

    //Start Persona Page
    function personaTab() {
        var selectedPersonaSocialAccount;
        $('#new-persona-date-of-birth').kendoDatePicker();

        selectPersona();
        newPersona();
        personaSocialAccountsGrid();
        personaImages();

        function selectPersona() {
            $('#date-of-birth').kendoDatePicker();

            $("#select-persona").kendoComboBox({
                dataTextField: "Name",
                dataValueField: "Id",
                placeholder: "Select Persona",
                change: function () {
                    bindPersona($('#select-persona').data('kendoComboBox').dataSource.data()[$('#select-persona').data('kendoComboBox').select()]);
                    model.fetchSocialAccountsForPersona($('#select-persona').val());
                }
            });

            model.topics.personasRetrieved.add(function () {
                $('#select-persona').data('kendoComboBox').dataSource.data(model.getPersonas());
            });

        };

        $('#btn-delete-persona').click(function () {
            if (confirm('Are you sure you want to delete the ' + $('#select-persona').data('kendoComboBox').text() + ' persona?')) {
                model.deletePersona($('#select-persona').data('kendoComboBox').value());
            }

            model.topics.personaDeleted.add(function () {
                clearPersona();
                model.fetchPersonas($('#select-project').val());
            });
        });

        $('#update-persona').click(function () {
            var persona = {
                Id: $('#select-persona').val(),
                Name: $('#persona-name').val(),
                DateOfBirth: $('#date-of-birth').val(),
                Experience: $('#professional-experience').val(),
                ConnectionToCustomer: $('#connection-to-client').val(),
                Bio: $('#specific-bio').val(),
                Notes: $('#notes').val(),
                Email: $('#persona-email').val(),
                GmailUsername: $('#gmail-username').val(),
                GmailPassword: $('#gmail-password').val(),
                DomainUsername: $('#domain-username').val(),
                DomainPassword: $('#domain-password').val(),
                SMTPServer: $('#persona-smtpserver').val(),
                SMTPPort: $('#persona-smtpport').val(),
                SMTPUsername: $('#persona-smtpusername').val(),
                SMTPPassword: $('#persona-smtppassword').val()
            }
            if (validatePersona(persona, 'update-persona-notify')) {
                model.updatePersona(persona);
            }
        });

        model.topics.personaUpdated.add(function () {
            model.fetchPersonas($('#select-project').val());
        });

        function bindPersona(item) {
            $('#persona-name').val(item.Name);
            $('#date-of-birth').val(kendo.toString(kendo.parseDate(item.DateOfBirth), 'MM/dd/yyyy'));            
            $('#professional-experience').val(item.Experience);
            $('#connection-to-client').val(item.ConnectionToCustomer);
            $('#specific-bio').val(item.Bio);
            $('#notes').val(item.Notes);
            $('#persona-email').val(item.Email);
            $('#gmail-username').val(item.GmailUsername);
            $('#gmail-password').val(item.GmailPassword);
            $('#domain-username').val(item.DomainUsername);
            $('#domain-password').val(item.DomainPassword);
            $('#persona-smtpserver').val(item.SMTPServer);
            $('#persona-smtpport').val(item.SMTPPort);
            $('#persona-smtpusername').val(item.SMTPUsername);
            $('#persona-smtppassword').val(item.SMTPPassword);
        }

        $('#select-project').change(clearPersona);

        function clearPersona() {
            $('#persona-name').val(null);
            $('#date-of-birth').val(null);
            $('#professional-experience').val(null);
            $('#connection-to-client').val(null);
            $('#specific-bio').val(null);
            $('#notes').val(null);
            $('#gmail-username').val(null);
            $('#gmail-password').val(null);
            $('#domain-username').val(null);
            $('#domain-password').val(null);
        }

        function validatePersona(persona, element) {
            if (persona.GmailUsername) {
                var pattern = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                if (!persona.GmailUsername.match(pattern)) {
                    $('#' + element).html('Gmail Username must be fully qualified with user@gmail.com').addClass('error').show().fadeOut(7000);
                    return false;
                }
            }

            return true;
        }

        function newPersona() {

            $('#btn-new-persona').click(function () {
                $('#win-new-persona').data('kendoWindow').open().center();
                $('#win-new-persona').data('kendoWindow').toFront();
            });

            $('#win-new-persona').kendoWindow({
                title: "New Persona",
                visible: false,
                width: '1000px',
            });

            //$('#win-new-persona').data('kendoWindow').center();
            $('#win-new-persona').closest('.k-window').css({
                position: 'fixed',
                margin: 'auto',
                top: '10%'
            });

            $('#btn-save-persona').click(function () {
                var persona = {
                    Name: $('#new-persona-name').val(),
                    DateOfBirth: $('#new-persona-date-of-birth').val(),
                    Experience: $('#new-persona-professional-experience').val(),
                    ConnectionToCustomer: $('#new-persona-connection-to-client').val(),
                    Bio: $('#new-persona-specific-bio').val(),
                    Notes: $('#new-persona-notes').val(),
                    ProjectId: $('#select-project').val(),
                    Email: $('#new-persona-email').val(),
                    GmailUsername: $('#new-persona-gmail-user').val(),
                    GmailPassword: $('#new-persona-gmail-password').val(),
                    DomainUsername: $('#new-persona-user').val(),
                    DomainPassword: $('#new-persona-password').val(),
                    SMTPServer: $('#new-persona-smtpserver').val(),
                    SMTPPort: $('#new-persona-smtpport').val(),
                    SMTPUsername: $('#new-persona-smtpusername').val(),
                    SMTPPassword: $('#new-persona-smtppassword').val()
                }
                if (!$('#select-project').val()) {
                    alert('You must select a project.');
                } else {
                    if (validatePersona(persona, 'new-persona-notify')) {
                        model.savePersona(persona);
                    }
                }

                model.topics.personaSaved.add(function () {
                    model.fetchPersonas($('#select-project').val());
                    clearNewPersona();
                    $('#win-new-persona').data('kendoWindow').close();
                });
            });

            function clearNewPersona() {
                $('#new-persona-name').val('');
                $('#new-persona-date-of-birth').val('');
                $('#new-persona-professional-experience').val('');
                $('#new-persona-connection-to-client').val('');
                $('#new-persona-specific-bio').val('');
                $('#new-persona-notes').val('');
            }
        }

        function personaImages() {
            $('#win-new-persona-img').kendoWindow({
                title: "New Persona Image",
                visible: false,
                width: "700px"
            });

            $('#win-new-persona-img').data('kendoWindow').center();
            $('#win-new-persona-img').closest('.k-window').css({
                position: 'fixed',
                margin: 'auto',
                top: '10%'
            });

            $('#new-persona-img').click(function () {
                $('#win-new-persona-img').data('kendoWindow').open();
                $('#win-new-persona-img').data('kendoWindow').toFront();
            });

            $('#persona-img-upload').kendoUpload({
                select: onFileSelect,
                multiple: false
            });

            function onFileSelect(e) {
                var fileReader = new FileReader();
                
                if (e.files[0].size > 1000) {
                    if (confirm("This file is WAY TO BIG!!!")) {
                        fileReader.onload = function (e) {
                            model.uploadImage(e.target.result);
                        }
                        fileReader.readAsDataURL(e.files[0].rawFile);
                    }
                } else {
                    fileReader.onload = function (e) {
                        model.uploadImage(e.target.result);                        
                    }
                    fileReader.readAsDataURL(e.files[0].rawFile);
                }
                
            }

            model.topics.imageUploaded.add(function () {
                var mapImage = model.getImage();
                $('#img-test').attr('src', mapImage);
            });
        }

        function personaSocialAccountsGrid() {
            newPersonaSocialAccountWindow();

            $('#grd-persona-social-accounts').kendoGrid({
                scrollable: true,
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    { field: "Name", title: "Name" },
                    { field: "Url", title: "URL" },
                    { field: "Username", title: "Username" },
                    { field: "Password", title: "Password" },
                    { command: { text: "Save", click: savePersonaSocialAccount }, width: '85px' },
                    { command: { text: "Delete", click: deletePersonaSocialAccount }, width: '85px' }
                ],
                editable: true,
                toolbar: [{ name: "create-persona-social-account", text: "New Persona Social Account" }],
                selectable: 'single',
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedPersonaSocialAccount = grid.dataItem($(this));
                    });
                }
            });

            $('.k-grid-create-persona-social-account').click(function () {
                $('#win-new-persona-social-account').data('kendoWindow').open();
                $('#win-new-persona-social-account').data('kendoWindow').toFront();
            });

            model.topics.socialAccountsForPersonaRetrieved.add(function () {
                $('#grd-persona-social-accounts').data('kendoGrid').dataSource.data(model.getSocialAccountsForPersona());
            });

            function newPersonaSocialAccountWindow() {

                $('#win-new-persona-social-account').kendoWindow({
                    title: "New Social Account",
                    visible: false,
                    width: '700px',
                });

                $('#win-new-persona-social-account').data('kendoWindow').center();
                $('#win-new-persona-social-account').closest('.k-window').css({
                    position: 'fixed',
                    margin: 'auto',
                    top: '10%'
                });

                $('#btn-save-persona-social-account').click(function () {
                    var personaSocialAccount = {
                        Name: $('#new-persona-social-account-name').val(),
                        URL: $('#new-persona-social-account-url').val(),
                        Username: $('#new-persona-social-account-username').val(),
                        Password: $('#new-persona-social-account-password').val(),
                        PersonaId: $('#select-persona').val()
                    }
                    if (!$('#select-project').val()) {
                        alert('You must select a project.');
                    } else {
                        model.savePersonaSocialAccount(personaSocialAccount);
                    }                

                    model.topics.personaSocialAccountSaved.add(function () {
                        model.fetchSocialAccountsForPersona($('#select-persona').val());
                        clearNewPersonaSocialAccount();
                        $('#win-new-persona-social-account').data('kendoWindow').close();
                    })
                    
                });

                function clearNewPersonaSocialAccount() {
                    $('#new-persona-social-account-name').val('');
                    $('#new-persona-social-account-url').val('');
                    $('#new-persona-social-account-username').val('');
                    $('#new-persona-social-account-password').val('');
                }
            }

            function savePersonaSocialAccount() {
                if (confirm("Are you sure you want to update the " + selectedPersonaSocialAccount.Name + " account?")) {
                    model.updateSocialAccount(selectedPersonaSocialAccount);
                }

                model.topics.socialAccountUpdated.add(function () {
                    model.fetchSocialAccountsForPersona($('#select-persona').val());
                });
            }

            function deletePersonaSocialAccount() {
                if (confirm("Are you sure you want to delete the " + selectedPersonaSocialAccount.Name + " account?")) {
                    model.deletePersonaSocialAccount(selectedPersonaSocialAccount.Id);
                }

                model.topics.personaSocialAccountDeleted.add(function () {
                    model.fetchSocialAccountsForPersona($('#select-persona').val());
                });
            }
        }
    }

    $(initUi);
})();