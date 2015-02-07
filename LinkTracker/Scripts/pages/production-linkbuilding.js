/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/kendo/js/jquery.min.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="production-linkbuilding-model.js" />
/// <reference path="../lib/kendo/js/kendo.all.min.js" />
/// <reference path="../lib/localsettings.js" />

(function () {
    var model = p1p.linkbuilding.getModel();

    function initUi() {

        var loaderWindow = p1p.sharedcontrols.loaderWindow();

        p1p.globalEvents.serverProcessing.add(function () {
            loaderWindow.start();
        });

        p1p.globalEvents.serverProcessComplete.add(function () {
            loaderWindow.stop();
        });

        model.fetchAllProjects();
        model.fetchAllEmployeeUsernames();
        model.fetchCurrentUser();

        $('input').change(clearMessage);
        //$('.smallbutton, .btn-disabled').click(clearMessage);
        
        function clearMessage() {
            $('.message').addClass('hidden');
        }          
        
        linkInfo();
        outreachInfo();
        searchWindow();
    }

    function linkInfo() {
        linkInfoKendo();
        linkInfoMode();
        articleContent();

        model.topics.currentLinkSet.add(bindTargetInfo);

        $('#btn-request-active').click(function () {
            if (model.getCurrentLink()) {
                requestActive();
            }
        });
        $('#btn-save-link').click(saveLink);
        $('#btn-update-link').click(updateLink);
        $('#btn-new-link').click(clearTargetInfo);

        $('#link-target-url').change(function () {
            var targetUrl = convertToUrl($('#link-target-url').val());
            stripRootUrl(targetUrl);
            $('#link-target-url').val(targetUrl.href);
        });

        $('#link-published-url').change(function () {
            var publishedUrl = convertToUrl($('#link-published-url').val());
            $('#link-published-url').val(publishedUrl.href);
        });

        $('#link-contact-url').change(function () {
            var contactUrl = convertToUrl($('#link-contact-url').val());
            $('#link-contact-url').val(contactUrl.href);
        });

        $('#link-root-url').change(isDuplicateRootUrl);

        $('#link-project').change(function () {            
            model.selectProject($(this).data('kendoComboBox').dataSource.data()[$(this).data('kendoComboBox').select()].toJSON());
            isDuplicateRootUrl();
        });

        // Make target, published, and contact URLs clickable
        $('#link-target-url').dblclick(function () {
            window.open($('#link-target-url').val());
        });
        $('#link-published-url').dblclick(function () {
            window.open($('#link-published-url').val());
        });
        $('#link-contact-url').dblclick(function () {
            window.open($('#link-contact-url').val());
        });
                
        //Link Info Mode
        function linkInfoMode() {
            var mode = p1p.localsettings.get('linkbuilding', 'linkbuilding-mode', 'switch', 'researchMode');

            if (mode === 'researchMode') {
                researchMode();
            }
            if (mode === 'writerMode') {
                writerMode();
            }

            $('#mode-writer').click(writerMode);
            $('#mode-research').click(researchMode);

            function researchMode() {
                $('.link-building-mode').removeClass('mode-active mode-inactive');
                $('#mode-research').addClass('mode-active');
                $('#mode-writer').addClass('mode-inactive');
                model.setMode(2);
                p1p.localsettings.set('linkbuilding', 'linkbuilding-mode', 'switch', '', '', '', 'researchMode')
            }

            function writerMode() {
                $('.link-building-mode').removeClass('mode-active mode-inactive');
                $('#mode-writer').addClass('mode-active');
                $('#mode-research').addClass('mode-inactive');
                model.setMode(1);
                p1p.localsettings.set('linkbuilding', 'linkbuilding-mode', 'switch', '', '', '', 'writerMode')
            }
        }

        //Link Info Kendo
        function linkInfoKendo () {
            kendoComboBoxes();
                      
            //Link Info ComboBoxes
            function kendoComboBoxes () {
                model.topics.allProjectsRetrieved.add(function () {
                    $('#link-project').data('kendoComboBox').dataSource.data(model.getActiveProjects());
                });

                model.topics.allEmployeeUsernamesRetrieved.add(function () {
                    $('#link-found-by').data('kendoComboBox').dataSource.data(model.getAllEmployeeUsernames());
                    $('#link-acquired-by').data('kendoComboBox').dataSource.data(model.getAllEmployeeUsernames());
                });

                $('#link-project').kendoComboBox({
                    placeholder: 'Select Project',
                    dataTextField: 'Name',
                    dataValueField: 'Id',
                    change: function () {
                        $('#link-target-url').prop('disabled', false);
                        model.fetchAllArticles($('#link-project').val());
                        if ($('#link-target-url').val()) {
                            model.isDuplicateRootUrlCheck($('#link-target-url').val(), $('#link-project').val());
                        }
                    },
                });

                $('#link-strategy').kendoComboBox({
                    placeholder: 'Select Strategy',
                    dataTextField: 'Name',
                    dataValueField: 'Id',
                    dataSource: p1p.staticdata.getLinkStrategies()
                });

                $('#link-article').kendoComboBox({
                    placeholder: 'Select Article',
                    dataTextField: 'Title',
                    dataValueField: 'Id',
                });

                $('#link-status').kendoComboBox({
                    placeholder: 'Select Status',
                    dataTextField: 'Name',
                    dataValueField: 'Id',
                    dataSource: p1p.staticdata.getLinkStatuses(),
                    value: 1
                });

                $('#link-found-by').kendoComboBox({
                    placeholder: 'Select User',
                    dataTextField: 'Username',
                    dataValueField: 'Username',
                });

                $('#link-acquired-by').kendoComboBox({
                    placeholder: 'Select User',
                    dataTextField: 'Username',
                    dataValueField: 'Username',
                });

                $('#link-type').kendoComboBox({
                    placeholder: 'Select Type',
                    dataTextField: 'Name',
                    dataValueField: 'Id',
                    dataSource: p1p.staticdata.getLinkTypes()
                });

                $('#link-location').kendoComboBox({
                    placeholder: 'Select Location',
                    dataTextField: 'Name',
                    dataValueField: 'Id',
                    dataSource: p1p.staticdata.getLinkLocations(),
                });

                model.topics.allArticlesRetrieved.add(function () {
                    $('#link-article').data('kendoComboBox').dataSource.data(model.getArticles());
                });

                model.topics.currentUserRetrieved.add(function () {
                    $('#link-found-by').val(model.getCurrentUser());
                });
            }

            //Link Info NumberPickers
            (function () {
                var loseFocus = true;
                $('#link-domain-authority').kendoNumericTextBox({
                    format: "#",
                    min: 1,
                    max: 100,
                    decimals: 0,
                    value: 1
                });                

                $("#link-domain-authority").focus(function () {
                    var input = $(this);
                    setTimeout(function () {
                        input.select();
                    });
                });
                
                $('#link-site-relevance').kendoNumericTextBox({
                    format: "#",
                    min: 1,
                    max: 3,
                    decimals: 0,
                    value: 1
                });

                $("#link-site-relevance").focus(function () {
                    var input = $(this);
                    setTimeout(function () {
                        input.select();
                    });
                });

                $('#link-page-relevance').kendoNumericTextBox({
                    format: "#",
                    min: 1,
                    max: 3,
                    decimals: 0,
                    value: 1
                });

                $("#link-page-relevance").focus(function () {
                    var input = $(this);
                    setTimeout(function () {
                        input.select();
                    });
                });

                $(window).on("focus", function () {
                    var active = $(window.lastActive);

                    if (active.attr("data-role") === "numerictextbox") {
                        active.data("kendoNumericTextBox").focus();
                    }
                    })
                    .on("blur", function () {
                        window.lastActive = document.activeElement;
                    })
            })();

            //Link Info DatePickers
            (function () {
                $('#link-date-found').kendoDatePicker({
                    value: new Date(),
                });

                $('#link-date-published').kendoDatePicker();
            })();
        }

        function articleContent() {
            var articleTitle;

            (function () {
                var win = $("#win-new-article").kendoWindow({
                    height: "110px",
                    title: "New Article Title",
                    visible: false,
                    width: "400px",
                    scrollable: false
                }).data("kendoWindow");
            })();

            model.topics.articleSaved.add(function () {
                model.fetchAllArticles($('#link-project').val());
                $("#win-new-article").data("kendoWindow").close();
                $('#link-article').data('kendoComboBox').text(articleTitle);
            });

            $("#btn-new-article").click(function () {
                articleTitle = null;
                var win = $("#win-new-article").data("kendoWindow");
                win.center();
                win.open();
            });

            $('#btn-save-article').click(function () {
                if (!$('#new-article-title').val()) {
                    $('#vld-no-article-title').removeClass('hidden');
                } else {
                    if (!$('#link-project').val()) {
                        $('#vld-no-article-project').removeClass('hidden');
                    } else {
                        model.saveArticle({ Title: $('#new-article-title').val(), Project: { Id: $('#link-project').val() }, ArticleStatusId: 1 });
                        articleTitle = $('#new-article-title').val();
                    }
                }
            });

        }

        function bindTargetInfo() {
            model.fetchOutreachForLink();

            $('#link-target-url, #link-root-url').prop('disabled', false);

            var link = model.getCurrentLink();
            model.fetchAllArticles(link.ProjectId);


            if (link.LinkBuildingMode.Id === 1) {
                $('.link-building-mode').removeClass('mode-active mode-inactive');
                $('#mode-writer').addClass('mode-active');
                $('#mode-research').addClass('mode-inactive');
                model.setMode(1);
            } else {
                $('.link-building-mode').removeClass('mode-active mode-inactive');
                $('#mode-research').addClass('mode-active');
                $('#mode-writer').addClass('mode-inactive');
                model.setMode(2);
            }


            var copy = model.getIsCopy();
            if (copy) {
                clearTargetInfo();
            }

            if (!copy) {
                $('#link-article').data('kendoComboBox').value(link.Article.Id);                
            }

            $('#link-project').data('kendoComboBox').value(link.ProjectId);
            //TODO hack to make the change event fire 
            $('#link-project').data('kendoComboBox').trigger('change');
            $('#link-target-url').val(link.TargetUrl);
            $('#link-root-url').val(link.RootUrl);
            if (link.LinkStrategy.Id != 1) {
                $('#link-strategy').data('kendoComboBox').value(link.LinkStrategy.Id);
            }
            $('#link-root-method').val(link.RootMethod);
            $('#link-contact-email').val(link.ContactEmail);
            $('#link-contact-url').val(link.ContactUrl);
            $('#link-contact-phone').val(link.ContactPhone);
            $('#link-found-by').data('kendoComboBox').value(link.FoundBy);
            $('#link-date-found').val(kendo.toString(kendo.parseDate(link.DateFound), "MM/dd/yyyy"));
            $('#link-domain-authority').data('kendoNumericTextBox').value(link.DomainAuthority);
            $('#link-site-relevance').data('kendoNumericTextBox').value(link.SiteRelevance);
            $('#link-page-relevance').data('kendoNumericTextBox').value(link.PageRelevance);

            if (!copy) {
                
                $('#link-status').data('kendoComboBox').value(link.LinkStatus.Id);
                $('#link-anchor-text').val(link.AnchorText);
                $('#link-acquired-by').data('kendoComboBox').value(link.AcquiredBy);
                $('#link-landing-page').val(link.LandingPage);
                $('#link-published-url').val(link.PublishedUrl);
                if (link.LinkType.Id != 1) {
                    $('#link-type').data('kendoComboBox').value(link.LinkType.Id);
                }
                if (link.LinkLocation.Id != 1) {
                    $('#link-location').data('kendoComboBox').value(link.LinkLocation.Id);
                }
                $('#link-date-published').val(kendo.toString(kendo.parseDate(link.DatePublished), "MM/dd/yyyy"));
                $('#link-notes').val(link.Notes);

                $('#btn-save-link').addClass('hidden');
                $('#btn-request-active').addClass('bg-blue btn-small');
                $('#btn-update-link').removeClass('hidden');
            }
            model.setIsCopy(false);
        }

        function requestActive() {
            $('.message').addClass('hidden');
            var link = model.getCurrentLink();
            link = getLinkInfo(link);
            if (isLinkValid(link, 'requestActive')) {
                model.requestActive(link);
            }
            model.topics.activeRequested.add(function () {
                $('#cnfm-request-activation').removeClass('hidden');
                $('#btn-search-links').click();
            });
        }

        function saveLink() {
            var link = {};
            link = getLinkInfo(link)
            if (link.LinkStatus.Id === 10 || link.LinkStatus.Id === 14) {
                alert("You must use the request active button.")
            } else {
                if (isLinkValid(link)) {
                    model.saveLink(link);
                }
            }

            model.topics.linkSaved.add(function () {
                $('.message').addClass('hidden');
                $('#cnfm-link-saved').removeClass('hidden');
                $('#btn-save-link').addClass('hidden');
                $('#btn-update-link').removeClass('hidden');
                $('#btn-request-activation').addClass('bg-blue btn-small');
                $('#btn-search-links').click();
            });
        }

        function updateLink() {

            var link = model.getCurrentLink();
            var unauthorized = false;
            if (link.LinkStatus.Id != 10 && $('#link-status').data('kendoComboBox').value() == 10) {
                unauthorized = true;
            }
            if (link.LinkStatus.Id != 14 && $('#link-status').data('kendoComboBox').value() == 14) {
                unauthorized = true;
            }
            if (unauthorized) {
                alert("You must use the request active button.");
            } else {
                $('.message').addClass('hidden');
                link = getLinkInfo(link);

                if (isLinkValid(link)) {
                    model.updateLink(link);                    
                }
            }

            model.topics.linkUpdated.add(function () {
                $('#cnfm-link-updated').removeClass('hidden');
                $('#btn-search-links').click();
            });
        }

        function clearTargetInfo() {
            $('#link-target-url').val(null);
            $('#link-root-url').val(null);
            $('#link-strategy').data('kendoComboBox').value(null);
            $('#link-contact-email').val(null);
            $('#link-contact-url').val(null);
            $('#link-contact-phone').val(null);
            $('#link-found-by').data('kendoComboBox').value(model.getCurrentUser());
            $('#link-date-found').kendoDatePicker({
                value: new Date(),
            });
            $('#link-domain-authority').data('kendoNumericTextBox').value(1);
            $('#link-site-relevance').data('kendoNumericTextBox').value(1);
            $('#link-page-relevance').data('kendoNumericTextBox').value(1);
            $('#link-article').data('kendoComboBox').value(null);
            $('#link-status').data('kendoComboBox').value(1);
            $('#link-anchor-text').val(null);
            $('#link-acquired-by').data('kendoComboBox').value(null);
            $('#link-landing-page').val(null);
            $('#link-published-url').val(null);
            $('#link-type').data('kendoComboBox').value(null);
            $('#link-location').data('kendoComboBox').value(null);
            $('#link-date-published').kendoDatePicker();
            $('#link-notes').val(null);
            $('#btn-update-link').addClass('hidden');
            $('#btn-request-active').removeClass('bg-blue btn-small');
            $('#btn-save-link').removeClass('hidden');
            model.clearCurrentLink();
        }

        function convertToUrl(text) {
            var url = document.createElement('a');
            text = text.split('/');
            if (text[0] == 'http:') {
                text = text.slice(1);
                text = text.join('/');
                url.href = 'http://' + text;
            } else {
                if (text[0] == 'https:') {
                    text = text.slice(1);
                    text = text.join('/');
                    url.href = 'https://' + text;
                } else {
                    text = text.join('/');
                    url.href = 'http://' + text;
                }
            }
            return url;
        }

        function stripRootUrl(targetUrl) {
            
            var rootUrl = targetUrl.hostname;
            rootUrl = rootUrl.split('.');
            if (rootUrl[0] === 'www') {
                rootUrl = rootUrl.slice(1);
            }
            rootUrl = rootUrl.join('.');
            $('#link-root-url').val(rootUrl);
            $('#link-root-url').prop('disabled', false);
            isDuplicateRootUrl();
            
            p1p.globalEvents.serverProcessComplete.add(function () {
                $('#link-root-url').focus();
            });
        }

        model.topics.duplicateCheckRetrieved.add(function () {
            if (model.getIsDuplicateRootUrl()) {
                $('#vld-root-url-duplicate').removeClass('hidden');
            } else {
                $('#vld-root-url-duplicate').addClass('hidden');
            }
        });

        function isDuplicateRootUrl() {
            $('#vld-root-url-duplicate').addClass('hidden');
            model.isDuplicateRootUrlCheck($('#link-root-url').val(), $('#link-project').val());            
        }

        function getLinkInfo(link) {

            link.ProjectId = $('#link-project').val();
            link.TargetUrl = $('#link-target-url').val();
            link.RootUrl = $('#link-root-url').val();
            link.LinkStrategy = { Id: $('#link-strategy').val() };
            link.RootMethod = $('#link-root-method').val();
            link.Article = { Id: $('#link-article').data('kendoComboBox').value() };
            link.ContactEmail = $('#link-contact-email').val();
            link.ContactPhone = $('#link-contact-phone').val();
            link.ContactUrl = $('#link-contact-url').val();
            link.LinkStatus = { Id: $('#link-status').val() };
            link.FoundBy = $('#link-found-by').val();
            link.DateFound = $('#link-date-found').val();
            link.DomainAuthority = $('#link-domain-authority').val();
            link.SiteRelevance = $('#link-site-relevance').val();
            link.PageRelevance = $('#link-page-relevance').val();
            link.AnchorText = $('#link-anchor-text').val();
            link.LandingPage = $('#link-landing-page').val();
            link.AcquiredBy = $('#link-acquired-by').val();
            link.PublishedUrl = $('#link-published-url').val();
            link.LinkType = { Id: $('#link-type').val() };
            link.LinkLocation = { Id: $('#link-location').val() };
            link.DatePublished = $('#link-date-published').val();
            link.Notes = $('#link-notes').val();
            link.LinkBuildingMode = { Id: model.getMode() }


            return link;
        }

        function isLinkValid(link, state) {
            var isValid = true;
            for (var p in link) {
                switch (p) {
                    case 'ProjectId':
                        if (!link.ProjectId) {
                            isValid = false;
                            $('#vld-no-proj').removeClass('hidden');
                        }
                        break;
                    case 'TargetUrl':
                        if (!link.TargetUrl) {
                            isValid = false;
                            $('#vld-no-target-url').removeClass('hidden');
                        }
                        break;
                    case 'RootUrl':
                        if (!link.RootUrl) {
                            $('#vld-no-root-url').removeClass('hidden');
                            isValid = false;
                        }
                        break;
                    case 'LinkStrategy':
                        if (!link.LinkStrategy.Id || link.LinkStrategy.Id === 1) {
                            $('#vld-no-strategy').removeClass('hidden');
                            isValid = false;
                        }
                        break;
                    case 'RootMethod':
                        if (!link.RootMethod) {
                            $('#vld-no-root-method').removeClass('hidden');
                            isValid = false;
                        }
                        break;
                    case 'LinkStatus':
                        if (!link.LinkStatus.Id) {
                            $('#vld-no-status').removeClass('hidden');
                            isValid = false;
                        }
                        break;
                    case 'FoundBy':
                        if (!link.FoundBy) {
                            $('#vld-no-found-by').removeClass('hidden');
                            isValid = false;
                        }
                        break;
                    case 'DateFound':
                        if (!link.DateFound) {
                            $('#vld-no-date-found').removeClass('hidden');
                            isValid = false;
                        }
                        break;
                    default:
                        break;
                }

                if (state === 'requestActive') {
                    switch (p) {
                        case 'AnchorText':
                            if (!link.AnchorText) {
                                $('#vld-no-anchor-text').removeClass('hidden');
                                isValid = false;
                            }
                            break;
                        case 'LandingPage':
                            if (!link.LandingPage) {
                                $('#vld-no-landing-page').removeClass('hidden');
                                isValid = false;
                            }
                            break;
                        case 'PublishedUrl':
                            if (!link.PublishedUrl) {
                                $('#vld-no-published-url').removeClass('hidden');
                                isValid = false;
                            }
                            break;
                        case 'LinkType':
                            if (!link.LinkType.Id || link.LinkType.Id === 1) {
                                $('#vld-no-link-type').removeClass('hidden');
                                isValid = false;
                            }
                            break;
                        case 'LinkLocation':
                            if (!link.LinkLocation.Id || link.LinkType.Id === 1) {
                                $('#vld-no-link-location').removeClass('hidden');
                                isValid = false;
                            }
                            break;
                        default:
                            break;
                    }
                }

                if (!isValid) {
                    break;
                }
            }
                                
            return isValid;
        }

        model.topics.allProjectsRetrieved.add(function () {
            if (window.location.search) {
                var link = window.location.href;
                link = link.split('=');
                link = link[1];
                model.fetchLink(link);
            }
        });        
    }

    function outreachInfo() {
        $('#btn-save-outreach').click(function () {
            saveOutreach();
        });

        $('#outreach-email').kendoEditor({
            tools: [
                "formatting", "bold", "italic", "underline", "fontName", "fontSize", "foreColor", "backColor", "justifyLeft", "justifyCenter",
                "justifyRight", "justifyFull", "insertUnorderedList", "insertOrderedList", "indent", "outdent", "createLink", "unlink", "insertImage",
                "createTable", "viewHtml"
            ],            
            //change: function (e) {
            //    isDirty = true;
            //}
        });

        var actions = $('#outreach-action').kendoComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            placeholder: "Select Action",
            dataSource: p1p.staticdata.getOutreachActions()
        });

        var types = $('#outreach-type').kendoComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            placeholder: "Select Type",
            dataSource: p1p.staticdata.getOutreachTypes(),
            change: function (e) {
                if (parseInt(e.sender.value()) === 1) {
                    $('#btn-save-outreach').html('Save & Send');
                } else {
                    $('#btn-save-outreach').html('Save Outreach');
                }
            }
        });

        var personas = $('#outreach-persona').kendoComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            placeholder: "Select Persona"
        });


        var kArticleList = $('#outreach-article').kendoComboBox({
            dataTextField: "Title",
            dataValueField: "Id",
            placeholder: "Select Article"
        });

        model.topics.allArticlesRetrieved.add(function () {
            var writtenArticles = $.grep(model.getArticles(), function (article) {
                return article.ArticleStatus.Id != 1;
            });

            $('#outreach-article').data('kendoComboBox').dataSource.data(writtenArticles);
        });

        model.topics.personasRetrieved.add(function () {
            $('#outreach-persona').data('kendoComboBox').dataSource.data(model.getPersonas());
        });

        //Outreach DatePickers
        $('#outreach-date').kendoDatePicker({
            value: new Date()
        });

        //Outreach Grids
        var outreachGridDefaultSettings = {
            sortable: true,
            selectable: 'single',
            resizable: true,
            columnMenu: true,
            pageable: {
                pageSizes: false
            },
            columns: [
                { field: "Id", title: "Id", hidden: true },
                { field: "OutreachAction.Name", title: "Outreach Action" },
                { field: "OutreachType.Name", title: "Outreach Type" },
                { field: "OutreachNotes", title: "Notes" },
                { field: "DateOutreached", title: "Outreach Date", template: '#= (data.DateOutreached) ? kendo.toString(kendo.parseDate(DateOutreached), "MM/dd/yyyy" ) : " " #' },
                { field: "AddedBy", title: "User" }
            ]
        };

        var outreachGridSettings = p1p.localsettings.get('linkbuilding', 'grd-outreach', 'grid', outreachGridDefaultSettings)

        outreachGridSettings.columnResize = function (e) {
            p1p.localsettings.set('linkbuilding', 'grd-outreach', 'grid', 'columns', e.column.field, 'width', e.newWidth);
        };
        outreachGridSettings.columnShow = function (e) {
            p1p.localsettings.set('linkbuilding', 'grd-outreach', 'grid', 'columns', e.column.field, 'hidden', false);
        };
        outreachGridSettings.columnHide = function (e) {
            p1p.localsettings.set('linkbuilding', 'grd-outreach', 'grid', 'columns', e.column.field, 'hidden', true);
        };

        $('#grd-outreach').kendoGrid(outreachGridSettings);

        model.topics.outreachRetrieved.add(function () {
            $('#grd-outreach').data('kendoGrid').dataSource.data(model.getOutreach());
            $('#grd-outreach').data('kendoGrid').dataSource.pageSize(10);
        });

        function saveOutreach() {
            var outreach = getOutreachInfo();
            if (isOutreachValid(outreach)) {
                model.saveOutreach(outreach);
            }

            model.topics.outreachSaved.add(function () {
                model.fetchOutreachForLink();
                $('.section-parameters .validation-message').addClass('success').html('Outreach Successful');
                clearOutreach();
            });
        }

        function getOutreachInfo() {
            var outreach = {};

            outreach.LinkId = null;
            if (model.getCurrentLink()) {
                outreach.LinkId = model.getCurrentLink().Id;
            }
            outreach.OutreachAction = { Id: $('#outreach-action').val() };
            outreach.OutreachType = { Id: parseInt($('#outreach-type').val()) };
            outreach.DateOutreached = $('#outreach-date').val();
            outreach.OutreachNotes = $('#outreach-notes').val();
            outreach.EmailBody = $('#outreach-email').data('kendoEditor').value();
            outreach.EmailRecipient = $('#outreach-recipient').val();
            outreach.PersonaId = $('#outreach-persona').data('kendoComboBox').value();
            outreach.ArticleId = $('#outreach-article').data('kendoComboBox').value();
            outreach.EmailSubject = $('#outreach-subject').val();
            return outreach;
        }

        function clearOutreach() {
            $('#outreach-action').data('kendoComboBox').value(null);
            $('#outreach-type').data('kendoComboBox').value(null);
            $('#outreach-date').kendoDatePicker({
                value: new Date()
            });
            $('#outreach-email').data('kendoEditor').value('');
            $('#outreach-persona').data('kendoComboBox').value(null);
            $('#outreach-recipient').val('');
            $('#outreach-article').data('kendoComboBox').value(null);
            $('.section-parameters .validation-message').fadeOut('slow');
            $('#outreach-notes').val(null);
            $('#outreach-subject').val(null);
        }

        function isOutreachValid(outreach) {
            for (var p in outreach) {
                var isValid = true;
                switch (p) {
                    case 'LinkId':
                        if (!outreach.LinkId) {
                            isValid = false;
                            $('.section-parameters .validation-message').addClass('error');
                            $('.section-parameters .validation-message').html('Select a link first!').removeClass('hidden');
                        }
                        break;
                    case 'OutreachAction':
                        if (!outreach.OutreachAction.Id) {
                            isValid = false;
                            $('.section-parameters .validation-message').addClass('error');
                            $('.section-parameters .validation-message').html('Select an action first!').removeClass('hidden');
                        }
                        break;
                    case 'DateOutreached':
                        if (!outreach.DateOutreached) {
                            isValid = false;
                            $('.section-parameters .validation-message').addClass('error');
                            $('.section-parameters .validation-message').html('No date selected!').removeClass('hidden');
                        }
                        break;
                    case 'OutreachType':
                        if (!outreach.OutreachType.Id) {
                            isValid = false;
                            $('.section-parameters .validation-message').addClass('error');
                            $('.section-parameters .validation-message').html('Select an outreach type first!').removeClass('hidden');
                        }
                        break;
                }

                if (outreach.OutreachType.Id === 1) {
                    if (outreach.EmailBody || outreach.EmailRecipient) {
                        if (!outreach.EmailBody || !outreach.EmailRecipient || !outreach.EmailSubject || !$('#outreach-persona').val()) {
                            isValid = false;
                            $('.section-parameters .validation-message').addClass('error');
                            $('.section-parameters .validation-message').html('Missing one of the fields: Persona, Recipient, Email Body or Email Subject.');
                        }
                    }
                }
                if (!isValid) {
                    break;
                }
            }
            return isValid;
        }
    }

    function searchWindow(){
        linkSearchKendo();
        linkSearchMode();

        var selectedLink;

        $('#btn-search-window').click(function () {
            $('#win-search-links').data('kendoWindow').open();
            $('#win-search-links').data('kendoWindow').toFront();
        });

        $('#btn-proven-winners').click(function () {
            $('#win-search-links').data('kendoWindow').open();
            $('#win-search-links').data('kendoWindow').toFront();
            $('#search-links-everyone').click();
            $('#search-links-status').data('kendoComboBox').value(10);
            $('#btn-search-links').click();
        });

        $('#btn-search-links').click(function () {
            if ($('#search-links-project').val() || $('#search-links-status').val() || $('#search-links-category').val() || $('#search-links-strategy').val() || $('#search-links-start-date').val() || $('#search-links-end-date').val()) {
                model.fetchFilteredLinks($('#search-links-project').val(), $('#search-links-status').val(), $('#search-links-category').val(), $('#search-links-strategy').val(), $('#search-links-start-date').val(), $('#search-links-end-date').val());
            } else {
                alert('You must use at least one filter option.');
            }
        });
        $('#btn-clear-filters').click(clearFilters);

        $('#btn-open-link').click(function () {
            if (selectedLink) {
                model.setCurrentLink(selectedLink);
                $('#win-search-links').data('kendoWindow').close();
            }
        });
        $('#btn-copy-link').click(function () {
            if (selectedLink) {
                model.setIsCopy(true);
                model.setCurrentLink(selectedLink);
                $('#win-search-links').data('kendoWindow').close();
                model.isDuplicateRootUrlCheck(selectedLink.RootUrl, selectedLink.ProjectId);
            }
        });

        $('#btn-reuse-link').click(function () {
            if (selectedLink) {
                $('#link-project').val(null);
                $('#link-target-url').val(null);
                $('#link-root-url').val(null);
                $('#link-strategy').data('kendoComboBox').value(null);
                $('#link-contact-email').val(null);
                $('#link-contact-url').val(null);
                $('#link-contact-phone').val(null);
                $('#link-found-by').data('kendoComboBox').value(model.getCurrentUser());
                $('#link-date-found').kendoDatePicker({
                    value: new Date(),
                });
                $('#link-domain-authority').data('kendoNumericTextBox').value(1);
                $('#link-site-relevance').data('kendoNumericTextBox').value(1);
                $('#link-page-relevance').data('kendoNumericTextBox').value(1);
                $('#link-article').data('kendoComboBox').value(null);
                $('#link-status').data('kendoComboBox').value(1);
                $('#link-anchor-text').val(null);
                $('#link-acquired-by').data('kendoComboBox').value(null);
                $('#link-landing-page').val(null);
                $('#link-published-url').val(null);
                $('#link-type').data('kendoComboBox').value(null);
                $('#link-location').data('kendoComboBox').value(null);
                $('#link-date-published').kendoDatePicker();
                $('#link-notes').val(null);
                $('#btn-update-link').addClass('hidden');
                $('#btn-request-active').removeClass('bg-blue btn-small');
                $('#btn-save-link').removeClass('hidden');
                $('#link-root-method').val(null);
                model.clearCurrentLink();

                $('#link-target-url').val(selectedLink.TargetUrl);
                $('#link-root-url').val(selectedLink.RootUrl);
                $('#link-strategy').data('kendoComboBox').value(selectedLink.LinkStrategy.Id);
                $('#link-root-method').val(selectedLink.RootMethod);
                $('#link-contact-email').val(selectedLink.ContactEmail);
                $('#link-contact-url').val(selectedLink.ContactUrl);
                $('#link-contact-phone').val(selectedLink.ContactPhone);
                $('#link-domain-authority').data('kendoNumericTextBox').value(selectedLink.DomainAuthority);
                $('#win-search-links').data('kendoWindow').close();
            }
        });

        function linkSearchMode() {
            $('#search-links-mine').click(function () {
                $('.link-search-mode').removeClass('mode-active mode-inactive');
                $('#search-links-mine').addClass('mode-active');
                $('#search-links-everyone').addClass('mode-inactive');
                model.setOnlyMine(true);
            });
            $('#search-links-everyone').click(function () {
                $('.link-search-mode').removeClass('mode-active mode-inactive');
                $('#search-links-everyone').addClass('mode-active');
                $('#search-links-mine').addClass('mode-inactive');
                model.setOnlyMine(false);
            });
        }

        function clearFilters () {
            $('#search-links-everyone').click();
            $('#search-links-project').data('kendoComboBox').value(null);
            $('#search-links-status').data('kendoComboBox').value(null);
            $('#search-links-category').data('kendoComboBox').value(null);
            $('#search-links-strategy').data('kendoComboBox').value(null);
            $('#search-links-start-date').kendoDatePicker();
            $('#search-links-end-date').kendoDatePicker();
            $('#search-links-everyone').click();
        }

        //Link Search Kendo
        function linkSearchKendo() {
            linkSearchGrid();
            //Windows
            (function () {
                $('#win-search-links').kendoWindow({
                    title: "Search Links",
                    visible: false,
                    width: "1750px",
                    height: "800px"
                });

                $('#win-search-links').data('kendoWindow').center();

                $('#win-search-links').closest('.k-window').css({
                    position: 'fixed',
                    margin: 'auto',
                    top: '10%'
                });
            })();

            //ComboBoxes
            (function () {
                $('#search-links-status').kendoComboBox({
                    placeholder: 'Select Status',
                    dataTextField: 'Name',
                    dataValueField: 'Id',
                    dataSource: p1p.staticdata.getLinkStatuses()
                });

                $('#search-links-project').kendoComboBox({
                    placeholder: 'Select Project',
                    dataTextField: 'Name',
                    dataValueField: 'Id'
                });

                $('#search-links-category').kendoComboBox({
                    placeholder: 'Select Category',
                    dataTextField: 'Name',
                    dataValueField: 'Id',
                    dataSource: p1p.staticdata.getSiteCategories()
                });

                $('#search-links-strategy').kendoComboBox({
                    placeholder: 'Select Strategy',
                    dataTextField: 'Name',
                    dataValueField: 'Id',
                    dataSource: p1p.staticdata.getLinkStrategies()
                });

                model.topics.allProjectsRetrieved.add(function () {
                    $('#search-links-project').data('kendoComboBox').dataSource.data(model.getAllProjects());
                })

            })();

            //DatePickers

            (function () {
                var todayDate = new Date();
                var defaultStartDate = new Date();

                defaultStartDate.setDate(todayDate.getDate() - 30);

                $('#search-links-start-date').kendoDatePicker({
                    value: defaultStartDate
                });

                $('#search-links-end-date').kendoDatePicker();
            })();

            //Grids
            function linkSearchGrid () {
               
                var searchGridDefaultSettings = {
                    scrollable: true,
                    sortable: true,
                    filterable: true,
                    selectable: 'single',
                    resizable: true,
                    columnMenu: true,
                    pageable: {
                        refresh: true,
                        pageSizes: true
                    },
                    columns: [
                    { field: "Id", title: "Id", width: "50px", hidden: true },
                    { field: "Project.Name", title: "Project", width: "100px" },
                    {
                        field: "TargetUrl",
                        title: "Target URL",
                        width: "250px",
                    },
                    { field: "RootMethod", title: "Root Method", width: "250px", hidden: true },
                    { field: "ContactEmail", title: "Email", width: "200px", hidden: true },
                    { field: "DomainAuthority", title: "DA", width: "30px", hidden: true },
                    { field: "LinkStatus.Name", title: "Status", width: "100px" },
                    { field: "DateLastModified", title: "Last Modified", width: "100px", template: '#= (data.DateLastModified) ? kendo.toString(kendo.parseDate(DateLastModified), "MM/dd/yyyy" ) : " " #' },
                    { field: "LastModifiedBy", title: "Last Modified By", width: "100px" },
                    { field: "LinkType.Name", title: "Link Type", width: "100px" },
                    { field: "LinkBuildingMode.Name", title: "Mode", width: "100px" },
                    { field: "Article.Title", title: "Article", width: "125px" },
                    { field: "FoundBy", title: "Site Found By", width: "100px", hidden: true }
                    ]
                };

                var searchGridSettings = p1p.localsettings.get('linkbuilding', 'grd-search-links', 'grid', searchGridDefaultSettings);

                searchGridSettings.columnResize = function (e) {
                    p1p.localsettings.set('linkbuilding', 'grd-search-links', 'grid', 'columns', e.column.field, 'width', e.newWidth);
                };
                searchGridSettings.columnShow = function (e) {
                    p1p.localsettings.set('linkbuilding', 'grd-search-links', 'grid', 'columns', e.column.field, 'hidden', false);
                };
                searchGridSettings.columnHide = function (e) {
                    p1p.localsettings.set('linkbuilding', 'grd-search-links', 'grid', 'columns', e.column.field, 'hidden', true);
                };
                searchGridSettings.change = function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedLink = grid.dataItem($(this));                        
                    });
                };

                $('#grd-search-links').dblclick(function (e) {
                    var row = $(e.target).closest("tr");
                    var item = $('#grd-search-links').data('kendoGrid').dataItem(row);
                    model.setCurrentLink(item.toJSON());
                    $('#win-search-links').data('kendoWindow').close();
                });                

                $.grep(searchGridSettings.columns, function (column) {
                    return column.field === 'TargetUrl';
                })[0].template = function (dataItem) {
                    return "<a href=\"" + dataItem.TargetUrl + "\" target=\"_blank\">" + dataItem.TargetUrl + "</a>";
                };
                
                $('#grd-search-links').kendoGrid(searchGridSettings);

                model.topics.filteredLinksRetrieved.add(function () {
                    $('#grd-search-links').data('kendoGrid').dataSource.pageSize(100);
                    $('#grd-search-links').data('kendoGrid').dataSource.data(model.getFilteredLinks());
                });
                
                $('#grd-search-links').on('click', '.k-i-refresh', function (e) {
                    e.preventDefault();
                    $("form.k-filter-menu button[type='reset']").trigger("click");
                    $('#grd-search-links').data('kendoGrid').dataSource.pageSize(100);
                    $('#grd-search-links').data('kendoGrid').dataSource.data(model.getFilteredLinks());
                });
                
                model.fetchFilteredLinks($('#search-links-project').val(), $('#search-links-status').val(), 0, $('#search-links-strategy').val());
            }
        }
    }

    function init() {
        p1p.staticdata.initializeStaticData(initUi);
    }

    $(init);
})();