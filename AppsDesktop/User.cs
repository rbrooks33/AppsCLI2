using System;
using System.Collections.Generic;
using System.Text;

namespace Brooksoft.Apps
{ 
    public class User
    {
        public string  Id { get; set; }
        public string UserName { get; set; }
        public string NormalizedUserName { get; set; }
        public string PasswordHash { get; set; }

    }
}
