define([], function () {
    var Me = {
        Parent: null,
        SubComponentModel: null,
        Initialize: function (callback) {

            //Me.UI.Show();

            Apps.Data.RegisterPOST('UpsertSubComponent', '/api/AppComponent/UpsertSubComponent');
            Apps.Data.RegisterGET('SubComponents', '/api/AppComponent/GetSubComponents?appComponentId={0}', Me);
            Apps.Data.RegisterGET('SubComponentModel', '/api/AppComponent/GetSubComponentModel', Me);

            Me.Data.SubComponentModel.Refresh();

            if (callback)
                callback();
        },
        GetSubComponents: function (appComponent, callback) {

            Me.Data.SubComponents.Refresh([appComponent.ID], function () {

                let stories = Me.Data.SubComponents.Data;

                $.each(stories, function (index, story) {
                    story['RoleIDs'] = [];
                });

                let table = Apps.Grids.GetTable({
                    id: "gridSubComponents",
                    data: stories,
                    title: appComponent.AppComponentName + ' <span style="color:lightgrey;">SubComponents</span>',
                    tableactions: [
                        {
                            text: "Add SubComponent",
                            actionclick: function () {
                                Apps.Components.Apps.Plan.AppComponents.SubComponents.Upsert();
                            }

                        }
                    ],
                    tablestyle: "",
                    rowactions: [
                        {
                            text: "Delete",
                            actionclick: function (td, story, tr) {
                                if (confirm('Are you sure?')) {
                                    story.Archived = true;
                                    Apps.Data.SubComponents.Selected = story;
                                    Apps.Components.Apps.Plan.AppComponents.SubComponents.Upsert();
                                }
                            }
                        }
                    ],
                    rowbuttons: [
                        {
                            text: "Tests",
                            buttonclick: function (td, story, tr) {
                                Apps.Components.Apps.Plan.AppComponents.Stories.ShowTests(td, story, tr);
                            }
                        }

                    ],
                    fields: [
                        { name: 'ID' },
                        {
                            name: 'AppComponentName',
                            editclick: function (td, rowdata, editControl) {
                            },
                            saveclick: function (td, sub, input) {
                                //sub.ParentComponentID = Apps.Components.Apps.Plan.AppComponents.Apps.Data.AppComponents.Selected.ID;
                                sub.AppComponentName = $(input).val();
                                Apps.Components.Apps.Plan.AppComponents.SubComponents.Data.SubComponents.Selected = sub;
                                Apps.Components.Apps.Plan.AppComponents.SubComponents.Upsert();
                            }
                        },
                        { name: 'RoleIDs' },
                        {
                            name: 'AppComponentDescription',
                            editclick: function (td, rowdata, editControl) {
                            },
                            saveclick: function (td, sub, input) {
                                //story.AppComponentID = Apps.Data.AppComponents.Selected.ID;
                                sub.AppComponentDescription = $(input).val();
                                Apps.Components.Apps.Plan.AppComponents.SubComponents.Data.SubComponents.Selected = sub;
                                Apps.Components.Apps.Plan.AppComponents.SubComponents.Upsert();
                            }
                        }
                    ],
                    columns: [
                        {
                            fieldname: 'ID',
                            text: 'ID'
                        },
                        {
                            fieldname: 'AppComponentName',
                            text: 'Name',
                            format: function (story) {
                                let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                if (story.AppComponentName)
                                    result = '<span style="font-size:15px;font-weight:bold;">' + story.AppComponentName + '</span>';

                                return result;
                            }
                        },
                        {
                            fieldname: 'AppComponentDescription',
                            text: 'Description',
                            format: function (story) {
                                let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                if (story.AppComponentDescription)
                                    result = story.AppComponentDescription;

                                return result;
                            }
                        }
                    ]
                });

                if (callback)
                    callback(table.outerHTML);
            });
        },
        Upsert: function () {
            let sub = Me.Data.SubComponentModel.Data;
            if (Me.Data.SubComponents.Selected)
                sub = Me.Data.SubComponents.Selected;

            sub.ParentComponentID = Me.Parent.Data.AppComponents.Selected.ID; //Should have this by now

            Apps.Data.Post('UpsertSubComponent', sub, function () {
                Apps.Notify('success', 'Upserted SubComponent.');
                Me.Refresh(Me.Parent.Data.AppComponents.Selected)
            });
        },
        Refresh: function (appComponent) {

            Me.Parent.Data.AppComponents.Selected = appComponent;

            let row = $('#Plan_AppComponents_SubComponentsRow' + appComponent.ID);

            if (row.length == 1) {

                Me.GetSubComponents(appComponent, function (html) {

                    row.html(html);

                });
            }
        }
    };
    return Me;
});