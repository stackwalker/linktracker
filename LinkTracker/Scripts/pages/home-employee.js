/// <reference path="../lib/kendo/js/kendo.all.min.js" />
/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="home-employee-model.js" />

(function () {

    var model = p1p.home.getModel();

    function initUi() {

        model.topics.retrievingReport.add(function () {
            $('body').addClass('working');
        });

        model.topics.reportRetrieved.add(function () {
            $('body').removeClass('working');
        });

        model.checkIsUserManager();

        model.topics.isUserManagerChecked.add(function () {

            if (model.getIsUserManager()) {
                model.fetchTeams();
                $('.manager-content').removeClass('hidden')

            } else {
                model.fetchUserTeam();
                model.topics.isUserAdminChecked.add(function () {
                    if (model.getIsUserAdmin) {
                        $('#overview-team').click();
                    } else {
                        $('#overview-mine').click();
                    }
                    retrieveData();

                });
            }
        });

        $('#select-team').kendoComboBox({
            placeholder: 'Select Team',
            dataTextField: 'Name',
            dataValueField: 'Id',
            change: function () {
                model.setTeam($('#select-team').data('kendoComboBox').value());                
            }
        });

        model.topics.teamsRetrieved.add(function () {
            $('#select-team').data('kendoComboBox').dataSource.data(model.getTeams());
            $('#select-team').data('kendoComboBox').value(1);
            model.setTeam($('#select-team').data('kendoComboBox').value());
            $('#overview-team').click();
        });

        $('#select-project').kendoComboBox({
            placeholder: 'Select Project',
            dataTextField: 'Name',
            dataValueField: 'Id',
        });

        model.topics.projectsRetrieved.add(function () {
            $('#select-project').data('kendoComboBox').dataSource.data(model.getProjects());
        });

        $('#overview-team').click(function () {
            $('.overview-mode').removeClass('mode-active mode-inactive');
            $('#overview-team').addClass('mode-active');
            $('#overview-mine').addClass('mode-inactive');
            model.setOnlyMine(false);
            model.fetchProjects();
        });

        $('#overview-mine').click(function () {
            $('.overview-mode').removeClass('mode-active mode-inactive');
            $('#overview-mine').addClass('mode-active');
            $('#overview-team').addClass('mode-inactive');
            model.setOnlyMine(true);
            model.fetchProjects();
        });

        var todayDate = new Date();
        var yesterdayDate = new Date();
        
        yesterdayDate.setDate(todayDate.getDate() - 7);


        $('#select-start-date').kendoDatePicker({
            value: yesterdayDate,
        });

        $('#select-end-date').kendoDatePicker({
            value: todayDate,            
        });

        model.topics.linkActivated.add(function () {
            retrieveData();
        });

        model.topics.linkDeleted.add(function () {
            retrieveData();
        });

        $('#btn-update-data').click(function () {
            $(this).prop('disabled', true);
            retrieveData();
        });

        model.topics.reportRetrieved.add(function () {
            $('#btn-update-data').prop('disabled', false);
        });

        linkDetailsWindow();
        needsOutreach();
        linksToActivate();
        sendToLeadership();
        outreach();
        inCommunication();
        needsFollowUp();
        scheduled();
        links();
        hours();
        outreachVsInCommunication();
        articlesGrid();
        changelogWindow();

    }

    function retrieveData() {
        model.fetchOverviewData($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());
    }

    function linkDetailsWindow() {
        var win = $("#win-link-details").kendoWindow({
            title: "Link Details",
            visible: false,
            width: "1000px"
        }).data("kendoWindow");

        $(".open-link-details").click(function () {
            var win = $("#win-link-details").data("kendoWindow");
            win.center();
            win.open();
        });

        $('#open-needs-outreach').click(function () {
            $('body').addClass('working');
            model.fetchNeedsOutreach($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

            model.topics.needsOutreachLinksRetrieved.add(function () {
                $('#grd-needs-outreach').data('kendoGrid').dataSource.data(model.getNeedsOutreach());
                $('#win-link-details_wnd_title').html('Needs Outreach Links');
                $('body').removeClass('working');
            });
        });

        $('#open-activate').click(function () {
            $('body').addClass('working');
            model.fetchLinksToActivate($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

            model.topics.linksToActivateRetrieved.add(function () {
                $('#grd-links-to-activate').data('kendoGrid').dataSource.data(model.getLinksToActivate());
                $('#win-link-details_wnd_title').html('Links To Activate');
                clearLinkData();
                $('body').removeClass('working');
            });
        });

        $('#open-send-to-leadership').click(function () {
            $('body').addClass('working');
            model.fetchSendToLeadership($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

            model.topics.sendToLeadershipLinksRetrieved.add(function () {
                $('#grd-send-to-leadership').data('kendoGrid').dataSource.data(model.getSendToLeadership());
                $('#win-link-details_wnd_title').html('Send To Leadership');
                $('body').removeClass('working');
            });
        });

        $('#open-outreach').click(function () {
            $('body').addClass('working');
            model.fetchOutreachLinks($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

            model.topics.outreachLinksRetrieved.add(function () {
                $('#grd-outreach').data('kendoGrid').dataSource.data(model.getOutreachLinks());
                $('#win-link-details_wnd_title').html('Outreach Links');
                $('body').removeClass('working');
            });
        });

        $('#open-in-communication').click(function () {
            $('body').addClass('working');
            model.fetchInCommunication($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

            model.topics.inCommunicationLinksRetrieved.add(function () {
                $('#grd-in-communication').data('kendoGrid').dataSource.data(model.getInCommunication());
                $('#win-link-details_wnd_title').html('In Communication Links');
                $('body').removeClass('working');
            });
        });

        $('#open-needs-follow-up').click(function () {
            $('body').addClass('working');
            model.fetchNeedsFollowUp($('#select-project').val());

            model.topics.needsFollowUpRetrieved.add(function () {
                $('#grd-needs-follow-up').data('kendoGrid').dataSource.data(model.getNeedsFollowUp());
                $('#win-link-details_wnd_title').html('Needs Attention');
                $('body').removeClass('working');
            });
        });

        $('#open-scheduled').click(function () {
            $('body').addClass('working');
            model.fetchScheduledLinks($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

            model.topics.scheduledLinksRetrieved.add(function () {
                $('#grd-scheduled').data('kendoGrid').dataSource.data(model.getScheduledLinks());
                $('#win-link-details_wnd_title').html('Scheduled Links');
                $('body').removeClass('working');
            });
        });

        $('#open-links').click(function () {
            $('body').addClass('working');
            model.fetchAcquiredLinks($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());
           
            model.topics.acquiredLinksRetrieved.add(function () {
                $('#grd-links').data('kendoGrid').dataSource.data(model.getAcquiredLinks());
                $('#win-link-details_wnd_title').html('Active Links');
                $('body').removeClass('working');
            });
        });

        $("#close-link-details, .k-i-close").click(function () {
            $("#win-link-details").data("kendoWindow").close();
            $('.link-details').addClass('hidden-grid');
            clearLinkData();
        });
    }

    function needsOutreach() {
        needsOutreachChart();
        needsOutreachGrid();

        $('#export-needs-outreach').click(function () {
            $('body').addClass('working');
            model.fetchNeedsOutreach($('#select-project').val());

            model.topics.needsOutreachLinksRetrieved.add(function () {
                $('body').removeClass('working');

                console.log('works');
                var data = model.getNeedsOutreach();
                var csv = csvInit('Link');
                $.each(data, function (i) {
                    var notes = data[i].Notes;
                    var article;
                    if (data[i].Article) {
                        article = data[i].Article.Title;
                    }
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].TargetUrl + ","
                        + data[i].RootUrl + ","
                        + data[i].RootMethod + ","
                        + data[i].LinkStrategy.Name + ","
                        + article + ","
                        + data[i].AnchorText + ","
                        + data[i].DomainAuthority + ","
                        + data[i].PageRelevance + ","
                        + data[i].SiteRelevance + ","
                        + data[i].LinkLocation.Name + ","
                        + data[i].PublishedUrl + ","
                        + data[i].LandingPage + ","
                        + data[i].LinkStatus.Name + ","
                        + data[i].DateFound + ","
                        + data[i].DatePublished + ","
                        + data[i].FoundBy + ","
                        + data[i].LastModifiedBy + ","
                        + data[i].DateLastModified + ","
                        + data[i].AcquiredBy + ","
                        + data[i].LinkBuildingMode.Name + ","
                        + data[i].ContactEmail + ","
                        + data[i].ContactPhone + ","
                        + data[i].ContactUrl + ","
                        + notes + ","
                        + data[i].LinkType.Name + "\n"
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "NeedsOutreach.csv");
                link.click();
            });
        });

        function needsOutreachChart() {
            var chartSettings = {
                chartArea: {
                    height: 100,
                    width: 1114
                },
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "bar",
                    stack: true
                },
                valueAxis: {
                    line: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                seriesColors: getColorArray(),
                series: [

                ],
                tooltip: {
                    visible: true,
                    template: "#= series.Name #: #= value #"
                }
            };

            model.topics.reportRetrieved.add(function () {
                chartSettings.series = model.getAggregateNeedsOutreach();

                $('#chrt-needs-outreach').kendoChart(chartSettings);
            });
        }

        function needsOutreachGrid() {
            var selectedLink;

            $("#grd-needs-outreach").kendoGrid({
                columnMenu: true,
                selectable: 'single',
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    { field: "Project.Name", title: "Project", width: '125px' },
                    {
                        field: "TargetUrl",
                        title: "Target Url",
                        template: function (dataItem) {
                            return "<a href=\"" + dataItem.TargetUrl + "\"target=\"_blank\">" + dataItem.TargetUrl + "</a>";
                        },
                    },
                    { field: "DateLastModified", title: "Last Modified", width: '100px', template: '#= (data.DateLastModified) ? kendo.toString(kendo.parseDate(DateLastModified), "MM/dd/yyyy" ) : " " #' },
                    { field: "LastModifiedBy", title: "Last Modified By", width: '125px' },
                    { field: "LinkBuildingMode.Name", title: "Mode", width: "100px" },
                    {
                        command: {
                            text: "Delete", click: deleteLink
                        },
                        title: " ",
                        width: '85px'
                    }


                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                },
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedLink = grid.dataItem($(this));
                        bindLinkData(selectedLink);
                    });
                }
            });

            function deleteLink() {
                if (model.getIsUserAdmin()) {
                    if (confirm('Are you sure you want to delete the target ' + selectedLink.TargetUrl + '?')) {
                        model.deleteLink(selectedLink.Id);
                    }
                } else {
                    alert('You do not have permission to delete links.');
                }

                model.topics.linkDeleted.add(model.fetchNeedsOutreach());
            }

            $('#grd-needs-outreach').dblclick(function () {
                var grid = $('#grd-needs-outreach').data('kendoGrid');
                openTarget(grid.dataItem(grid.select()).Id);
            });

            $('#open-needs-outreach').click(function () {
                $('#grd-needs-outreach').removeClass('hidden-grid');
            });

        }
    }

    function linksToActivate() {
        requestToActivateChart();
        requestToActivateGrid();

        $('#exportLinksToActivate').click(function () {
            $('body').addClass('working');
            model.fetchLinksToActivate($('#select-project').val());

            model.topics.linksToActivateRetrieved.add(function () {
                $('body').removeClass('working');

                var data = model.getLinksToActivate();
                var csv = csvInit('Link');
                $.each(data, function (i) {
                    var notes = data[i].Notes;
                    var article;
                    if (data[i].Article) {
                        article = data[i].Article.Title;
                    }
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].TargetUrl + ","
                        + data[i].RootUrl + ","
                        + data[i].RootMethod + ","
                        + data[i].LinkStrategy.Name + ","
                        + article + ","
                        + data[i].AnchorText + ","
                        + data[i].DomainAuthority + ","
                        + data[i].PageRelevance + ","
                        + data[i].SiteRelevance + ","
                        + data[i].LinkLocation.Name + ","
                        + data[i].PublishedUrl + ","
                        + data[i].LandingPage + ","
                        + data[i].LinkStatus.Name + ","
                        + data[i].DateFound + ","
                        + data[i].DatePublished + ","
                        + data[i].FoundBy + ","
                        + data[i].LastModifiedBy + ","
                        + data[i].DateLastModified + ","
                        + data[i].AcquiredBy + ","
                        + data[i].LinkBuildingMode.Name + ","
                        + data[i].ContactEmail + ","
                        + data[i].ContactPhone + ","
                        + data[i].ContactUrl + ","
                        + notes + ","
                        + data[i].LinkType.Name + "\n"
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "LinksToActivate.csv");
                link.click();
            });
        });

        function requestToActivateChart() {
            var chartSettings = {
                chartArea: {
                    height: 100,
                    width: 535
                },
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "bar",
                    stack: true
                },
                valueAxis: {
                    line: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                seriesColors: getColorArray(),
                series: [

                ],
                tooltip: {
                    visible: true,
                    template: "#= series.Name #: #= value #"
                }
            };

            model.topics.reportRetrieved.add(function () {
                chartSettings.series = model.getAggregateLinksToActivate();

                $('#chrt-links-to-activate').kendoChart(chartSettings);
            });
        }

        function requestToActivateGrid() {
            var selectedLink;

            $("#grd-links-to-activate").kendoGrid({
                columnMenu: true,
                selectable: 'single',
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    { field: "Project.Name", title: "Project", width: '125px' },
                    {
                        field: "PublishedUrl",
                        title: "Published Url",
                        template: function (dataItem) {
                            return "<a href=\"" + dataItem.PublishedUrl + "\"target=\"_blank\">" + dataItem.PublishedUrl + "</a>";
                        },
                    },
                    { field: "DateLastModified", title: "Last Modified", width: '100px', template: '#= (data.DateLastModified) ? kendo.toString(kendo.parseDate(DateLastModified), "MM/dd/yyyy" ) : " " #' },
                    { field: "LastModifiedBy", title: "Last Modified By", width: '125px' },
                    { field: "LinkBuildingMode.Name", title: "Mode", width: "100px" },
                { command: { text: "Set Active", click: activateLink }, title: " ", width: '95px' },
                {
                    command: {
                        text: "Delete", click: deleteLink
                    },
                    title: " ",
                    width: '85px'
                }


                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                },
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedLink = grid.dataItem($(this));
                        bindLinkData(selectedLink);
                    });
                }
            });

            function deleteLink() {
                if (model.getIsUserAdmin()) {
                    if (confirm('Are you sure you want to delete the target ' + selectedLink.TargetUrl + '?')) {
                        model.deleteLink(selectedLink.Id);
                    }
                } else {
                    alert('You do not have permission to delete links.');
                }
                model.topics.linkDeleted.add(model.fetchLinksToActivate());
            }

            $('#grd-links-to-activate').dblclick(function () {
                var grid = $('#grd-links-to-activate').data('kendoGrid');
                openTarget(grid.dataItem(grid.select()).Id);
            });

            function activateLink() {
                if (model.getIsUserAdmin()) {
                    if (confirm('Are you sure you want to activate the target ' + selectedLink.TargetUrl + '?')) {
                        selectedLink.LinkStatus.Id = 10;
                        model.activateLink(selectedLink);                        
                    }
                } else {
                    alert('You do not have permission to activate links.');
                }
            }

            $('#open-activate').click(function () {
                $('#grd-links-to-activate').removeClass('hidden-grid');
            });

        }
    }

    function sendToLeadership() {
        sendToLeadershipChart();
        sendToLeadershipGrid();

        $('#exportSendToLeadership').click(function () {
            $('body').addClass('working');
            model.fetchSendToLeadership($('#select-project').val());

            model.topics.sendToLeadershipLinksRetrieved.add(function () {
                $('body').removeClass('working');


                var data = model.getSendToLeadership();
                var csv = csvInit('Link');
                $.each(data, function (i) {
                    var notes = data[i].Notes;
                    var article;
                    if (data[i].Article) {
                        article = data[i].Article.Title;
                    }
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].TargetUrl + ","
                        + data[i].RootUrl + ","
                        + data[i].RootMethod + ","
                        + data[i].LinkStrategy.Name + ","
                        + article + ","
                        + data[i].AnchorText + ","
                        + data[i].DomainAuthority + ","
                        + data[i].PageRelevance + ","
                        + data[i].SiteRelevance + ","
                        + data[i].LinkLocation.Name + ","
                        + data[i].PublishedUrl + ","
                        + data[i].LandingPage + ","
                        + data[i].LinkStatus.Name + ","
                        + data[i].DateFound + ","
                        + data[i].DatePublished + ","
                        + data[i].FoundBy + ","
                        + data[i].LastModifiedBy + ","
                        + data[i].DateLastModified + ","
                        + data[i].AcquiredBy + ","
                        + data[i].LinkBuildingMode.Name + ","
                        + data[i].ContactEmail + ","
                        + data[i].ContactPhone + ","
                        + data[i].ContactUrl + ","
                        + notes + ","
                        + data[i].LinkType.Name + "\n"
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "SendToLeadership.csv");
                link.click();
            });
        });

        function sendToLeadershipChart() {
            var chartSettings = {
                chartArea: {
                    height: 100,
                    width: 535
                },
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "bar",
                    stack: true
                },
                seriesColors: getColorArray(),
                series: [],
                valueAxis: {
                    line: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                tooltip: {
                    visible: true,
                    template: "#= series.Name #: #= value #"
                }
            };

            model.topics.reportRetrieved.add(function () {
                chartSettings.series = model.getAggregateSendToLeadership();

                $('#chrt-send-to-leadership').kendoChart(chartSettings);
            });
        }

        function sendToLeadershipGrid() {
            var selectedLink;

            $("#grd-send-to-leadership").kendoGrid({
                columnMenu: true,
                columns: [
                    { field: 'Id', hidden: true },
                    { field: "Project.Name", title: "Project", width: '125px' },
                    {
                        field: "TargetUrl",
                        title: "Target Url",
                        template: function (dataItem) {
                            return "<a href=\"" + dataItem.TargetUrl + "\"target=\"_blank\">" + dataItem.TargetUrl + "</a>";
                        }
                    },
                    { field: "DateLastModified", title: 'Last Modified', template: '#= (data.DateLastModified) ? kendo.toString(kendo.parseDate(DateLastModified), "MM/dd/yyyy" ) : " " #' },
                    { field: "LastModifiedBy", title: 'Last Modified By' },
                    { field: "LinkBuildingMode.Name", title: "Mode", width: "100px" },
                {
                    command: {
                        text: "Delete", click: deleteLink
                    },
                    title: " ",
                    width: '85px'
                }
                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                },
                selectable: 'single',
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedLink = grid.dataItem($(this));
                        bindLinkData(selectedLink);
                    });
                }
            });

            function deleteLink() {
                if (model.getIsUserAdmin()) {
                    if (confirm('Are you sure you want to delete the target ' + selectedLink.TargetUrl + '?')) {
                        model.deleteLink(selectedLink.Id);
                    }
                } else {
                    alert('You do not have permission to delete links.');
                }
                model.topics.linkDeleted.add(model.fetchSendToLeadership());
            }

            $('#grd-send-to-leadership').dblclick(function () {
                var grid = $('#grd-send-to-leadership').data('kendoGrid');
                openTarget(grid.dataItem(grid.select()).Id);
            });

            $('#open-send-to-leadership').click(function () {
                $('#grd-send-to-leadership').removeClass('hidden-grid');
            });
        }
    }

    function outreach() {
        outreachChart();
        outreachGrid();

        $('#exportOutreach').click(function () {
            $('body').addClass('working');
            model.fetchOutreachLinks($('#select-project').val());

            model.topics.outreachLinksRetrieved.add(function () {
                $('body').removeClass('working');

                var data = model.getOutreachLinks();
                var csv = csvInit('Link');
                $.each(data, function (i) {
                    var notes = data[i].Notes;
                    var article;
                    if (data[i].Article) {
                        article = data[i].Article.Title;
                    }
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].TargetUrl + ","
                        + data[i].RootUrl + ","
                        + data[i].RootMethod + ","
                        + data[i].LinkStrategy.Name + ","
                        + article + ","
                        + data[i].AnchorText + ","
                        + data[i].DomainAuthority + ","
                        + data[i].PageRelevance + ","
                        + data[i].SiteRelevance + ","
                        + data[i].LinkLocation.Name + ","
                        + data[i].PublishedUrl + ","
                        + data[i].LandingPage + ","
                        + data[i].LinkStatus.Name + ","
                        + data[i].DateFound + ","
                        + data[i].DatePublished + ","
                        + data[i].FoundBy + ","
                        + data[i].LastModifiedBy + ","
                        + data[i].DateLastModified + ","
                        + data[i].AcquiredBy + ","
                        + data[i].LinkBuildingMode.Name + ","
                        + data[i].ContactEmail + ","
                        + data[i].ContactPhone + ","
                        + data[i].ContactUrl + ","
                        + notes + ","
                        + data[i].LinkType.Name + "\n"
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "Outreach.csv");
                link.click();
            });
        });

        function outreachChart() {
            var chartSettings = {
                chartArea: {
                    height: 100,
                    width: 535
                },
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "bar",
                    stack: true
                },
                valueAxis: {
                    line: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                seriesColors: getColorArray(),
                series: [

                ],
                tooltip: {
                    visible: true,
                    template: "#= series.Name #: #= value #"
                }
            };

            model.topics.reportRetrieved.add(function () {
                chartSettings.series = model.getAggregateOutreachLinks();

                $('#chrt-outreach').kendoChart(chartSettings);
            });
        }

        function outreachGrid() {
            var selectedLink;

            $("#grd-outreach").kendoGrid({
                columnMenu: true,
                columns: [
                    { field: 'Id', hidden: true },
                    { field: "Project.Name", title: "Project", width: '125px' },
                    {
                        field: "TargetUrl",
                        title: "Target Url",
                        template: function (dataItem) {
                            return "<a href=\"" + dataItem.TargetUrl + "\"target=\"_blank\">" + dataItem.TargetUrl + "</a>";
                        },
                        width: "100px"
                    },
                    { field: "DateLastModified", title: 'Last Modified', width: "50px", template: '#= (data.DateLastModified) ? kendo.toString(kendo.parseDate(DateLastModified), "MM/dd/yyyy" ) : " " #' },
                    { field: "LastModifiedBy", title: 'Last Modified', width: "50px" },
                    { field: "LinkBuildingMode.Name", title: "Mode", width: "100px" },
                {
                    command: {
                        text: "Delete", click: deleteLink
                    },
                    title: " ",
                    width: '85px'
                }
                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                },
                selectable: 'single',
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedLink = grid.dataItem($(this));
                        bindLinkData(selectedLink);
                    });
                }

            });

            function deleteLink() {
                if (model.getIsUserAdmin()) {
                    if (confirm('Are you sure you want to delete the target ' + selectedLink.TargetUrl + '?')) {
                        model.deleteLink(selectedLink.Id);
                    }
                } else {
                    alert('You do not have permission to delete links.');
                }
                model.topics.linkDeleted.add(model.fetchOutreachLinks());
            }

            $('#grd-outreach').dblclick(function () {
                var grid = $('#grd-outreach').data('kendoGrid');
                openTarget(grid.dataItem(grid.select()).Id);
            });

            $('#open-outreach').click(function () {
                $('#grd-outreach').removeClass('hidden-grid');
            });
        }

    }

    function inCommunication() {
        inCommunicationChart();
        inCommunicationGrid();

        $('#exportInCommunication').click(function () {
            $('body').addClass('working');
            model.fetchInCommunication($('#select-project').val());

            model.topics.inCommunicationLinksRetrieved.add(function () {
                $('body').removeClass('working');

                var data = model.getInCommunication();
                var csv = csvInit('Link');
                $.each(data, function (i) {
                    var notes = data[i].Notes;
                    var article;
                    if (data[i].Article) {
                        article = data[i].Article.Title;
                    }
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].TargetUrl + ","
                        + data[i].RootUrl + ","
                        + data[i].RootMethod + ","
                        + data[i].LinkStrategy.Name + ","
                        + article + ","
                        + data[i].AnchorText + ","
                        + data[i].DomainAuthority + ","
                        + data[i].PageRelevance + ","
                        + data[i].SiteRelevance + ","
                        + data[i].LinkLocation.Name + ","
                        + data[i].PublishedUrl + ","
                        + data[i].LandingPage + ","
                        + data[i].LinkStatus.Name + ","
                        + data[i].DateFound + ","
                        + data[i].DatePublished + ","
                        + data[i].FoundBy + ","
                        + data[i].LastModifiedBy + ","
                        + data[i].DateLastModified + ","
                        + data[i].AcquiredBy + ","
                        + data[i].LinkBuildingMode.Name + ","
                        + data[i].ContactEmail + ","
                        + data[i].ContactPhone + ","
                        + data[i].ContactUrl + ","
                        + notes + ","
                        + data[i].LinkType.Name + "\n"
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "InCommunication.csv");
                link.click();
            });
        });

        function inCommunicationChart() {
            var chartSettings = {
                chartArea: {
                    height: 100,
                    width: 535
                },
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "bar",
                    stack: true
                },
                valueAxis: {
                    line: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                seriesColors: getColorArray(),
                series: [

                ],
                tooltip: {
                    visible: true,
                    template: "#= series.Name #: #= value #"
                }
            };

            model.topics.reportRetrieved.add(function () {
                chartSettings.series = model.getAggregateInCommunication();

                $('#chrt-in-communication').kendoChart(chartSettings);
            });
        }

        function inCommunicationGrid() {
            var selectedLink;

            $("#grd-in-communication").kendoGrid({
                columnMenu: true,
                columns: [
                    { field: 'Id', hidden: true },
                    { field: "Project.Name", title: "Project", width: '125px' },
                    {
                        field: "TargetUrl",
                        title: "Target Url",
                        template: function (dataItem) {
                            return "<a href=\"" + dataItem.TargetUrl + "\"target=\"_blank\">" + dataItem.TargetUrl + "</a>";
                        }
                    },
                    { field: "DateLastModified", title: 'Last Modified', template: '#= (data.DateLastModified) ? kendo.toString(kendo.parseDate(DateLastModified), "MM/dd/yyyy" ) : " " #' },
                    { field: "LastModifiedBy", title: 'Last Modified By' },
                    { field: "LinkBuildingMode.Name", title: "Mode", width: "100px" },
                {
                    command: {
                        text: "Delete", click: deleteLink
                    },
                    title: " ",
                    width: '85px'
                }
                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                },
                selectable: 'single',
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedLink = grid.dataItem($(this));
                        bindLinkData(selectedLink);
                    });
                }
            });

            function deleteLink() {
                if (model.getIsUserAdmin()) {
                    if (confirm('Are you sure you want to delete the target ' + selectedLink.TargetUrl + '?')) {
                        model.deleteLink(selectedLink.Id);
                    }
                } else {
                    alert('You do not have permission to delete links.');
                }
                model.topics.linkDeleted.add(model.fetchInCommunication());
            }

            $('#grd-in-communication').dblclick(function () {
                var grid = $('#grd-in-communication').data('kendoGrid');
                openTarget(grid.dataItem(grid.select()).Id);
            });

            $('#open-in-communication').click(function () {
                $('#grd-in-communication').removeClass('hidden-grid');
            });
        }
    }

    function needsFollowUp() {
        needsFollowUpChart();
        needsFollowUpGrid();

        $('#exportNeedsFollowUp').click(function () {
            $('body').addClass('working');
            model.fetchNeedsFollowUp($('#select-project').val());

            model.topics.needsFollowUpRetrieved.add(function () {
                $('body').removeClass('working');
                var data = model.getNeedsFollowUp();
                var csv = csvInit('Link');
                $.each(data, function (i) {
                    var notes = data[i].Notes;
                    var article;
                    if (data[i].Article) {
                        article = data[i].Article.Title;
                    }
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].TargetUrl + ","
                        + data[i].RootUrl + ","
                        + data[i].RootMethod + ","
                        + data[i].LinkStrategy.Name + ","
                        + article + ","
                        + data[i].AnchorText + ","
                        + data[i].DomainAuthority + ","
                        + data[i].PageRelevance + ","
                        + data[i].SiteRelevance + ","
                        + data[i].LinkLocation.Name + ","
                        + data[i].PublishedUrl + ","
                        + data[i].LandingPage + ","
                        + data[i].LinkStatus.Name + ","
                        + data[i].DateFound + ","
                        + data[i].DatePublished + ","
                        + data[i].FoundBy + ","
                        + data[i].LastModifiedBy + ","
                        + data[i].DateLastModified + ","
                        + data[i].AcquiredBy + ","
                        + data[i].LinkBuildingMode.Name + ","
                        + data[i].ContactEmail + ","
                        + data[i].ContactPhone + ","
                        + data[i].ContactUrl + ","
                        + notes + ","
                        + data[i].LinkType.Name + "\n"
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "NeedsFollowUp.csv");
                link.click();
            });
        });

        function needsFollowUpWin() {
            var win = $("#win-needs-follow-up").kendoWindow({
                height: "400px",
                title: "Needs Attention",
                visible: false,
                width: "800px"
            }).data("kendoWindow");

            $("#open-needs-follow-up").click(function () {
                var win = $("#win-needs-follow-up").data("kendoWindow");
                win.center();
                win.open();
            });

            $("#close-needs-follow-up").click(function () {
                $("#win-needs-follow-up").data("kendoWindow").close();
            });
        }

        function needsFollowUpChart() {

            $('#needs-follow-up-weeks').click(function () {
                $('.project-weeks-mode').removeClass('mode-active mode-inactive');
                $('#needs-follow-up-weeks').addClass('mode-active');
                $('#needs-follow-up-projects').addClass('mode-inactive');
                $('#chrt-needs-follow-up').addClass('hidden');
                $('#chrt-needs-follow-up-weeks').removeClass('hidden');
            });
            $('#needs-follow-up-projects').click(function () {
                $('.project-weeks-mode').removeClass('mode-active mode-inactive');
                $('#needs-follow-up-projects').addClass('mode-active');
                $('#needs-follow-up-weeks').addClass('mode-inactive');
                $('#chrt-needs-follow-up-weeks').addClass('hidden');
                $('#chrt-needs-follow-up').removeClass('hidden');
            })

            var weeklyChartSettings = {
                legend: {
                    visible: false
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    lables: {
                        visible: true,
                        background: "transparent",
                        template: "#= category #"
                    }
                },
                seriesColors: getColorArray(),
                series: [{
                    field: "Id",
                    categoryField: "Name",
                    type: "pie",
                    
                }],
                tooltip: {
                    visible: true,
                    template: "#= category #: #= value #"
                }
            };

            model.topics.reportRetrieved.add(function () {
                $('#chrt-needs-follow-up-weeks').kendoChart(weeklyChartSettings);
                var data = model.getWeeklyNeedsFollowUpAggregate();
                var aggregates = [];
                var count = 1;
                $.each(data, function (i, a) {
                    if (data[i] > 0) {
                        console.log(data.length);
                        var label = count + ' week';
                        if (count > 1) {
                            label = label + 's';
                        }
                        label = label + ' old';
                        count++;
                    } else {
                        label = "";
                    }
                    aggregates.push({
                        Name: label,
                        Id: data[i]
                    });
                });
                $('#chrt-needs-follow-up-weeks').data('kendoChart').dataSource.data(aggregates);

            });

            $("#chrt-needs-follow-up").kendoChart({
                legend: {
                    visible: false
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    type: "column"
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                },
                dataSource: {
                    group: { field: "Name" }
                },
                seriesColors: getColorArray(),
                series: [{ name: "#= group.value #", field: "Aggregate" }]
            });


            model.topics.reportRetrieved.add(function () {
                $('#chrt-needs-follow-up').data('kendoChart').dataSource.data(model.getAggregateNeedsFollowUp());
            });
        }

        function needsFollowUpGrid() {
            var selectedLink;

            $("#grd-needs-follow-up").kendoGrid({
                columnMenu: true,
                columns: [
                    { field: 'Id', hidden: true },
                    { field: "Project.Name", title: "Project", width: '125px' },
                    {
                        field: "TargetUrl",
                        title: "Target Url",
                        template: function (dataItem) {
                            return "<a href=\"" + dataItem.TargetUrl + "\"target=\"_blank\">" + dataItem.TargetUrl + "</a>";
                        },
                        width: "100px"
                    },
                    { field: "LinkStatus.Id", title: "Status", width: '50px', template: "#= LinkStatus.Name #"},
                    { field: "DateLastModified", title: 'Last Modified', width: "50px", template: '#= (data.DateLastModified) ? kendo.toString(kendo.parseDate(DateLastModified), "MM/dd/yyyy" ) : " " #' },
                    { field: "LastModifiedBy", title: 'Last Modified By', width: "50px" },
                    { field: "LinkBuildingMode.Name", title: "Mode", width: "100px" },
                {
                    command: {
                        text: "Delete", click: deleteLink
                    },
                    title: " ",
                    width: '85px'
                }
                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                },
                selectable: 'single',
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedLink = grid.dataItem($(this));
                        bindLinkData(selectedLink);
                    });
                }
            });

            function deleteLink() {
                if (model.getIsUserAdmin()) {
                    if (confirm('Are you sure you want to delete the target ' + selectedLink.TargetUrl + '?')) {
                        model.deleteLink(selectedLink.Id);
                    }
                } else {
                    alert('You do not have permission to delete links.');
                }
                model.topics.linkDeleted.add(model.fetchNeedsFollowUp($('#select-project').val()));
            }

            $('#grd-needs-follow-up').dblclick(function () {
                var grid = $('#grd-needs-follow-up').data('kendoGrid');
                openTarget(grid.dataItem(grid.select()).Id);
            });


            $('#open-needs-follow-up').click(function () {
                $('#grd-needs-follow-up').removeClass('hidden-grid');
            });
        }
    }

    function scheduled() {
        scheduledChart();
        scheduledGrid();

        $('#exportScheduled').click(function () {
            $('body').addClass('working');
            model.fetchScheduledLinks($('#select-project').val());

            model.topics.scheduledLinksRetrieved.add(function () {
                $('body').removeClass('working');
                var data = model.getScheduledLinks();
                var csv = csvInit('Link');
                $.each(data, function (i) {
                    var notes = data[i].Notes;
                    var article;
                    if (data[i].Article) {
                        article = data[i].Article.Title;
                    }
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].TargetUrl + ","
                        + data[i].RootUrl + ","
                        + data[i].RootMethod + ","
                        + data[i].LinkStrategy.Name + ","
                        + article + ","
                        + data[i].AnchorText + ","
                        + data[i].DomainAuthority + ","
                        + data[i].PageRelevance + ","
                        + data[i].SiteRelevance + ","
                        + data[i].LinkLocation.Name + ","
                        + data[i].PublishedUrl + ","
                        + data[i].LandingPage + ","
                        + data[i].LinkStatus.Name + ","
                        + data[i].DateFound + ","
                        + data[i].DatePublished + ","
                        + data[i].FoundBy + ","
                        + data[i].LastModifiedBy + ","
                        + data[i].DateLastModified + ","
                        + data[i].AcquiredBy + ","
                        + data[i].LinkBuildingMode.Name + ","
                        + data[i].ContactEmail + ","
                        + data[i].ContactPhone + ","
                        + data[i].ContactUrl + ","
                        + notes + ","
                        + data[i].LinkType.Name + "\n"
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "Scheduled.csv");
                link.click();
            });
        });

        function scheduledChart() {
            $('#chrt-scheduled').kendoChart({
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "column"
                },
                chartArea: {
                    background: ""
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                },
                dataSource: {
                    group: { field: "Name" }
                },
                seriesColors: getColorArray(),
                series: [{ name: "#= group.value #", field: "Aggregate" }]
            });

            model.topics.reportRetrieved.add(function () {
                $('#chrt-scheduled').data('kendoChart').dataSource.data(model.getAggregateScheduledLinks());
            });
        }

        function scheduledGrid() {
            var selectedLink;

            $('#grd-scheduled').kendoGrid({
                columnMenu: true,
                columns: [
                                    { field: 'Id', hidden: true },
                                    { field: "Project.Name", title: "Project", width: '125px' },
                                    {
                                        field: "TargetUrl",
                                        title: "Target Url",
                                        template: function (dataItem) {
                                            return "<a href=\"" + dataItem.TargetUrl + "\"target=\"_blank\">" + dataItem.TargetUrl + "</a>";
                                        },
                                        width: "100px"
                                    },
                                    { field: "DateLastModified", width: "50px", template: '#= (data.DateLastModified) ? kendo.toString(kendo.parseDate(DateLastModified), "MM/dd/yyyy" ) : " " #' },
                                    { field: "LastModifiedBy", width: "50px" },
                                    { field: "LinkBuildingMode.Name", title: "Mode", width: "100px" },
                                {
                                    command: {
                                        text: "Delete", click: deleteLink
                                    },
                                    title: " ",
                                    width: '85px'
                                }
                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                },
                selectable: 'single',
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedLink = grid.dataItem($(this));
                        bindLinkData(selectedLink);
                    });
                }
            });

            function deleteLink() {
                if (model.getIsUserAdmin()) {
                    if (confirm('Are you sure you want to delete the target ' + selectedLink.TargetUrl + '?')) {
                        model.deleteLink(selectedLink.Id);
                    }
                } else {
                    alert('You do not have permission to delete links.');
                }
                model.topics.linkDeleted.add(model.fetchScheduledLinks());
            }

            $('#grd-scheduled').dblclick(function () {
                var grid = $('#grd-scheduled').data('kendoGrid');
                openTarget(grid.dataItem(grid.select()).Id);
            });

            $('#open-scheduled').click(function () {
                $('#grd-scheduled').removeClass('hidden-grid');
            });
        }
    }

    function links() {
        linksChart();
        linksGrid();

        $('#exportLinks').click(function () {
            $('body').addClass('working');
            model.fetchAcquiredLinks($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

            model.topics.acquiredLinksRetrieved.add(function () {
                $('body').removeClass('working');
                var data = model.getAcquiredLinks();
                var csv = csvInit('Link');
                $.each(data, function (i) {
                    var notes = data[i].Notes;
                    var article;
                    if (data[i].Article) {
                        article = data[i].Article.Title;
                    }
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].TargetUrl + ","
                        + data[i].RootUrl + ","
                        + data[i].RootMethod + ","
                        + data[i].LinkStrategy.Name + ","
                        + article + ","
                        + data[i].AnchorText + ","
                        + data[i].DomainAuthority + ","
                        + data[i].PageRelevance + ","
                        + data[i].SiteRelevance + ","
                        + data[i].LinkLocation.Name + ","
                        + data[i].PublishedUrl + ","
                        + data[i].LandingPage + ","
                        + data[i].LinkStatus.Name + ","
                        + data[i].DateFound + ","
                        + data[i].DatePublished + ","
                        + data[i].FoundBy + ","
                        + data[i].LastModifiedBy + ","
                        + data[i].DateLastModified + ","
                        + data[i].AcquiredBy + ","
                        + data[i].LinkBuildingMode.Name + ","
                        + data[i].ContactEmail + ","
                        + data[i].ContactPhone + ","
                        + data[i].ContactUrl + ","
                        + notes + ","
                        + data[i].LinkType.Name + "\n"
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "Links.csv");
                link.click();
            });
        });

        function linksChart() {
            $("#chrt-links").kendoChart({
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "column"
                },
                chartArea: {
                    background: ""
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                },
                dataSource: {
                    group: { field: "Name" }
                },
                seriesColors: getColorArray(),
                series: [{ name: "#= group.value #", field: "Aggregate" }]
            });

            model.topics.reportRetrieved.add(function () {
                $('#chrt-links').data('kendoChart').dataSource.data(model.getAggregateAcquiredLinks());
            });
        }

        function linksGrid() {
            var selectedLink;

            $("#grd-links").kendoGrid({
                columnMenu: true,
                columns: [
                    { field: 'Id', hidden: true },
                    { field: "Project.Name", title: "Project", width: '125px' },
                    {
                        field: "PublishedUrl",
                        title: "Published Url",
                        template: function (dataItem) {
                            return "<a href=\"" + dataItem.PublishedUrl + "\"target=\"_blank\">" + dataItem.PublishedUrl + "</a>";
                        },
                        width: "100px"
                    },
                    { field: "DatePublished", title: 'Date Published', width: "50px", template: '#= (data.DatePublished) ? kendo.toString(kendo.parseDate(DatePublished), "MM/dd/yyyy" ) : " " #' },
                    { field: "LastModifiedBy", width: "50px" },
                    { field: "LinkBuildingMode.Name", title: "Mode", width: "100px" },
                {
                    command: {
                        text: "Delete", click: deleteLink
                    },
                    title: " ",
                    width: '85px'
                }
                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                },
                selectable: 'single',
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedLink = grid.dataItem($(this));
                        bindLinkData(selectedLink);
                    });
                }
            });

            function deleteLink() {
                if (model.getIsUserAdmin()) {
                    if (confirm('Are you sure you want to delete the target ' + selectedLink.TargetUrl + '?')) {
                        model.deleteLink(selectedLink.Id);
                    }
                } else {
                    alert('You do not have permission to delete links.');
                }
                model.topics.linkDeleted.add(model.fetchAcquiredLinks());
            }

            $('#grd-links').dblclick(function () {
                var grid = $('#grd-links').data('kendoGrid');
                openTarget(grid.dataItem(grid.select()).Id);
            });

            $('#open-links').click(function () {
                $('#grd-links').removeClass('hidden-grid');
            });
        }
    }

    function hours() {
        hoursWin();
        hoursChart();
        hoursGrid();

        $('#exportHours').click(function () {
            $('body').addClass('working');
            model.fetchHours($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

            model.topics.overviewHoursRetrieved.add(function () {
                $('body').removeClass('working');
                var data = model.getOverviewHours();
                var csv = csvInit('Hours');
                $.each(data, function (i) {
                    var notes = data[i].Note;
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].UserId + ','
                        + data[i].Project.Name + ','
                        + data[i].StartTime + ','
                        + data[i].EndTime + ','
                        + data[i].Elapsed + ','
                        + data[i].Activity + ','
                        + notes + ','
                        + data[i].IsTimeOff + '\n';
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "ProjectHours.csv");
                link.click();
            });
        });


        function hoursWin() {
            var win = $("#win-hours").kendoWindow({
                //height: "600px",
                title: "Hours",
                visible: false,
                width: "800px"
            });

            $("#open-hours").click(function () {
                $('body').addClass('working');
                model.fetchHours($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

                model.topics.overviewHoursRetrieved.add(function () {
                    $('#grd-hours').data('kendoGrid').dataSource.data(model.getOverviewHours());
                    var win = $("#win-hours").data("kendoWindow");
                    win.center();
                    win.open();
                    $('body').removeClass('working');
                });
            });

            $("#close-hours").click(function () {
                $("#win-hours").data("kendoWindow").close();
            });
        }

        function hoursChart() {
            $('#hours-projects').click(function () {
                $('.project-activity-mode').removeClass('mode-active mode-inactive');
                $('#hours-projects').addClass('mode-active');
                $('#hours-activities').addClass('mode-inactive');
                $('#chrt-hours-project').removeClass('hidden');
                $('#chrt-hours-activity').addClass('hidden');
            });
            $('#hours-activities').click(function () {
                $('.project-activity-mode').removeClass('mode-active mode-inactive');
                $('#hours-activities').addClass('mode-active');
                $('#hours-projects').addClass('mode-inactive');
                $('#chrt-hours-project').addClass('hidden');
                $('#chrt-hours-activity').removeClass('hidden');
            });

            $("#chrt-hours-project").kendoChart({
                seriesDefaults: {
                    type: 'column'
                },
                seriesColors: getColorArray(),
                dataSource: {
                    group: { field: "Name" }
                },
                legend: {
                    visible: false
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value / 100 #"
                },
                chartArea: {
                    background: ""
                },
                series: [{ name: "#= group.value #", field: "Aggregate" }]

            });

            model.topics.reportRetrieved.add(function () {
                buildAggregateByActivity();
                buildAggregateByProject();
            });

            var activitySettings = {
                seriesColors: getColorArray(),
                series: [{
                    type: 'pie',
                    data: []
                }],
                legend: {
                    visible: false
                },
                tooltip: {
                    visible: true,
                    template: "#= data.category #: #= data.value #"
                },
                chartArea: {
                    background: ""
                }
            }

            var seriesData = [];

            function buildAggregateByProject() {
                $('#chrt-hours-project').data('kendoChart').dataSource.data(model.getAggregateHoursByProject());
            }

            function buildAggregateByActivity() {
                var aggregate = [];
                var data = model.getAggregateHoursByActivity();
                $.each(data, function (i, a) {
                    aggregate.push({ category: a.Name, value: a.Aggregate / 100 })
                });
                

                seriesData = aggregate;
                activitySettings.series[0].data = seriesData;
                $('#chrt-hours-activity').kendoChart(activitySettings);
            };

        }

        function hoursGrid() {
            $("#grd-hours").kendoGrid({
                columnMenu: true,
                columns: [
                    { field: 'Id', hidden: true },
                    { field: "Project.Name", title: "Project", width: '125px' },
                    { field: "StartTime", title: "Date", template: '#= kendo.toString(kendo.parseDate(StartTime), "MM/dd/yyyy" ) #' },
                    { field: "Elapsed", title: "Elapsed" },
                    { field: "Activity", title: "Activity" },
                    { field: "UserId", title: "Employee" }
                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                }

            });
        }
    }

    function outreachVsInCommunication() {
        outreachVsInCommunicationChart();
        outreachVsInCommunicationGrid();
        outreachWindow();

        $('#exportOutreachVsInCommunication').click(function () {
            $('body').addClass('working');
            model.fetchOutreach($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

            model.topics.overviewOutreachRetrieved.add(function () {
                $('body').removeClass('working');
                var data = model.getOverviewOutreach();
                var csv = csvInit('Outreach');
                $.each(data, function (i) {
                    var notes = data[i].OutreachNotes;
                    if (notes) {
                        notes = notes.split(',');
                        notes = notes.join('');
                        notes = notes.split('\r\n');
                        notes = notes.join('');
                        notes = notes.split('\r');
                        notes = notes.join('');
                        notes = notes.split('\n');
                        notes = notes.join('');
                    }
                    csv += data[i].Link.TargetUrl + ','
                        + data[i].OutreachAction.Name + ','
                        + data[i].OutreachType.Name + ','
                        + notes + ','
                        + data[i].AddedBy + ','
                        + data[i].DateOutreached + "\n";
                });
                var encodedUri = encodeURI(csv);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "OutreachVsInCommunication.csv");
                link.click();
            });
        });

        function outreachWindow() {
            var win = $("#win-outreach-details").kendoWindow({
                title: "Outreach Details",
                visible: false,
                width: "1000px"
            }).data("kendoWindow");

            $(".open-outreach-details").click(function () {
                $('body').addClass('working');
                model.fetchOutreach($('#select-project').val(), $('#select-start-date').val(), $('#select-end-date').val());

                model.topics.overviewOutreachRetrieved.add(function () {
                    $('#grd-outreach-vs-in-communication').data('kendoGrid').dataSource.data(model.getOverviewOutreach());
                    var win = $("#win-outreach-details").data("kendoWindow");
                    win.center();
                    win.open();
                    $('body').removeClass('working');
                });
            });
        }

        function outreachVsInCommunicationChart() {
            var chartSettings = {
                legend: {
                    position: "bottom"
                },
                seriesColors: getColorArray(),
                seriesDefaults: {
                    type: "area",
                    area: {
                        line: {
                            style: "smooth"
                        }
                    }
                },
                categoryAxis: {
                    categories: []
                },
                tooltip: {
                    visible: true,
                    format: "{0}%",
                    template: "#= series.name #: #= value #"
                }
            };

            model.topics.reportRetrieved.add(function () {
                var weeks = model.getWeekLabels();
                var weekLabels = [];
                $.each(weeks, function (i, week) {
                    var weekString = week.split("-");
                    weekLabels.push(weekString[1] + '/' + weekString[2].split("T")[0]);
                });

                var outreachData = model.getAggregateOutreachByDate();
                var inCommunicationData = model.getAggregateInCommunicationByDate();

                if (outreachData.length > weeks.length) {
                    outreachData.splice(0, 1);
                }
                if (inCommunicationData.length > weeks.length) {
                    inCommunicationData.splice(0, 1);
                }
                var data = [{ name: "Outreach", data: outreachData }, { name: "In Communication", data: inCommunicationData }];

                

                chartSettings.series = data;
                chartSettings.categoryAxis.categories = weekLabels;

                $('#chrt-outreach-vs-in-communication').kendoChart(chartSettings);
            });
        }

        function outreachVsInCommunicationGrid() {
            $("#grd-outreach-vs-in-communication").kendoGrid({
                columnMenu: true,
                columns: [
                    { field: 'Id', hidden: true },
                    { field: "Link.Project.Name", title: "Project", template: "#= (Link.Project) ? Link.Project.Name : 'None' #", width: '125px' },
                    {
                        field: "Link.TargetURL",
                        title: "Target URL",
                        template: function (dataItem) {
                            return "<a href=\"" + dataItem.Link.TargetUrl + "\"target=\"_blank\">" + dataItem.Link.TargetUrl + "</a>";
                        }
                    },
                    { field: "DateOutreached", title: 'Date Outreached', template: '#= (data.DateOutreached) ? kendo.toString(kendo.parseDate(DateOutreached), "MM/dd/yyyy" ) : " " #' },
                    { field: "OutreachAction.Id", title: 'Outreach Action', template: "#= (OutreachAction) ? OutreachAction.Name : 'None' #" },
                    { field: "OutreachType.Id", title: 'Outreach Type', template: "#= (OutreachType) ? OutreachType.Name : 'None' #" },
                    { field: "AddedBy", title: "Added By" }
                ],
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSize: 15,
                },
                selectable: 'single'
            });

            $('#grd-outreach-vs-in-communication').dblclick(function () {
                var grid = $('#grd-outreach-vs-in-communication').data('kendoGrid');
                openTarget(grid.dataItem(grid.select()).Link.Id);
            });

        }
    }

    function articlesGrid() {
        $('#exportArticles').click(function () {
            var data = model.getOverviewArticles();
            var csv = csvInit('Article');
            $.each(data, function (i) {
                var title;
                if (data[i].Title) {
                    title = data[i].Title;
                }
                if (title) {
                    title = title.split(',');
                    title = title.join('');
                    title = title.split('\r\n');
                    title = title.join('');
                    title = title.split('\r');
                    title = title.join('');
                    title = title.split('\n');
                    title = title.join('');
                }
                csv += data[i].Project.Name + ','
                    + title + ','
                    + data[i].CreatedDate + ','
                    + data[i].CreatedBy + ','
                    + data[i].ArticleStatus.Name + "\n"
            });
            var encodedUri = encodeURI(csv);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "Article.csv");
            link.click();
        });

        $("#grd-article").kendoGrid({
            columnMenu: true,
            columns: [
                { field: 'Id', hidden: true },
                { field: "Project.Name", title: "Project" },
                { field: "Title", title: "Title" },
                { field: "CreatedDate", title: "Written", template: '#= kendo.toString(kendo.parseDate(CreatedDate), "MM/dd/yyyy") #', width: "80px" },
                { field: "CreatedBy", title: "Written By", width: "100px" },
                { field: "ArticleStatus.Id", title: "Status", template: '#= ArticleStatus.Name #' },
            ],
            sortable: true,
            filterable: true,
            pageable: {
                refresh: true,
                pageSize: 10,
            },
            selectable: 'single'
        });

        $('#grd-article').dblclick(function () {
            var grid = $('#grd-article').data('kendoGrid');
            openArticle(grid.dataItem(grid.select()).Id);
        });

        model.topics.reportRetrieved.add(function () {
            $('#grd-article').data('kendoGrid').dataSource.data(model.getOverviewArticles());
        });
    }

    function changelogWindow() {
        var win = $("#window").kendoWindow({
            height: "625px",
            title: "Release Notes",
            visible: false,
            width: "500px"
        }).data("kendoWindow");

        $("#open-button").click(function () {
            var win = $("#window").data("kendoWindow");
            win.center();
            win.open();
        });

        $("#release-notes").load("../releasenotes.txt");

        $("#close-button").click(function () {
            $("#window").data("kendoWindow").close();
        });
    }

    function openTarget(linkId) {
        var param = $.param({ linkId: linkId });
        window.open('http://' + window.location.host + '/Production/linkbuilding?' + param);
    }

    function openArticle(articleId) {
        var param = $.param({ articleId: articleId });
        window.open('http://' + window.location.host + '/Production/Article?' + param);
    }

    function bindLinkData(link) {
        $('#link-project').val(link.ProjectId);
        $('#link-target-url').val(link.TargetUrl);
        $('#link-root-url').val(link.RootUrl);
        if (link.LinkStrategy.Id != 1) {
            $('#link-strategy').val(link.LinkStrategy.Name);
        }
        $('#link-root-method').val(link.RootMethod);
        $('#link-contact-email').val(link.ContactEmail);
        $('#link-contact-url').val(link.ContactUrl);
        $('#link-contact-phone').val(link.ContactPhone);
        $('#link-found-by').val(link.FoundBy);
        $('#link-date-found').val(kendo.toString(kendo.parseDate(link.DateFound), "MM/dd/yyyy"));
        $('#link-domain-authority').val(link.DomainAuthority);
        $('#link-site-relevance').val(link.SiteRelevance);
        $('#link-page-relevance').val(link.PageRelevance);
        $('#link-status').val(link.LinkStatus.Name);
        $('#link-anchor-text').val(link.AnchorText);
        $('#link-acquired-by').val(link.AcquiredBy);
        $('#link-landing-page').val(link.LandingPage);
        $('#link-published-url').val(link.PublishedUrl);
        if (link.LinkType.Id != 1) {
            $('#link-type').val(link.LinkType.Name);
        }
        if (link.LinkLocation.Id != 1) {
            $('#link-location').val(link.LinkLocation.Name);
        }
        $('#link-date-published').val(kendo.toString(kendo.parseDate(link.DatePublished), "MM/dd/yyyy"));
        $('#link-notes').val(link.Notes);
        $('#link-article').val(link.Article.Title);
    }

    function clearLinkData() {
        $('#link-details input').val(null);
        $('#link-notes').val(null);
    }

    function csvInit(type) {
        var csv = "data:text/csv;charset=utf-8,";
        if (type === 'Link') {
            csv += "Target Url,Root Url,Root Method,Link Strategy,Article Title,Anchor Text,Domain Authority,Page Relevance,Site Relevance,Location,Published Url,Landing Page,Status,Date Found,Date  Published,Found By,Last Modified By,Date Last Modified,Acquired By,Mode,Contact Email,Contact Phone,Contact Url,Notes,Link Type\n";
        }
        if (type === 'Hours') {
            csv += "Username,Project,Start Time,End Time,Elapsed,Activity,Note,Is Time Off\n";
        }
        if (type === 'Outreach') {
            csv += "Target Url,Action,Type,Notes,Added By,Date Outreached\n";
        }
        if (type === 'Article') {
            csv += "Project,Title,Written Date,Written By,Status\n";
        }
        return csv;
    }

    function init() {
        p1p.staticdata.initializeStaticData(initUi);

    }

    $(init);

}());