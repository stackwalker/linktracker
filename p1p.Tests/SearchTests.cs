using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using p1p.Search;

namespace p1p.Tests
{
    [TestClass]
    public class SearchTests
    {
        [TestMethod]
        public void SearchSimpleQuery()
        {
            string query = "mountains";
            ISearchEngine engine = SearchProviderFactory.CreateDefault();

            List<SearchResult> results = engine.Search(query);

            if (results.Count < 1)
            {
                Assert.Fail("No search results returned");
            }            
        }
    }
}
