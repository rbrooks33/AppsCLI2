using AppsClient;
using Brooksoft.Apps.Client.Docs;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppComponentController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;

        public AppComponentController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _db = data.AppsDB;
        }
        [HttpGet]
        [Route("GetAppComponentModel")]
        public AppsResult GetAppComponentModel()
        {
            return new AppsResult() { Data = new AppComponent(), Success = true };
        }
        [HttpGet]
        [Route("GetAppComponents")]
        public AppsResult GetAppComponents(int appId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<AppComponent>("AppComponents"); // db.Softwares.Add(software);

                result.Data = objs.Query()
                    .Where(ss => ss.AppID == appId 
                        && ss.Archived == false
                        && ss.ParentComponentID == 0)
                    .ToList();

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.AppComponents.Exception(ex, ref result);
            }

            return result;
        }
        [HttpGet]
        [Route("GetAppComponent")]
        public AppsResult GetAppComponent(int appComponentId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<AppComponent>("AppComponents");

                result.Data = objs.Query().Where(ss => ss.ID == appComponentId).ToList();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.AppComponents.Exception(ex, ref result);
            }

            return result;
        }

        [HttpPost]
        [Route("UpsertAppComponent")]
        public AppsResult UpsertAppComponent([FromBody] AppComponent appComponent)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<AppComponent>("AppComponents");
                objs.Upsert(appComponent);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.AppComponents.Exception(ex, ref result);
            }

            return result;
        }

        public struct Methods
        {
            public const string GetSubComponent = nameof(GetSubComponent);
            public const string GetSubComponentModel = nameof(GetSubComponentModel);
            public const string GetSubComponents = nameof(GetSubComponents);
            public const string UpsertSubComponent = nameof(UpsertSubComponent);
        }
        public AppsResult Handler(string methodType, params object[] listOfParams)
        {
            var result = new AppsResult();

            try
            {
                if (methodType == Methods.GetSubComponentModel)
                {
                    result.Data = new AppComponent();
                }
                else if (methodType == Methods.GetSubComponents)
                {
                    int appComponentId = (int)listOfParams[0];

                    var objs = _db.GetCollection<AppComponent>("AppComponents"); // db.Softwares.Add(software);
                    result.Data = objs.Query()
                        .Where(ss =>
                            ss.Archived == false
                            && ss.ParentComponentID == appComponentId)
                        .ToList();
                }
                else if (methodType == Methods.GetSubComponent)
                {
                    var component = _db.GetCollection<AppComponent>("AppComponents");
                    result.Data = component.Query().Where(ss => ss.ID == (int)listOfParams[0]).ToList();
                }
                else if (methodType == Methods.UpsertSubComponent)
                {
                    var objs = _db.GetCollection<AppComponent>("AppComponents");
                    objs.Upsert((AppComponent)listOfParams[0]);
                }
                
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                new AppFlows.Plan.Apps.AppComponents.Exception(ex, ref result);
            }

            return result;
        }

        [HttpGet]
        [Route(Methods.GetSubComponentModel)]
        public AppsResult GetSubComponentModel()
        {
            return Handler(Methods.GetSubComponentModel);
        }
        [HttpGet]
        [Route(Methods.GetSubComponents)]
        public AppsResult GetSubComponents(int appComponentId)
        {
            return Handler(Methods.GetSubComponents, appComponentId);
        }
        [HttpPost]
        [Route(Methods.UpsertSubComponent)]
        public AppsResult UpsertSubComponent([FromBody] AppComponent appComponent)
        {
            return Handler(Methods.UpsertSubComponent, appComponent);
        }
        [HttpGet]
        [Route(Methods.GetSubComponent)]
        public AppsResult GetSubComponent(int appComponentId)
        {
            return Handler(Methods.GetSubComponent, appComponentId);
        }
    }
}