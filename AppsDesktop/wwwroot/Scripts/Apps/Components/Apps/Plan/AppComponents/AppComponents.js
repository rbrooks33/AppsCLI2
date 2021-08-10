define([], function () {
    var Me = {
        Initialize: function () {

            Apps.Data.RegisterGET('AppComponents', '/api/AppComponent/GetAppComponents?appId={0}', Me);
            Apps.Data.RegisterGET('AppComponentModel', '/api/AppComponent/GetAppComponentModel', Me);
            Apps.Data.RegisterPOST('UpsertAppComponent', '/api/AppComponent/UpsertAppComponent');

            Me.Data.AppComponentModel.Refresh();
        },
        Show: function () {

            var app = Apps.Data.App.Data[0];

            Me.Data.AppComponents.Refresh([app.AppID], function () {

                let table = Apps.Grids.GetTable({
                    id: "gridAppComponents",
                    data: Me.Data.AppComponents.Data,
                    title: app.AppName + ' <span style="color:lightgrey;">App Components</span>',
                    tableactions: [
                        {
                            text: "Add Component",
                            actionclick: function () {
                                Apps.Components.Apps.Plan.AppComponents.Data.AppComponents.Selected = null;
                                Apps.Components.Apps.Plan.AppComponents.Upsert();
                            }

                        }
                    ],
                    tablestyle: "",
                    rowactions: [
                        {
                            text: "Add Component",
                            actionclick: function (td, appComponent, tr) {
                                 
                                let newChildComponent = {
                                    ParentComponentID : appComponent.ID
                                };
                                
                                Apps.Components.Apps.Plan.AppComponents.Data.AppComponents.Selected = newChildComponent;
                                Apps.Components.Apps.Plan.AppComponents.Upsert();
                            }
                        },
                        {
                            text: "Delete",
                            actionclick: function (td, appComponent, tr) {
                                if (confirm('Are you sure?')) {
                                    appComponent.Archived = true;
                                    Apps.Components.Apps.Plan.AppComponents.Data.AppComponents.Selected = appComponent;
                                    Apps.Components.Apps.Plan.AppComponents.Upsert();
                                }
                            }
                        }
                    ],
                    rowbuttons: [
                        {
                            text: "Sub-Components",
                            buttonclick: function (td, appComponent, tr) {
                                Apps.Components.Apps.Plan.AppComponents.ShowComponents(td, appComponent, tr);
                            }
                        },
                        {
                            text: "Stories",
                            buttonclick: function (td, appComponent, tr) {
                                Apps.Components.Apps.Plan.AppComponents.Stories.Show(td, appComponent, tr);
                            }
                        }
                    ],
                    fields: [
                        { name: 'ID' },
                        {
                            name: 'AppComponentName',
                            editclick: function (td, rowdata, editControl) {
                            },
                            saveclick: function (td, appComponent, input) {
                                appComponent.AppID = Apps.Data.App.Data[0].AppID;
                                appComponent.AppComponentName = $(input).val();
                                Apps.Components.Apps.Plan.AppComponents.Data.AppComponents.Selected = appComponent;
                                Apps.Components.Apps.Plan.AppComponents.Upsert();
                            }
                        },
                        {
                            name: 'AppComponentDescription',
                            editclick: function (td, rowdata, editControl) {
                            },
                            saveclick: function (td, appComponent, input) {
                                appComponent.AppID = Apps.Data.App.Data[0].AppID;
                                appComponent.AppComponentDescription = $(input).val();
                                Apps.Components.Apps.Plan.AppComponents.Data.AppComponents.Selected = appComponent;
                                Apps.Components.Apps.Plan.AppComponents.Upsert();
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
                            format: function (appComponent) {
                                let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                if (appComponent.AppComponentName)
                                    result = '<span style="font-size:22px;">' + appComponent.AppComponentName + '</span>';

                                return result;
                            }
                        },
                        {
                            fieldname: 'AppComponentDescription',
                            text: 'Description',
                            format: function (appComponent) {
                                let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                if (appComponent.AppComponentDescription)
                                    result = appComponent.AppComponentDescription;

                                return result;
                            }
                        }
                    ]
                });

                $('#App_Plan_TemplateContent').html(table.outerHTML);
                //Me.Parent.Parent.UI.//Apps.Components.Apps.UI.PlanTab.Selector.html(table.outerHTML); //Put in tab content div
                //Apps.Components.Apps.UI.PlanTab.Show();
                //Apps.Tabstrips
            });

        },
        Upsert: function () {

            let appComponent = Me.Data.AppComponentModel.Data; //Insert (blank) model object

            if (Me.Data.AppComponents.Selected)
                appComponent = Me.Data.AppComponents.Selected; //Use/update an existing object

            appComponent.AppID = Apps.Data.App.Data[0].AppID;

            Apps.Data.Post('UpsertAppComponent', appComponent, function () {
                Me.Data.AppComponents.Selected = null;
                Apps.Notify('success', 'Upserted app component.');
                Me.Show();
            });
        },
        ShowComponents: function (td, appComponent, tr) {

            Me.Data.AppComponents.Selected = appComponent;

            let row = $('#Plan_AppComponents_SubComponentsRow' + appComponent.ID);

            if (row.length == 0) {

                Me.SubComponents.GetSubComponents(appComponent, function (html) {

                    $(tr).after('<tr><td id="Plan_AppComponents_SubComponentsRow' + appComponent.ID + '" style="display:none;" colspan="5">' + html + '</td></tr>');

                    row = $('#Plan_AppComponents_SubComponentsRow' + appComponent.ID);

                    row.show(400);

                });
            }
            else
                row.detach();
        }
    };
    return Me;
});

