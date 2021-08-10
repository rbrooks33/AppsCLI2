using AppsClient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Brooksoft.Apps.Business.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UserManager<User> _userManager;

        public UserController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public class RegisterUserParameter
        {
            public string Username;
            public string Password;
        }
        [Authorize]
        [HttpPost]
        [Route("Register")]
        public async Task<AppsResult> Register(RegisterUserParameter registerUser)
        {
            var result = new AppsResult();

            try
            {
                var user = await _userManager.FindByNameAsync(registerUser.Username);
                if(user == null)
                {
                    user = new User
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserName = registerUser.Username
                    };
                    var createResult = await _userManager.CreateAsync(user, registerUser.Password);
                }
                result.Success = true; //Best practice: return regardless, allow next retrieval of auth-related data to let user know if auth'd
            }
            catch(Exception ex)
            {
                new AppFlows.Create.Exception(ex, ref result);
            }
            return result;
        }
    }
}
