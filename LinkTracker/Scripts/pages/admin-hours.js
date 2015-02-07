/// <reference path="../lib/p1p.js" />
/// <reference path="hoursuploadmodel.js" />
/// <reference path="../lib/sharedcontrols.js" />
(function () {
    
    var model = p1p.hoursUpload.getModel();

    function initUi() {
        var loaderWindow = p1p.sharedcontrols.loaderWindow();

        p1p.globalEvents.serverProcessing.add(function () {
            loaderWindow.start();
        });

        p1p.globalEvents.serverProcessComplete.add(function () {
            loaderWindow.stop();
        });

        hoursUploadContent();

        function hoursUploadContent() {
            var hoursUploadData;
            var parsedHoursUploadData;
            var selectedEntry;

            $("#hoursUploadFile").kendoUpload({
                select: onHoursFileSelect
            });

            function onHoursFileSelect(e) {
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    hoursUploadData = e.target.result;
                    model.topics.hoursFileUploaded.fire();
                }
                fileReader.readAsText(e.files[0].rawFile);
            };

            model.topics.hoursFileUploaded.add(function () {
                hoursUploadData = hoursUploadData.replace('"', '');
                hoursUploadData = hoursUploadData.split('\n');
                var count = hoursUploadData.length;
                var i = 0;
                parsedHoursUploadData = []
                $.each(hoursUploadData, function (i) {
                    var e = hoursUploadData[i];
                    e = e.split(',');
                    var item = {};
                    item.Project = e[0];
                    item.FirstName = e[1];
                    item.LastName = e[2];
                    item.Date = e[3];
                    item.StartTime = e[4];
                    item.EndTime = e[5];
                    item.Elapsed = e[6];
                    item.AbbreviatedProject = e[7];
                    item.Activity = e[8];
                    item.Note = e[9];
                    item.IsTimeOff = e[10];

                    parsedHoursUploadData.push(item);
                    i++;
                    if (i === count) model.topics.hoursParsed.fire();
                });
                    
            });

            model.topics.hoursParsed.add(function () {
                $('#hoursUploadGrid').data('kendoGrid').dataSource.pageSize(20);
                $('#hoursUploadGrid').data('kendoGrid').dataSource.data(parsedHoursUploadData);
            });

            $('#hoursUploadGrid').kendoGrid({
                scrollable: true,
                sortable: true,
                filterable: true,
                selectable: 'single',
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                columns: [
                    { field: "Project", title: "Project" },
                    { field: "FirstName", title: "First Name" },
                    { field: "LastName", title: "Last Name" },
                    { field: "Date", title: "Date" },
                    { field: "StartTime", title: "Start Time" },
                    { field: "EndTime", title: "End Time" },
                    { field: "Elapsed", title: "Elapsed" },
                    { field: "AbbreviatedProject", title: "AP" },
                    { command:
                          {
                              text: "Delete", click: deleteEntry
                          },
                        title: " ",
                        width: "85px"
                    }
                ],
                change: function () {
                    var grid = this;
                    grid.select().each(function () {
                        selectedEntry = grid.dataItem($(this));
                    })
                }
            });

            function deleteEntry() {
                $.each(parsedHoursUploadData, function (i) {
                    if (parsedHoursUploadData[i].LastName === selectedEntry.LastName
                        && parsedHoursUploadData[i].Date === selectedEntry.Date
                        && parsedHoursUploadData[i].EndTime === selectedEntry.EndTime) {
                        parsedHoursUploadData.splice(i, 1);
                        $('#hoursUploadGrid').data('kendoGrid').dataSource.pageSize(20);
                        $('#hoursUploadGrid').data('kendoGrid').dataSource.data(parsedHoursUploadData);
                    }
                });
            }

            $('#saveHours').click(function () {
                $('.message').css('display', 'none');
                if (!parsedHoursUploadData) {
                    $('#noHours').fadeIn('fast');
                } else {
                    if (confirm("This will only import entries within the last month.")) {
                        model.saveHours(parsedHoursUploadData);
                    }
                }
            });

            model.topics.hoursSaved.add(function () {
                $('#hoursSaved').fadeIn('fast');
                parsedHoursUploadData = model.getFailedHours();
                $('#hoursUploadGrid').data('kendoGrid').dataSource.pageSize(20);
                $('#hoursUploadGrid').data('kendoGrid').dataSource.data(parsedHoursUploadData);
            });

            $('#exportHours').click(function () {
                if (!parsedHoursUploadData) {
                } else {
                    var data = parsedHoursUploadData;
                    var csv = "data:text/csv;charset=utf-8,";
                    $.each(data, function (i) {
                        csv += data[i].Project + "," + data[i].FirstName + "," + data[i].LastName + "," + data[i].Date + "," + data[i].StartTime + "," + data[i].EndTime + "," + data[i].Elapsed + "," + data[i].AbbreviatedProject + "," + data[i].Activity + "," + data[i].Note + "," + data[i].IsTimeOff + "\n";
                    });
                    var encodedUri = encodeURI(csv);
                    var link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "failed_hours.csv");
                    link.click();
                }
            });
        }
    }

    $(initUi);
}());