/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="../lib/localsettings.js" />
/// <reference path="useradministrationrmodel.js" />
(function () {
    var model;

    function initUi() {
        model = p1p.useradministration.getModel();

        userAdmin();
        teamAdmin();

        model.initializeData();
    }

    function userAdmin() {
        newUserWindow();

        model.topics.employeesUpdated.add(refresh);

        //Users Grid
        $('#grdUsers').kendoGrid({
            scrollable: true,
            sortable: true,
            filterable: true,
            pageable: {
                refresh: true,
                pageSizes: true
            },
            columns: [
                { field: "Id", title: "Id", hidden: true },
                { field: "Username", title: "UserName" },
                { field: "FirstName", title: "First Name" },
                { field: "LastName", title: "Last Name" },
                { field: "Email", title: "Email" },
                { field: "Team", title: "Team", editor: teamEdit, template: "#=Team ? Team.Name : 'Select Team'#" },
                { command: { text: "Save", click: saveEmployee }, width: '85px' },
                { command: { text: "Delete", click: deleteEmployee }, width: '85px' }
            ],
            editable: true,
            toolbar: [{ name: "create-user", text: "New Employee" }]
        });

        $('.k-grid-create-user').click(function () {
            $('#win-new-user').data('kendoWindow').open();
            $('#win-new-user').data('kendoWindow').toFront();
        });

        function newUserWindow() {

            $('#win-new-user').kendoWindow({
                title: "New Employee",
                visible: false,
                width: '1000px',
            });

            $('#win-new-user').data('kendoWindow').center();
            $('#win-new-user').closest('.k-window').css({
                position: 'fixed',
                margin: 'auto',
                top: '10%'
            });

            $('#select-new-team').kendoComboBox({
                placeholder: 'Select Team',
                dataTextField: 'Name',
                dataValueField: 'Id'
            });


            model.topics.teamsUpdated.add(function () {
                $('#select-new-team').data('kendoComboBox').dataSource.data(model.getAllTeams());
            });

            $('#btn-save-employee').click(function () {
                var employee = {
                    Username: $('#new-username').val(),
                    FirstName: $('#new-first-name').val(),
                    LastName: $('#new-last-name').val(),
                    Email: $('#new-email').val(),
                    RoleName: 'Employee',
                    Team: { Id: $('#select-new-team').val() }
                }

                model.saveEmployee(employee);
                clearNewEmployee();
                $('#win-new-user').data('kendoWindow').close();
            });

            function clearNewEmployee() {
                $('#new-username').val('');
                $('#new-first-name').val('');
                $('#new-last-name').val('');
                $('#new-email').val('');
                $('#select-new-team').data('kendoComboBox').value(null);
            }
        }

        function teamEdit(container, options) {
            $('<input required data-text-field="Name" data-value-field="Id" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    optionLabel: {
                        Name: "Select Team",
                        Id: ""
                    },
                    dataTextField: "Name",
                    dataValueField: "Id",
                    dataSource: model.getAllTeams()
                });
        }

        function refresh() {
            $('#grdUsers').data('kendoGrid').dataSource.data(model.getAllEmployees());
            $('#grdUsers').data('kendoGrid').dataSource.pageSize(15);
        }

        function saveEmployee(e) {
            var grid = $('#grdUsers').data('kendoGrid');
            var employee = grid.dataItem($(e.target).closest('tr')).toJSON();

            model.saveEmployee(employee);
        }

        function deleteEmployee(e) {
            var grid = $('#grdUsers').data('kendoGrid');
            var employee = grid.dataItem($(e.target).closest('tr')).toJSON();

            model.deleteEmployee(employee);
        }
    }

    function teamAdmin() {

        model.topics.teamsUpdated.add(refresh);

        $('#grdTeams').kendoGrid({
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
                { command: { text: "Save", click: saveTeam }, width: '85px' },
                { command: { text: "Delete", click: deleteTeam }, width: '85px' }
            ],
            editable: true,
            toolbar: ["create"],
        });

        function refresh() {
            $('#grdTeams').data('kendoGrid').dataSource.data(model.getAllTeams());
            $('#grdTeams').data('kendoGrid').dataSource.pageSize(10);
        }

        function saveTeam(e) {
            var grid = $('#grdTeams').data('kendoGrid');
            var kTeam = grid.dataItem($(e.target).closest('tr'));
            var team = { Id: kTeam.Id, Name: kTeam.Name, InsertDate: kTeam.InsertDate };
            model.saveTeam(team);
        }

        function deleteTeam(e) {
            var grid = $('#grdTeams').data('kendoGrid');
            var kTeam = grid.dataItem($(e.target).closest('tr'));
            var team = { Id: kTeam.Id, Name: kTeam.Name, InsertDate: kTeam.InsertDate };            

            model.deleteTeam(team);
        }
    }

    
    
    $(initUi);
})();