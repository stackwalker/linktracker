using System;
using System.Collections.Generic;
using System.Linq;
using p1p.Data;
using p1p.Types.DTO;

namespace p1p.Business
{
    public class LandingPageRepository
    {
        public void Add(LandingPageDTO landingPage)
        {
            p1p.Data.LandingPage mdlLandingPage = (p1p.Data.LandingPage)P1PObjectMapper.Convert(landingPage, typeof(p1p.Data.LandingPage));
            mdlLandingPage.InsertDate = DateTime.Now;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                ctx.LandingPages.Add(mdlLandingPage);
                ctx.SaveChanges();
            }
        }

        public void Update(LandingPageDTO landingPage)
        {
            p1p.Data.LandingPage mdlLandingPage = (p1p.Data.LandingPage)P1PObjectMapper.Convert(landingPage, typeof(p1p.Data.LandingPage));
            p1p.Data.LandingPage match;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                match = ctx.LandingPages.Single(l => landingPage.Id == l.Id);
                ctx.Entry(match).CurrentValues.SetValues(mdlLandingPage);
                ctx.SaveChanges();
            }
        }

    }
}
