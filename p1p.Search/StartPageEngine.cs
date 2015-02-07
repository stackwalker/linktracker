using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;

namespace p1p.Search
{
    internal class StartPageEngine : ISearchEngine
    {
        public List<SearchResult> Search(string query)
        {
            List<SearchResult> results = new List<SearchResult>();
            WebRequest request = HttpWebRequest.Create("http://www.startpage.com/do/metasearch.pl?query=" + query);
            WebResponse response = request.GetResponse();
            Stream stream = response.GetResponseStream();
            StreamReader rdr = new StreamReader(stream);
            string html = rdr.ReadToEnd();
            return results;
        }

        private List<SearchResult> parseResults(string html){
            return null;
        }
    }
}
