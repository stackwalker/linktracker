/// <reference path="../lib/p1p.js" />
(function () {
    p1p.namespace('useradministration');

    var allEmployees;
    var allTeams;
    var allRoles;    

    var model = {
        topics: {
            teamsUpdated: $.Callbacks(),
            employeesUpdated: $.Callbacks(),
            rolesUpdated: $.Callbacks()
        },

        initializeData: function(){
            fetchAllEmployees();
            fetchAllTeams();
            fetchAllRoles();
        },

        getAllEmployees: function () {
            return allEmployees;
        },

        getAllTeams: function () {
            return allTeams;
        },

        getAllRoles: function () {
            return allRoles;
        },
        saveEmployee: function(employee){
            var url = employee.Id ? '/api/employee/Update' : '/api/employee/add';

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                async: true,
                data: employee,
                success: function () {
                    fetchAllEmployees();
                }
            });
        },
        deleteEmployee: function(employee){
            $.ajax({
                url: '/api/Employee/Delete',
                type: 'POST',
                dataType: 'json',
                async: true,
                data: employee,
                success: function () {
                    fetchAllEmployees();
                }
            });
        },
        saveTeam: function (team) {
            var url = team.Id ? '/api/Team/Update' : '/api/Team/Add';

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                async: true,
                data: team,
                success: function () {
                    fetchAllTeams();
                }
            });
        },
        deleteTeam: function (team) {
            var param = $.param({ teamId: team.Id });
            $.getJSON('/api/Team/Delete?' + param, function () {
                fetchAllTeams();                
            });
        },
    };

    function fetchAllEmployees() {
        $.ajax({
            url: '/api/Employee/GetAllEmployeesDetail',
            dataType: 'json',
            async: true,
            success: function (data) {
                allEmployees = data;
                model.topics.employeesUpdated.fire();
            }
        });
    }

    function fetchAllTeams() {
        $.ajax({
            url: '/api/Team/GetAll',
            dataType: 'json',
            async: true,
            success: function (data) {
                allTeams = data;
                model.topics.teamsUpdated.fire();
            }
        });
    }

    function fetchAllRoles() {
        $.ajax({
            url: '/api/Role/GetAll',
            dataType: 'json',
            async: true,
            success: function (data) {
                allRoles = data;
                model.topics.rolesUpdated.fire();
            }
        });
    }

    p1p.useradministration.getModel = function () { return model; };
})();