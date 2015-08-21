using System;
using DecisionTreeWebGeneral.Areas.Project.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DecisionTreeWebGeneral.Tests
{
    [TestClass]
    public class ProjectControllerTest
    {
        private static ProjectController c;

        [TestInitialize]
        public void setUp()
        {
            c = new ProjectController();
        }

        [TestMethod]
        public void ListProjects()
        {

        }
    }
}
