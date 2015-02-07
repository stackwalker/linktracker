/// <reference path="../lib/p1p.js" />
/// <reference path="winnersadministrationmodel.js" />
(function () {
    var model;
    $(function () {
        model = p1p.winnersadministration.getModel();
        linksGrid();

        function linksGrid() {
            model.topics.activeLinksRetrieved.add(refresh);

            model.fetchActiveLinks();
            
            var grid = $('#grdLinks').kendoGrid({
                scrollable: true,
                sortable: true,
                editable: true,
                filterable: true,               
                resizable: true,
                height: '620px',
                columnMenu: true,
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                columns: [
                { field: "Id", title: "Id", hidden: true },
                { field: "Project.Name", title: "Project", width: "200px", editable: false },
                {
                    field: "TargetUrl",
                    title: "Target URL",
                    width: '550px',
                    editable: false,
                    template: function (dataItem) {
                        return "<a href=\"" + dataItem.TargetUrl + "\"target=\"_blank\">" + dataItem.TargetUrl + "</a>";
                    }
                },
                { field: "DatePublished", title: "Published", width: '85px', template: '#= (data.DatePublished) ? kendo.toString(kendo.parseDate(DatePublished), "MM/dd/yyyy" ) : " " #' },
                { field: "DomainAuthority", title: "DA", width: "60px", attributes: { style: "text-align: center;" }},
                { field: "IsWinner", title: "Winner", width: "60px", attributes:{style: "text-align: center;"}, template: "<input name='IsWinner' class='winner' type='checkbox' data-bind='checked: IsWinner' #= IsWinner ? checked='checked' : '' #/>" },
                { command: 
                    { text: "Save", click: saveLink, width: '20px' }
                }
                ]
            });

            //TODO this should get moved off somewhere more globally accessible and probably should switch
            //out the lame KENDO graphic
            var loaderContent = $('<div class="k-loading-mask" style="width:100%;height:100%"><span class="k-loading-text">Loading...</span><div class="k-loading-image"><div class="k-loading-color"></div></div></div>');
            $('#grdLinks .k-grid-content').append(loaderContent);

            $('#grdLinks tbody').on("change", ".winner", function (e) {
                var row = $(e.target).closest("tr");
                var item = $('#grdLinks').data('kendoGrid').dataItem(row);
                item.set("IsWinner", $(e.target).is(":checked"));
            });

            function saveLink(e) {
                var grid = $('#grdLinks').data('kendoGrid');
                var link = grid.dataItem($(e.target).closest('tr')).toJSON();

                model.updateLink(link);
            }

            function refresh() {
                $('#grdLinks .k-loading-mask').remove();
                var grid = $('#grdLinks').data('kendoGrid');
                grid.dataSource.data(model.getActiveLinks());
                grid.dataSource.pageSize(15);
            }
        }
    });
})();