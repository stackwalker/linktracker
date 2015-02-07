/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="../lib/localsettings.js" />
/// <reference path="admin-customer-model.js" />
/// <reference path="../lib/kendo/js/kendo.all.min.js" />

(function () {
    var model;
    function initUi() {

        model = p1p.adminindex.getModel();

        $('#tabstrip').kendoTabStrip({
            animation: {
                open: {
                    effects: 'fadeIn'
                }
            }
        });

        $('#win-update-customer').kendoWindow({
            title: "Update Customer",
            visible: false,
            width: '1200px',
        });

        $('#win-update-project').kendoWindow({
            title: "Update Project",
            visible: false,
            width: '700px',
        });

        model.initializeData();
        
        customerInfo();
        projectInfo();
    }

    //Customer Tab

    function customerInfo() {
        newCustomerWindow();
        customerGrid();
        
        //Customer Grid

        function customerGrid() {

            model.topics.customersUpdated.add(refresh);

            $('#grdCustomers').kendoGrid({
                scrollable: true,
                sortable: true,
                filterable: true,
                resizable: true,
                pageable: {
                    refresh: true,
                    pageSize: 10,
                    pageSizes: false
                },
                toolbar: [{ name: "create-customer", text: "New Customer" }],
                dataSource: [
                    { BusinessName: "Page One Power" }
                ],
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    { field: "BusinessName", title: "Business Name" },
                    { field: "FirstName", title: "First Name" },
                    { field: "LastName", title: "Last Name" },
                    { field: "Username", title: "User Name" },
                    { field: "WebsiteURL", title: "Website URL" },
                    { field: "Email", title: "Email" },
                    { field: "Phone", title: "Phone" },
                    { field: "StreetAddress", title: "Street Address", hidden: true },
                    { field: "City", title: "City", hidden: true },
                    { field: "State", title: "State", hidden: true },
                    { field: "Zip", title: "Zip", hidden: true },
                    {
                        command:
                          {
                              text: "edit", click: updateCustomer
                          },
                        title: " ",
                        width: "85px"
                    },
                    {
                        command:
                          {
                              text: "Delete", click: deleteCustomer
                          },
                        title: " ",
                        width: "85px"
                    }
                ],
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedAccount = grid.dataItem($(this));
                    });
                }
            });

            $('.k-grid-create-customer').click(function () {
                $('#win-new-customer').data('kendoWindow').open();
                $('#win-new-customer').data('kendoWindow').toFront();
            });

            

            //Edit Button

            function updateCustomer(e) {
                $('#win-update-customer').data('kendoWindow').center();
                $('#win-update-customer').data('kendoWindow').open();
                $('#win-update-customer').data('kendoWindow').toFront();
                $('#win-update-customer').closest('.k-window').css({
                    position: 'fixed',
                    margin: 'auto',
                    top: '10%'
                });

                

                var grid = $('#grdCustomers').data('kendoGrid');
                var customer = grid.dataItem($(e.target).closest('tr')).toJSON();
                var vm = kendo.observable(customer);
                kendo.bind($('#tbl-update-customer'), vm);

                $('#btn-update-customer').click(function () {
                    model.saveCustomer(vm.toJSON());
                    $('#win-update-customer').data('kendoWindow').close();
                });            
            }

            //Delete Button

            function deleteCustomer(e) {
                var grid = $('#grdCustomers').data('kendoGrid');
                var customer = grid.dataItem($(e.target).closest('tr')).toJSON();
                model.deleteCustomer(customer);
            }

            function refresh() {
                $('#grdCustomers').data('kendoGrid').dataSource.data(model.getCustomers());
                $('#grdCustomers').data('kendoGrid').dataSource.pageSize(10);
            }
        }
        
        //New Customer Button

        function newCustomerWindow() {
            $('#win-new-customer').kendoWindow({
                title: "New Customer",
                visible: false,
                width: '1200px',
            });
                                                   
            $('#win-new-customer').data('kendoWindow').center();
            $('#win-new-customer').closest('.k-window').css({
                position: 'fixed',
                margin: 'auto',
                top: '10%'
            });
                        
            $('#btn-save-customer').click(function () {
                var customer = {
                    Username: $('#new-business-username').val(),
                    BusinessName: $('#new-business-name').val(),
                    FirstName: $('#new-first-name').val(),
                    LastName: $('#new-last-name').val(),
                    StreetAddress: $('#new-street-address').val(),
                    City: $('#new-city').val(),
                    State: $('#new-state').val(),
                    Zip: $('#new-zip').val(),
                    Email: $('#new-business-email').val(),
                    Phone: $('#new-phone').val(),
                    WebsiteURL: $('#new-business-url').val()
                    
                }
                model.saveCustomer(customer);
                clearNewCustomer();
                $('#win-new-customer').data('kendoWindow').close();
            });

            function clearNewCustomer() {
                $('#new-business-name').val('');
                $('#new-first-name').val('');
                $('#new-last-name').val('');
                $('#new-street-address').val('');
                $('#new-city').val('');
                $('#new-state').val('');
                $('#new-zip').val('');
                $('#new-business-email').val('');
                $('#new-phone').val('');
                $('#new-business-url').val('');
                $('#new-business-username').val('');
            }         
        }
    }

    //Project Tab

    function projectInfo() {
        newProjectWindow();

        var isActive = true;
        $('#project-is-active').click(function () {
            isActive = !isActive;
        });

        //Project Grid

        projectGrid();
        newCategory();
        updateCategory();

        function newCategory() {

            $('#project-categories').kendoMultiSelect({
                placeholder: 'Select Categories',
                dataTextField: 'Name',
                dataValueField: 'Id',
                dataSource: p1p.staticdata.getSiteCategories()
            });
        }

        function updateCategory() {
            var isAdd = false;
            
            $('#update-categories').kendoMultiSelect({
                placeholder: 'Select Categories',
                dataTextField: 'Name',
                dataValueField: 'Id',
                dataSource: p1p.staticdata.getSiteCategories(),
                change: function () {
                    if (!isAdd) {
                        $('body').addClass('working');
                        model.removeCategoryFromProject($('#update-categories').data('kendoMultiSelect').value());
                    }
                    if (isAdd) {
                        if ($(this)[0]._dataItems.length > 0) {
                            $('body').addClass('working');
                            model.addCategoryToProject($(this)[0]._dataItems[$(this)[0]._dataItems.length - 1].Id);
                        }
                    }
                    isAdd = false;
                },
                select: function () {
                    isAdd = true;
                }
            });

            model.topics.categoryAddedToProject.add(function () {
                $('body').removeClass('working');
            });

            model.topics.categoryRemovedFromProject.add(function () {
                $('body').removeClass('working');
            });
        }

        function projectGrid() {
            selectCustomer();
            selectTeam();

            var selectedProject;

            model.topics.projectsUpdated.add(refresh);

            $("#grdProjects").kendoGrid({
                scrollable: true,
                sortable: true,
                filterable: true,
                selectable: true,
                pageable: {
                    refresh: true,
                    pageSize: 10,
                    pageSizes: false
                },
                toolbar: [{ name: "create-project", text: "New Project" }],
                columns: [
                    { field: "Id", title: "Id", hidden: true },
                    { field: "Customer.Id", title: "Account", template: "#=Customer.BusinessName#" },
                    { field: "Name", title: "Project Name" },
                    { field: "Description", title: "Description" },
                    { field: "IsActive", title: "Active", width: "60px", attributes: { style: "text-align: center;" }, template: "<input name='IsActive' disabled type='checkbox' data-bind='checked: IsActive' #= IsActive ? checked='checked' : '' #/>" },
                    { field: "BillingCycle.Id", title: "Cycle", template: "#=BillingCycle.Name#" },
                    { field: "Team.Id", title: "Team", template: "#=Team.Name ? Team.Name : 'Select Team'#" },
                    {
                        command:
                        {
                            text: "edit", click: editProject
                        },
                        title: " ",
                        width: "85px"
                    },
                    {
                        command:
                          {
                              text: "Delete", click: deleteProject
                          },
                        title: " ",
                        width: "85px"
                    }
                ],
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedProject = grid.dataItem($(this)).toJSON();
                    })
                }
            });

            $('.k-grid-create-project').click(function () {
                $('#win-new-project').data('kendoWindow').open();
                $('#win-new-project').data('kendoWindow').toFront();
            });

            function refresh() {
                $('#grdProjects').data('kendoGrid').dataSource.data(model.getProjects());
                $('#grdProjects').data('kendoGrid').dataSource.pageSize(10);
            }

            function selectCustomer() {
                $('#update-customer').kendoComboBox({
                    placeholder: 'Select Customer',
                    dataTextField: 'BusinessName',
                    dataValueField: 'Id'
                });
                model.topics.customersUpdated.add(refresh);
                function refresh() {
                    $('#update-customer').data('kendoComboBox').dataSource.data(model.getCustomers());
                }
            }          
                       
            $('#update-project-billing-cycle').kendoComboBox({
                placeholder: 'Select Cycle',
                dataTextField: 'Name',
                dataValueField: 'Id',
                dataSource: p1p.staticdata.getBillingCycles()
            });

            function selectTeam() {
                $('#update-select-team').kendoComboBox({
                    placeholder: 'Select Team',
                    dataTextField: 'Name',
                    dataValueField: 'Id'
                });
                model.topics.teamsUpdated.add(refresh);

                function refresh() {
                    $('#update-select-team').data('kendoComboBox').dataSource.data(model.getTeams());
                }
            }

            //Edit Button Window

            

            $('#btn-update-project').click(function () {
                var updateProject = model.getSelectedProject();
                updateProject.IsActive = $('#update-mode-active').hasClass('mode-active');
                updateProject.CustomerId = $('#update-customer').data('kendoComboBox').value();
                updateProject.Name = $('#update-project-name').val();
                updateProject.Description = $('#update-project-description').val();
                updateProject.BillingCycle = { Id: $('#update-project-billing-cycle').val() };
                updateProject.Team = { Id: $('#update-select-team').val() };
                model.saveProject(updateProject);

                model.topics.projectsUpdated.add(function () {
                    clearProject();
                    $('#win-update-project').data('kendoWindow').close();
                });


            });

            function clearProject() {
                $('#update-customer').val(null);
                $('#update-project-name').val(null);
                $('#update-project-description').val(null);
                $('#update-project-billing-cycle').val(null);
                $('#update-select-team').val(null);
            }

            $('#update-mode-active').click(function () {
                $('.mode-active').removeClass('mode-active mode-inactive');
                $('#update-mode-active').addClass('mode-active');
                $('#update-mode-inactive').addClass('mode-inactive');
                model.setActive(true);
            });

            $('#update-mode-inactive').click(function () {
                $('.mode-active').removeClass('mode-active mode-inactive');
                $('#update-mode-inactive').addClass('mode-active');
                $('#update-mode-active').addClass('mode-inactive');
                model.setActive(false);
            });

            function editProject(e) {
                $('#win-update-project').data('kendoWindow').center();
                $('#win-update-project').data('kendoWindow').open();
                $('#win-update-project').data('kendoWindow').toFront();
                $('#win-update-project').closest('.k-window').css({
                    position: 'fixed',
                    margin: 'auto',
                    top: '10%'
                });

                var grid = $('#grdProjects').data('kendoGrid');
                var project = grid.dataItem($(e.target).closest('tr')).toJSON();
                model.setSelectedProject(project);
                var vm = kendo.observable(project);
                kendo.bind($('#tbl-update-project'), vm);
                if (!project.IsActive) {
                    $('#update-mode-inactive').click();
                } else {
                    $('#update-mode-active').click();
                }

                var categories = [];
                $.each(project.Categories, function (i, c) {
                    categories.push(c.Id);
                });

                $('#update-categories').data('kendoMultiSelect').value(categories);
            }

            //Delete Button

            function deleteProject() {
                model.deleteProject(selectedProject.Id);
            }
        }
        
        //New Project Button

        function newProjectWindow() {
            $('#win-new-project').kendoWindow({
                title: "New Project",
                visible: false,
                width: '700px',
            });

            $('#win-new-project').data('kendoWindow').center();
            $('#win-new-project').closest('.k-window').css({
                position: 'fixed',
                margin: 'auto',
                top: '10%'
            });

            (function () {
                $('#customer').kendoComboBox({
                    placeholder: 'Select Customer',
                    dataTextField: 'BusinessName',
                    dataValueField: 'Id'
                });
                model.topics.projectsUpdated.add(refresh);
                model.topics.customersUpdated.add(refresh);
                function refresh() {
                    $('#customer').data('kendoComboBox').dataSource.data(model.getCustomers());
                }
            })();

            $('#project-billing-cycle').kendoComboBox({
                placeholder: 'Select Cycle',
                dataTextField: 'Name',
                dataValueField: 'Id',
                dataSource: p1p.staticdata.getBillingCycles()
            });

            (function () {
                $('#select-team').kendoComboBox({
                    placeholder: 'Select Team',
                    dataTextField: 'Name',
                    dataValueField: 'Id'
                });
                model.topics.teamsUpdated.add(refresh);

                function refresh() {
                    $('#select-team').data('kendoComboBox').dataSource.data(model.getTeams());
                }
            })();

            $('#mode-active').click(function () {
                $('.mode-active').removeClass('mode-active mode-inactive');
                $('#mode-active').addClass('mode-active');
                $('#mode-inactive').addClass('mode-inactive');
                model.setActive(true);
            });

            $('#mode-inactive').click(function () {
                $('.mode-active').removeClass('mode-active mode-inactive');
                $('#mode-inactive').addClass('mode-active');
                $('#mode-active').addClass('mode-inactive');
                model.setActive(false);
            });

            $('#btn-save-project').click(function () {
                var project = {
                    CustomerId: $('#customer').data('kendoComboBox').value(),
                    BusinessName: $('#customer').data('kendoComboBox').text(),
                    Name: $('#project-name').val(),
                    Description: $('#project-description').val(),
                    BillingCycle: { Id: $('#project-billing-cycle').data('kendoComboBox').value() },
                    Team: { Id: $('#select-team').val() }
                }
                model.saveProject(project);

                model.topics.projectsUpdated.add(function () {
                    clearNewProject();
                    $('#win-new-project').data('kendoWindow').close();

                });
            });

            function clearNewProject() {
                $('#customer').data('kendoComboBox').value(null);
                $('#project-name').val(null);
                $('#project-description').val(null);
                $('#project-billing-cycle').data('kendoComboBox').value(null);
                $('#select-team').data('kendoComboBox').value(null);
                $('#mode-active').click();
            }
        }
    }

    $(initUi);

})();