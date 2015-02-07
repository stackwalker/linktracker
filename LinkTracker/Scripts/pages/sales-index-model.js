/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="../lib/staticdata.js" />
(function () {
    p1p.namespace('sales');

    var filteredCustomers;
    var selectedCustomer;

    var model = {
        topics: {
            customersRetrieved: $.Callbacks(),
            customerSelected: $.Callbacks()
        },

        searchCustomers: function (businessName, email, firstName, lastName) {
            var paramText = $.param({BusinessName: businessName, Email: email, FirstName: firstName, LastName: lastName});

            $.getJSON('/api/Customer/Search?', paramText, function (data) {
                filteredCustomers = data;
                model.topics.customersRetrieved.fire();
            });
        },

        selectCustomer: function(customer){
            selectedCustomer = customer;
            model.topics.customerSelected.fire();
        },

        placeOrder: function(order){
            console.log(order);
        },

        getCustomerResults: function(){
            return filteredCustomers;
        },

        getSelectedCustomer: function () {
            return selectedCustomer;
        }
    };

    p1p.sales.getModel = function () {
        return model;
    };

})();