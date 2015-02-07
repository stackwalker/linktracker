(function () {
    p1p.namespace('adminindex');

    var customers;
    var projects;
    var teams;
    var active = true;
    var selectedProject;

    var model = {
        topics: {
            customersUpdated: $.Callbacks(),
            projectsUpdated: $.Callbacks(),
            teamsUpdated: $.Callbacks(),
            categoryAddedToProject: $.Callbacks(),
            categoryRemovedFromProject: $.Callbacks()
        },
        initializeData: function () {
            fetchCustomers();
            fetchProjects();
            fetchTeams();
        },
        setSelectedProject: function (project) {
            selectedProject = project;
        },
        setActive: function (bool) {
            active = bool;
        },
        getSelectedProject: function () {
            return selectedProject;
        },
        getCustomers: function () {
            return customers;
        },
        saveCustomer: function (customer) {
            var url = customer.Id ? '/api/Customer/Update' : '/api/Customer/add';

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                async: true,
                data: customer,
                success: function () {
                    fetchCustomers();
                }
            });
        },
        deleteCustomer: function (customer) {
            var customerId = customer.Id;

            $.getJSON('/api/Customer/Delete?Id=' + customerId, function () {
                fetchCustomers();
            });
        },
        
        getProjects: function () {
            return projects;
        },
        saveProject: function (project) {
            project.IsActive = active;
            var url = project.Id ? '/api/Project/Update' : '/api/Project/Add';

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'application/json',
                data: project,
                success: function () {
                    fetchProjects();
                    selectedProject = null;
                }
            });
        },

        addCategoryToProject: function (categoryId) {
            var paramText = {
                projectId: selectedProject.Id, 
                categoryId:  categoryId
            }
            $.getJSON('/api/Project/addcategorytoproject?' + $.param(paramText), function (data) {
                selectedProject = data;
                model.topics.categoryAddedToProject.fire();
            });
        },

        removeCategoryFromProject: function (categories) {
            var categoryId;
            $.each(selectedProject.Categories, function (i, c) {
                var match = false;
                $.each(categories, function (i, cint) {
                    if (c.Id === cint) {
                        match = true;
                    }                    
                });
                if (!match) {
                    categoryId = c.Id;                    
                }
            });
            if (categoryId) {
                var paramText = {
                    projectId: selectedProject.Id,
                    categoryId: categoryId
                }
                $.getJSON('/api/Project/removecategoryfromproject?' + $.param(paramText), function (data) {
                    selectedProject = data;
                    model.topics.categoryRemovedFromProject.fire();
                });
            } else {
                model.topics.categoryRemovedFromProject.fire();
            }
        },

        deleteProject: function (projectId) {
            $.getJSON('/api/Project/Delete?projectId=' + projectId, function () {
                fetchProjects();
            });
        },
        
        getTeams: function () {
            return teams;
        }


    };

    function fetchCustomers() {
        $.ajax({
            url: '/api/Customer/GetAll',
            dataType: 'json',
            async: true,
            success: function (data) {
                customers = data;
                model.topics.customersUpdated.fire();
            }
        });
    }
    function fetchProjects() {
        $.ajax({
            url: '/api/Project/GetAll',
            dataType: 'json',
            async: true,
            success: function (data) {
                projects = data;
                model.topics.projectsUpdated.fire();
            }
        });
    }
    function fetchTeams() {
        $.ajax({
            url: '/api/Team/GetAll',
            dataType: 'json',
            async: true,
            success: function (data) {
                teams = data;
                model.topics.teamsUpdated.fire();
            }
        });
    }

    p1p.adminindex.getModel = function () { return model; };

})();