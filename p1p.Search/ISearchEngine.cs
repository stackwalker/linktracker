using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Search
{
    public interface ISearchEngine
    {
        List<SearchResult> Search(string query);        
    }
}
