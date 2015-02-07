/// <reference path="../lib/kendo/js/jquery.js" />
/// <reference path="../lib/kendo/js/kendo.all.js" />
/// <reference path="../lib/p1p.js" />
/// <reference path="../lib/staticdata.js" />
/// <reference path="../lib/sharedcontrols.js" />
/// <reference path="articlemanagermodel.js" />
/// <reference path="../lib/localsettings.js" />

(function () {

    var model;

    var page = {};

    function initUi() {
        model = p1p.articlemanager.getModel();
               
        model.fetchProjects();

        model.topics.articleSaved.add(function () {
            $('#cnfm-article-saved').removeClass('hidden');
            model.fetchSummaryArticles($('#article-search-project').data('kendoComboBox').value(), $('#chkOnlyMine').is(':checked'), $('#chkIncludePublished').is(':checked'));
        });

        $('input').change(function () {
            $('.message').addClass('hidden');
        });

        $('.smallbutton').click(function () {
            $('.message').addClass('hidden');
        });

        $('#btn-save-article').click(function () {
            
            var article = page.articleEditor.getArticle();

            if (model.getSelectedArticle()) {
                article.Id = model.getSelectedArticle().Id;
                article.CreatedBy = model.getSelectedArticle().CreatedBy;
                article.CreatedDate = model.getSelectedArticle().CreatedDate;
            }                       
            
            if (isValidArticle(article)) {
                model.saveArticle(article);
            }
        });
                
        articleSearch();
        articleEditor();
        //TODO implement shared function for getting query string values
        
            if (window.location.search) {
                var url = window.location.href;
                spliturl = url.split('=');
                articleId = spliturl[1];
                articleId = parseInt(articleId);
                model.selectArticle(articleId);
            }
        
        
    }

    function isValidArticle(article) {
        var isValid = true;
        for (var p in article) {
            switch (p) {
                case 'Project':
                    if (!article.Project.Id) {
                        isValid = false;
                        $('#vld-no-project').removeClass('hidden');
                    }
                    break;
                case 'Title':
                    if (!article.Title) {
                        isValid = false;
                        $('#vld-no-title').removeClass('hidden');
                    }
                    break;
                case 'ArticleStatusId':
                    if (!article.ArticleStatusId) {
                        isValid = false;
                        $('#vld-no-status').removeClass('hidden');
                    }
                    break;
                default:
                    break;
            }

            if (!isValid) {
                break;
            }
        }

        return isValid;
    }

    function articleSearch() {
        articleGrid();

        $('#chkOnlyMine').attr('checked', true);

        $('#btn-search').click(function () {
            model.fetchSummaryArticles($('#article-search-project').data('kendoComboBox').value(), $('#chkOnlyMine').is(':checked'), $('#chkIncludePublished').is(':checked'));
        });

        //initialize project dropdown
        (function () {
            $("#article-search-project").kendoComboBox({
                dataTextField: "Name",
                dataValueField: "Id",
                placeholder: "Select Project",
            });

            model.topics.projectsRetrieved.add(function () {
                $('#article-search-project').data('kendoComboBox').dataSource.data(model.getProjects());
            });

        })();

        

        //initialize the grid
        function articleGrid () {
            var selected;

            var articleGridDefaultSettings = {
                selectable: 'single',
                pageable: {
                    refresh: true,
                    pageSizes: true
                },
                scrollable: true,
                sortable: true,
                filterable: true,
                resizable: true,
                columnMenu: true,
                columns: [
                    { field: "Id", hidden: true },
                    { field: "Title", title: "Title" },
                    { field: "CreatedBy", title: "Created By" },
                    { field: "ArticleStatus.Name", title: "Status" },
                    { field: "CreatedDate", title: "Created Date", template: '#= (data.CreatedDate) ? kendo.toString(kendo.parseDate(CreatedDate), "MM/dd/yyyy" ) : " " #' },                    
                ]
            };

            var articleGridSettings = p1p.localsettings.get('articlemanager', 'grd-articles', 'grid', articleGridDefaultSettings);

            articleGridSettings.columnResize = function (e) {
                p1p.localsettings.set('articlemanager', 'grd-articles', 'grid', 'columns', e.column.field, 'width', e.newWidth);
            };
            articleGridSettings.columnShow = function (e) {
                p1p.localsettings.set('articlemanager', 'grd-articles', 'grid', 'columns', e.column.field, 'hidden', false);
            };
            articleGridSettings.columnHide = function (e) {
                p1p.localsettings.set('articlemanager', 'grd-articles', 'grid', 'columns', e.column.field, 'hidden', true);
            };
            articleGridSettings.change = onChange;
            articleGridSettings.columns.push({ command: { text: "Delete", click: deleteArticle}, title: " ", width: "90px"});

            $('#grd-articles').kendoGrid(articleGridSettings);

            model.topics.summaryArticlesRetrieved.add(refresh);
                        
            function refresh () {
                $('#grd-articles').data('kendoGrid').dataSource.pageSize(10);
                $('#grd-articles').data('kendoGrid').dataSource.data(model.getSummaryArticles());
            };

            $('#grd-articles').on('click', '.k-i-refresh', function (e) {
                e.preventDefault();
                $("form.k-filter-menu button[type='reset']").trigger("click");
                refresh();
            });


            function onChange(arg) {
                selected = this.dataItem(this.select());

                if (selected) {
                    model.selectArticle(selected.Id);
                }
            }

            model.topics.selectedArticleCleared.add(function () {
                $('#grd-articles').data('kendoGrid').clearSelection();
            });

            function deleteArticle() {
                $('.message').addClass('hidden');
                if (!selected) {
                    $('#noArticleSelectedForDelete').removeClass('hidden');
                } else {
                    if ($('#article-status').data('kendoComboBox').value() === 4) {
                        $('#vld-article-published').removeClass('hidden');
                    } else {
                        if (confirm("Are you sure you want to delete this article?")) {
                            model.deleteArticle(selected);
                        }
                    }
                }
                model.topics.articleDeleted.add(function () {
                    $('#deleteArticleConfirmation').removeClass('hidden');
                    model.fetchSummaryArticles($('#article-search-project').val(), $('#chkOnlyMine').is(':checked'), $('#chkIncludePublished').is(':checked'));
                    $('#article-title').val('');
                    $('#article-status').data('kendoComboBox').text('');
                    $('#article-project').data('kendoComboBox').text('');
                    $('#article-content').data('kendoEditor').value('');
                });
            }

        };
    }

    function articleEditor() {
        var isDirty=false;

        page.articleEditor = {};

        page.articleEditor.getArticle = function () {
            var article = {};
            article.Title = $('#article-title').val();
            article.ArticleStatusId = $('#article-status').data('kendoComboBox').value();
            article.Project = { Id: $('#article-project').data('kendoComboBox').value() };
            article.Content = $('#article-content').data('kendoEditor').value();
            return article;
        };

        function bindArticle() {
            var article = model.getSelectedArticle();
            if (!article.Content) { article.Content = '';}
            $('#article-content').data('kendoEditor').value(article.Content);
            $('#article-title').val(article.Title);
            $('#article-project').data('kendoComboBox').value(article.Project.Id);
            $('#article-status').data('kendoComboBox').value(article.ArticleStatusId);
        }

        model.topics.articleSelected.add(bindArticle);

        model.topics.selectedArticleCleared.add(function () {
            $('#article-title').val('');
            $('#article-content').data('kendoEditor').value('');
            $('#article-status').data('kendoComboBox').text('');
            $('#article-project').data('kendoComboBox').text('');
        });

        model.topics.articleSaved.add(function () {
            isDirty = false;
        });

        model.topics.articleSelected.add(function () {
            isDirty = false;
        });

        model.topics.selectedArticleCleared.add(function () {
            isDirty = false;
        });

        //initialize editor params
        (function () {

            $("#article-project").kendoComboBox({
                dataTextField: "Name",
                dataValueField: "Id",
                placeholder: "Select Project",
                change: function (e) {
                    isDirty = true;
                }
            });

            model.topics.projectsRetrieved.add(function () {
                $('#article-project').data('kendoComboBox').dataSource.data(model.getProjects());
            });

            $('#article-status').kendoComboBox({
                dataTextField: "Name",
                dataValueField: "Id",
                placeholder: "Select Status",
                change: function (e) {
                    isDirty = true;
                },
                dataSource: p1p.staticdata.getArticleStatuses()
            });

            $('#article-title').change(function (e) {
                isDirty = true;
            });

            model.topics.selectedArticleCleared.add(function () {
                $('#article-title').val('');
                $('#article-status').data('kendoComboBox').text('');
                $('#article-project').data('kendoComboBox').text('');
            });

            $('#btn-new-article').click(function () {
                if (isDirty) {
                    if(confirm("Would you like to save this article first? ")) {
                        var article = page.articleEditor.getArticle();

                        if (model.getSelectedArticle()) {
                            article.Id = model.getSelectedArticle().Id;
                            article.CreatedBy = model.getSelectedArticle().CreatedBy;
                            article.CreatedDate = model.getSelectedArticle().CreatedDate;
                        }

                        if (isValidArticle(article)) {
                            model.saveArticle(article);
                        }
                        model.clearSelectedArticle();
                    }
                } else {
                    model.clearSelectedArticle();
                }
            });
        })();
        
        //initialize kendo editor
        (function () {
            $("#article-content").kendoEditor({
                tools: [
                    "formatting", "bold", "italic", "underline", "fontName", "fontSize", "foreColor", "backColor", "justifyLeft", "justifyCenter", 
                    "justifyRight", "justifyFull", "insertUnorderedList", "insertOrderedList", "indent", "outdent", "createLink", "unlink", "insertImage",
                    "createTable", "viewHtml"
                ],
                change: function (e) {
                    isDirty = true;
                }
                });

           
        })();
    }

    function init() {
        p1p.staticdata.initializeStaticData(initUi);
    }
    $(init);
})();