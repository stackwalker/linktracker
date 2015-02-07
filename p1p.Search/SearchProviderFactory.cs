using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Search
{
    public static class SearchProviderFactory
    {
        public static ISearchEngine CreateDefault()
        {
            //TODO eventually do some dependency injection action here but for now we'll return
            //the only instance we have
            return new StartPageEngine();
            
        }

        //Allow client to override the default if desired
        public static ISearchEngine Create(SearchEngineType type)
        {            
            switch (type)
            {
                case SearchEngineType.StartPage:
                    return new StartPageEngine();
                    break;
                default:
                    return new StartPageEngine();
                    break;
            }
        }
    }
}
