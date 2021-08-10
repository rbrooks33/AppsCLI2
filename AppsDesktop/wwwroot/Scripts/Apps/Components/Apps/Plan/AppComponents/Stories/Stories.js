define([], function () {
    var Me = {
        Parent: null,
        StoryModel: null,
        Initialize: function (callback) {

            Me.UI.Show();

            Apps.Data.RegisterPOST('UpsertStory', '/api/Story/UpsertStory');
            Apps.Data.RegisterGET('Stories', '/api/Story/GetStories?appComponentId={0}', Me);
            Apps.Data.RegisterGET('StoryModel', '/api/Story/GetStoryModel', Me);

            Me.Data.StoryModel.Refresh();

            if (callback)
                callback();
        },
        Show: function (td, appComponent, tr) {

            Me.Parent.Data.AppComponents.Selected = appComponent;

            let row = $('#Plan_AppComponents_StoriesRow' + appComponent.ID);

            if (row.length == 0) {

                Me.GetStories(appComponent, function (html) {

                    $(tr).after('<tr><td id="Plan_AppComponents_StoriesRow' + appComponent.ID + '" style="display:none;" colspan="5">' + html + '</td></tr>');

                    row = $('#Plan_AppComponents_StoriesRow' + appComponent.ID);

                    row.show(400);

                });
            }
            else
                row.detach();
        },
        GetStories: function (appComponent, callback) {

            Me.Data.Stories.Refresh([appComponent.ID], function () {

                let stories = Me.Data.Stories.Data;

                $.each(stories, function (index, story) {
                    story['RoleIDs'] = [];
                });

                let table = Apps.Grids.GetTable({
                    id: "gridStories",
                    data: stories,
                    title: appComponent.AppComponentName + ' <span style="color:lightgrey;">Stories</span>',
                    tableactions: [
                        {
                            text: "Add Story",
                            actionclick: function () {
                                Apps.Components.Apps.Plan.AppComponents.Stories.Upsert();
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
                                    Apps.Components.Apps.Plan.AppComponents.Stories.Data.Stories.Selected = story;
                                    Apps.Components.Apps.Plan.AppComponents.Stories.Upsert();
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
                        },
                        {
                            text: "Functional Specs",
                            buttonclick: function (td, story, tr) {
                                Apps.Components.Apps.Plan.AppComponents.Stories.ShowTests(td, story, tr);
                            }
                        },
                        {
                            text: "Methods",
                            buttonclick: function (td, story, tr) {
                                Apps.Components.Apps.Plan.AppComponents.Stories.ShowTests(td, story, tr);
                            }
                        },
                        {
                            text: "Requirements",
                            buttonclick: function (td, story, tr) {
                                Apps.Components.Apps.Plan.AppComponents.Stories.ShowTests(td, story, tr);
                            }
                        }

                    ],
                    fields: [
                        { name: 'ID' },
                        {
                            name: 'StoryName',
                            editclick: function (td, rowdata, editControl) {
                            },
                            saveclick: function (td, story, input) {
                                //story.AppComponentID = Apps.Data.AppComponents.Selected.ID;
                                story.StoryName = $(input).val();
                                Apps.Components.Apps.Plan.AppComponents.Stories.Data.Stories.Selected = story;
                                Apps.Components.Apps.Plan.AppComponents.Stories.Upsert();
                            }
                        },
                        { name: 'RoleIDs' },
                        {
                            name: 'StoryDescription',
                            edittype: 'editor',
                            editclick: function (td, rowdata, editControl) {
                            },
                            saveclick: function (td, story, input) {
                                //story.AppComponentID = Apps.Data.AppComponents.Selected.ID;
                                story.StoryDescription = $(input).val();
                                Apps.Components.Apps.Plan.AppComponents.Stories.Data.Stories.Selected = story;
                                Apps.Components.Apps.Plan.AppComponents.Stories.Upsert();
                            }
                        }
                    ],
                    columns: [
                        {
                            fieldname: 'ID',
                            text: 'ID'
                        },
                        {
                            fieldname: 'StoryName',
                            text: 'Name',
                            format: function (story) {
                                let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                if (story.StoryName)
                                    result = '<span style="font-size:15px;font-weight:bold;">' + story.StoryName + '</span>';

                                return result;
                            }
                        },
                        {
                            fieldname: 'RoleIDs',
                            text: 'Roles'
                        },
                        {
                            fieldname: 'StoryDescription',
                            text: 'Description',
                            format: function (story) {
                                let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                if (story.StoryDescription)
                                    result = story.StoryDescription;

                                return result;
                            }
                        }
                    ]
                });

                if (callback)
                    callback(table.outerHTML);
            });
        },
        New: function () {
            Apps.Post2('/api/Story/UpsertStory', JSON.stringify(Me.StoryModel), function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'New story created!');
                    Apps.Components.Dialogs.Close('Apps_Stories_NewStory_Dialog');
                }
                else {
                    Apps.Notify('warning', 'Error upserting story.');
                }
            });
        },
        Upsert: function () {
            let story = Me.Data.StoryModel.Data;
            if (Me.Data.Stories.Selected)
                story = Me.Data.Stories.Selected;

            story.AppComponentID = Me.Parent.Data.AppComponents.Selected.ID; //Should have this by now

            Apps.Data.Post('UpsertStory', story, function () {
                Apps.Notify('success', 'Upserted story.');
                Me.Refresh(Me.Parent.Data.AppComponents.Selected)
            });
        },
        Refresh: function (appComponent) {

            Me.Parent.Data.AppComponents.Selected = appComponent;

            let row = $('#Plan_AppComponents_StoriesRow' + appComponent.ID);

            if (row.length == 1) {

                Me.GetStories(appComponent, function (html) {

                    row.html(html);

                });
            }
        }
    };
    return Me;
});