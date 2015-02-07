/// <reference path="../lib/p1p.js" />
/// <reference path="client-index-model.js" />
/// <reference path="../lib/kendo/js/kendo.all.min.js" />
(function () {

    //$('[data-toggle="popover"]').popover();
    var model = p1p.client.getModel();

    function initUi() {

        $(".well-expand").on("click", function () {
            $(this).parent(".well").find(".well-expand-content").slideToggle("slow");
            $(this).parent(".well").find(".icon-plus").toggleClass("icon-minus");
        });

        $('#links-chart .well-expand').click();

        model.topics.serverProcessing.add(function () {
            $('body').addClass('working');
        });

        model.topics.periodDataRetrieved.add(function () {
            $('body').removeClass('working');
        });

        model.checkIsUserClient();
        model.topics.isUserClientChecked.add(function () {
            model.fetchProjects();
            if (model.getIsUserClient()) {
                model.fetchCustomerForUser()
            }
        });

        $('#select-start-date, #select-end-date').change(function () {
            model.fetchPeriodData($('#select-start-date').val(), $('#select-end-date').val());
        });

        //model.topics.projectSelected.add(function () {
        //    model.fetchCycleStart($('#selectProject').data('kendoComboBox').value());

        //    model.topics.cycleStartRetrieved.add(function () {
        //        $('#select-start-date').val(kendo.toString(kendo.parseDate(model.getCycleStart()), "MM/dd/yyyy"));
        //        model.fetchPeriodData($('#select-start-date').val(), $('#select-end-date').val());
        //    });
            
        //});

        dashboard();
        projectSelect();
        timeSpanSelect();
        hoursView();
        outreachView();
        linkView();
    }

    function dashboard() {

        model.topics.customerRetrieved.add(function () {
            var customer = model.getCurrentCustomer();
            if (customer) {
                $('#userName').html(customer.BusinessName);
            }
        });

        model.topics.periodDataRetrieved.add(function () {            
            var project = model.getSelectedProject();
            $('#projectName').html('<strong>Project: </strong>' + project.Name);
        });
    }

    function projectSelect() {
        $('#selectProject').kendoComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            select: function (e) {
                model.selectProject(this.dataItem(e.item.index()).Id);
            }
        });

        model.topics.projectsRetrieved.add(refresh);

        function refresh() {
            $('#selectProject').data('kendoComboBox').dataSource.data(model.getAvailableProjects());
            var availableProjects = model.getAvailableProjects();
            $('#selectProject').data('kendoComboBox').value(availableProjects[0].Id);
            model.selectProject($('#selectProject').val());            
        }

        model.topics.projectSelected.add(function () {
            model.fetchCycleStart($('#selectProject').data('kendoComboBox').value());          

        });

        model.topics.cycleStartRetrieved.add(function () {
            $('#select-start-date').val(kendo.toString(kendo.parseDate(model.getCycleStart()), "MM/dd/yyyy"));
            model.fetchPeriodData($('#select-start-date').val(), $('#select-end-date').val());
        });
    }

    function timeSpanSelect() {

        $('#select-start-date').kendoDatePicker();

        $('#select-end-date').kendoDatePicker({
            value: new Date()
        });
    }

    function hoursView() {        

        hoursStats();
        hoursChart();
        hoursGrid();

        function hoursStats() {
            model.topics.periodDataRetrieved.add(refresh);

            function refresh() {
                $('#totalHours').html(Math.round(model.getTotalHours() * 100) / 100);
                $('#hoursPerLink').html(Math.round(model.getHoursPerLink() * 100) / 100);
            }
        }

        function hoursChart() {
            model.topics.periodDataRetrieved.add(refresh);

            $("#chartHours").kendoChart({
                legend: {
                    visible: false
                },
                chartArea: {
                    background: ""
                },
                dataSource:{
                    group: { field: "Unit" }
                },
                seriesDefaults: {
                    type: "column"
                },
                seriesColors: getColorArray(),
                series: [{
                    field: "Value",
                    name: "#: group.value #"
                }],
                valueAxis: {
                    line: {
                        visible: false
                    },
                    axisCrossingValue: 0
                },
                categoryAxis: {
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        visible: false
                    },
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                }
            });
            function refresh() {
                $('#chartHours').data('kendoChart').dataSource.data(model.getAggregateHours());
            }
        }

        function hoursGrid() {
            model.topics.periodDataRetrieved.add(refresh);

            $('#hoursGrid').kendoGrid({
                scrollable: false,
                sortable: true,
                filterable: false,
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                dataSource:{
                    pageSize: 10
                },
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    { field: "Activity", title: "Activity"},
                    { field: "StartTime", title: "Date", width: "80px", template: '#= kendo.toString(kendo.parseDate(StartTime), "MM/dd/yyyy" ) #' },
                    { field: "Elapsed", title: "Elapsed", widht: "80px" }
                ],
            });

            function refresh() {
                $('#hoursGrid').data('kendoGrid').dataSource.pageSize(10);
                $('#hoursGrid').data('kendoGrid').dataSource.data(model.getCurrentHours());
            }
        }
    }

    function outreachView() {

        outreachStats();
        outreachChart();
        outreachGrid();

        function outreachStats() {
            model.topics.periodDataRetrieved.add(refresh);

            function refresh() {
                $('#totalOutreach').html(model.getTotalOutreach());
                $('#inCommunication').html(model.getLinksInCommunication());
                $('#sites-targeted').html(model.getSitesTargeted());
                $('#scheduled').html(model.getScheduled);
            }
        }

        function outreachChart() {

            model.topics.periodDataRetrieved.add(refresh);

            $("#chartOutreach").kendoChart({
                legend: {
                    visible: false
                },
                chartArea: {
                    background: ""
                },
                dataSource:{
                    group: { field: "Unit" }
                },
                seriesDefaults: {
                    type: "column"
                },
                seriesColors: getColorArray(),
                series: [{
                    field: "Value",
                    name: "#: group.value #"
                }],
                valueAxis: {
                    line: {
                        visible: false
                    },
                    axisCrossingValue: 0
                },
                categoryAxis: {
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        visible: false
                    },
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                }
            });
            function refresh() {
                $('#chartOutreach').data('kendoChart').dataSource.data(model.getAggregateOutreach());
            }
        }

        function outreachGrid() {
            model.topics.periodDataRetrieved.add(refresh);

            $('#outreachGrid').kendoGrid({
                scrollable: true,
                sortable: true,
                filterable: false,
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                dataSource: {
                    pageSize: 10
                },
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    {
                        field: "Link.TargetUrl",
                        title: "Target Url",
                        template: function (dataItem) {
                            if (dataItem.Link.TargetUrl) {
                                return "<a href=\"" + dataItem.Link.TargetUrl + "\"target=\"_blank\">" + dataItem.Link.TargetUrl + "</a>";
                            } else {
                                return " ";
                            }
                        }
                    },
                    { field: "Link.LinkStatus.Name", title: "Status" },
                    { field: "OutreachAction.Name", title: "Action" },
                    { field: "DateOutreached", title: "Date", template: '#= kendo.toString(kendo.parseDate(DateOutreached), "MM/dd/yyyy" ) #' },
                    { field: "OutreachType.Name", title: "Type" }
                ],
            });

            function refresh() {
                $('#outreachGrid').data('kendoGrid').dataSource.pageSize(10);
                $('#outreachGrid').data('kendoGrid').dataSource.data(model.getCurrentOutreach());
            }
        }
    }

    function linkView() {

        linkStats();
        linksGrid();
        linkTypeChart();
        anchorTextChart();

        function linkStats() {
            model.topics.periodDataRetrieved.add(refresh);
            
            function refresh() {
                $('#totalLinks').html(model.getTotalLinks());
                $('#averageDA').html(Math.round(model.getAverageDomainAuthority() * 100) / 100);
                $('#uniqueDomains').html(model.getUniqueDomainCount());
            }
        }
        function linkTypeChart() {
            model.topics.periodDataRetrieved.add(refresh);

            $("#linksChart1").kendoChart({
                legend: {
                    position: "left",
                },
                seriesColors: getColorArray(),
                series: [{
                    type: "pie",
                    field: "Value",
                    categoryField: "Unit"
                }],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            });

            function refresh() {
                $('#linksChart1').data('kendoChart').dataSource.data(model.getAggregateLinksByType());
            }
        }

        function anchorTextChart() {
            model.topics.periodDataRetrieved.add(refresh);

            $("#linksChart2").kendoChart({
                legend: {
                    position: "left",
                },
                seriesColors: getColorArray(),
                series: [{
                    type: "pie",
                    field: "Value",
                    categoryField: "Unit"
                }],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                },                
            });

            function refresh() {
                $('#linksChart2').data('kendoChart').dataSource.data(model.getAggregateAnchorTextTrunc());
            }
        }

        function linksGrid() {
            model.topics.periodDataRetrieved.add(refresh);

            $('#linksGrid').kendoGrid({
                scrollable: true,
                sortable: true,
                filterable: false,
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                dataSource: {
                    pageSize: 10
                },
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    {
                        field: "PublishedUrl",
                        title: "URL",
                        template: function (dataItem) {
                            return "<a href=\"" + dataItem.PublishedUrl + "\"target=\"_blank\">" + dataItem.PublishedUrl + "</a>";
                        }
                    },
                    { field: "AnchorText", title: "Anchor Text" },
                    { field: "DatePublished", title: "Date Published", width: "125px", template: '#= (data.DatePublished) ? kendo.toString(kendo.parseDate(DatePublished), "MM/dd/yyyy" ) : " " #' },
                    { field: "DomainAuthority", title: "DA", width: "45px" },
                    { field: "LinkType.Name", title: "Link Type" }
                ],
            });

            function refresh() {
                $('#hoursGrid').data('kendoGrid').dataSource.pageSize(10);
                $('#linksGrid').data('kendoGrid').dataSource.data(model.getActiveLinks());
            }
        }
    }

    function init() {
        p1p.staticdata.initializeStaticData(initUi);
    }

    $(init);
})();