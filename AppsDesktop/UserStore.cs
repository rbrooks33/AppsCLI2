using AppsDesktop;
using LiteDB;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Brooksoft.Apps
{
    public class UserStore : Microsoft.AspNetCore.Identity.IUserStore<User>, IUserPasswordStore<User>
    {
        private AppsData _data;
        private LiteDatabase _db;

        public UserStore(AppsData data)
        {
            _data = data;
            _db = data.AppsDB;
        }
        public Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
        {
            var userDB = _db.GetCollection<User>("Users");
            userDB.Insert(user);
            return Task.FromResult(IdentityResult.Success);
        }
        public Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            var userDB = _db.GetCollection<User>("Users");
            userDB.Update(user);
            return Task.FromResult(IdentityResult.Success);
        }

        public Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
        }

        public async Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            var userDB = _db.GetCollection<User>("Users");
            var userList = userDB.Query().Where(u => u.Id == userId);
            return userList.SingleOrDefault();
        }

        public async Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            var userDB = _db.GetCollection<User>("Users");
            var userList = userDB.Query().Where(u => u.NormalizedUserName == normalizedUserName);
            return userList.SingleOrDefault();
        }

        public Task<string> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedUserName);
        }

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id);
        }

        public Task<string> GetUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task SetNormalizedUserNameAsync(User user, string normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            return Task.CompletedTask;
        }

        public Task SetUserNameAsync(User user, string userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            return Task.CompletedTask;
        }

        public Task SetPasswordHashAsync(User user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.CompletedTask;
        }

        public Task<string> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash != null);
        }
    }
}
