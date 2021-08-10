define([], function () {
    var Me = {
        Initialize: function () {
            Apps.Data.RegisterPOST('Register', '/api/User/Register');
        },
        Show: function () {
            Me.UI.Show(400);
        },
        Hide: function () {
            Me.UI.Hide(400);
        },
        Register: function () {
            let registerUser = {
                Username: $('#Helpers_Login_Username_Textbox').val(),
                Password: $('#Helpers_Login_Password_Textbox').val()
            };
            Apps.Data.Post('Register', registerUser, function () {
                Apps.Notify('info', 'User added.');
            });
        },
        About: function () {

        }
    };
    return Me;
});