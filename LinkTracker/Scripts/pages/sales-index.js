/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="../lib/kendo/js/kendo.all.js" />
/// <reference path="salesindexmodel.js" />

(function () {
    var model;
    var page = {};

    function initUi() {
        model = p1p.sales.getModel();

        $("#panelProducts").kendoPanelBar();
        keywordResearchWindow();
        landingPageWindow();
        customerInfo();
        customerSearchWindow();

        $('#btnOrder').click(function () {
            var order = {};
            order.hasKeywordResearch = $('#chkKeywordResearch').is(':checked');
            order.keywordSet = page.keywordResearchWindow.getData();
            order.hasLandingPageAudit = $('#chkLandingPageAudit').is(':checked');
            order.landingPageSet = page.landingPageWindow.getData();
            order.hasSiteArchitecturePlan = $('#chkSitePlan').is(':checked');
            order.hasSiteWideAspects = $('#chkSiteAspects').is(':checked');
            order.hasBacklinkPortfolio = $('#chkBacklinkPortfolio').is(':checked');
            order.customer = page.customerInfo.getData();
            model.placeOrder(order);
        });
    }

    function customerInfo() {
        model.topics.customerSelected.add(refresh);

        var vm = kendo.observable({
            FirstName: '',
            LastName: '',
            Name: '',
            Address: '',
            City: '',
            State: '',
            Zip: '',
            Email: ''
        });

        kendo.bind($('#customercontainer', vm));

        function refresh() {
            vm = kendo.observable(model.getSelectedCustomer());
            kendo.bind($('#customercontainer'), vm);
        }

        page.customerInfo = {};
        page.customerInfo.getData = function () {
            return vm.toJSON();
        }
    }

    function keywordResearchWindow() {
        page.keywordResearchWindow = {};

        $('#btnConfigureKeywords').click(function () {
            page.keywordResearchWindow.show();
        });

        $('#keywordResearchWindow').kendoWindow({
            title: 'Enter Keyword Concepts',
            modal: true,            
        });

        $('#btnKeywordsOk').click(function () {
            page.keywordResearchWindow.hide();
        });

        page.keywordResearchWindow.show = function () {
            $('#keywordResearchWindow').data('kendoWindow').open().center();
        };

        page.keywordResearchWindow.hide = function () {
            $('#keywordResearchWindow').data('kendoWindow').close();
        };

        page.keywordResearchWindow.getData = function () {
            return $('#grdKeywords').data('kendoGrid').dataSource.data().toJSON();
        };

        keywordsGrid();

        function keywordsGrid() {
            $('#grdKeywords').kendoGrid({
                editable: true,
                toolbar: ["create"],
                columns: [
                    { field: "KeywordConcept", title: "Keyword Concept" },
                    { field: "ConceptNotes", title: "Keyword Intent" },
                    { field: "CompetitorURL", title: "Competitor Site" },
                    { command: "destroy", title: "&nbsp;", width: 90 }
                ]
            });
        }
    }

    function landingPageWindow() {
        page.landingPageWindow = {};

        $('#btnConfigureLandingPages').click(function () {
            page.landingPageWindow.show();
        });

        $('#landingPageWindow').kendoWindow({
            title: "Enter Landing Pages",
            modal: true
        });

        $('#btnLandingPagesOk').click(function () {
            page.landingPageWindow.hide();
        });
        page.landingPageWindow.show = function () {
            $('#landingPageWindow').data('kendoWindow').open().center();
        };

        page.landingPageWindow.hide = function () {
            $('#landingPageWindow').data('kendoWindow').close();
        };

        page.landingPageWindow.getData = function () {
            return $('#grdLandingPages').data('kendoGrid').dataSource.data().toJSON();
        };

        $('#grdLandingPages').kendoGrid({
            editable: true,
            toolbar: ["create"],
            columns: [
                { field: "LandingPageUrl", title: "Landing Page"},
                { field: "LandingPageNotes", title: "Notes"},            
            ]
        });
    }

    function customerSearchWindow() {
        page.customerSearchWindow = {};

        customerSearchGrid();

        $('#btnCustomerSearch').click(function () {
            page.customerSearchWindow.show();
        });

        $('#customerSearchWindow').kendoWindow({
            title: "Search Existing Customers",
            modal: true
        });

        page.customerSearchWindow.show = function () {
            $('#customerSearchWindow').data('kendoWindow').open().center();
        };

        page.customerSearchWindow.hide = function () {
            $('#customerSearchWindow').data('kendoWindow').close();
        };

        function customerSearchGrid() {

            model.topics.customersRetrieved.add(refresh);

            $('#grdCustomers').kendoGrid({
                selectable: 'single',
                scrollable: false,
                sortable: true,
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                dataSource: {
                    pageSize: 10
                },
                columns: [
                    { field: "Name", title: "Business" },
                    { field: "FirstName", title: "First Name" },
                    { field: "LastName", title: "Last Name" },
                    { field: "Email", title: "Email" },
                    { field: "Address", title: "Address" },
                    { field: "City", title: "City" },
                    { field: "State", title: "State" }
                ]
            });

            $('#grdCustomers').on('dblclick', 'tr', function () {
                var grd = $('#grdCustomers').data('kendoGrid');
                var selected = grd.dataItem(grd.select());
                model.selectCustomer(selected);
                page.customerSearchWindow.hide();
            });

            function refresh() {
                $('#grdCustomers').data('kendoGrid').dataSource.data(model.getCustomerResults());
            }
        }

        $('#btnSearchCustomers').click(function () {
            model.searchCustomers($('#filterBusinessName').val(), $('#filterEmail').val(), $('#filterFirstName').val(), $('#filterLastName').val());
        });
    }

    $(initUi);
})();