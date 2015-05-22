using System;
using DecisionTreeWeb.Model;
using DecisionTreeWebServer.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DecisionTreeWebServer.Tests
{
    [TestClass]
    public class SaveTreeTest
    {
        public Tree testTree;
        public IndexController ds;

        [TestInitialize]
        public void setUp()
        {
            ds = new IndexController();
            testTree = new Tree();

            testTree.cues.Add(new Cue()
            {
                name = "Test1",
                no = "1",
                yes = "0"
            });
            testTree.cues.Add(new Cue()
            {
                name = "Test2",
                no = "1",
                yes = "0"
            });
            testTree.cues.Add(new Cue()
            {
                name = "Test3",
                no = "1",
                yes = "0"
            });
            testTree.cues.Add(new Cue()
            {
                name = "Test4",
                no = "1",
                yes = "0"
            });
            testTree.cues.Add(new Cue()
            {
                name = "Test5",
                no = "0",
                yes = "0"
            });
        }

        [TestMethod]
        public void TestSave()
        {
            try
            {
                var res = ds.SaveTree(testTree);
                Assert.AreEqual(true, res);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
