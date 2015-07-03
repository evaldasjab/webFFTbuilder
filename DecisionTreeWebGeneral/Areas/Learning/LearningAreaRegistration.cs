using System.Web.Mvc;

namespace DecisionTreeWebGeneral.Areas.Learning
{
    public class LearningAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Learning";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Learning_default",
                "Learning/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
