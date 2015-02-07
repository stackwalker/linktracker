using System;
using System.Collections.Generic;
using System.Linq;
using p1p.Data;
using p1p.Types.DTO;

namespace p1p.Business
{
    public class StaticDataRepository
    {
        public List<KeyValueDTO> GetBillingCycles()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from bc in ctx.BillingCycles
                            select bc)
                            .AsEnumerable()
                            .Select(bc => (KeyValueDTO)P1PObjectMapper.Convert(bc, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }

        public List<KeyValueDTO> GetSiteCategories()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from sc in ctx.SiteCategories
                        select sc)
                        .AsEnumerable()
                        .Select(sc => (KeyValueDTO)P1PObjectMapper.Convert(sc, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }

        public List<KeyValueDTO> GetLinkLocations()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                // Removes undefined
                return (from ll in ctx.LinkLocations where ll.Id != 1
                        select ll)
                        .AsEnumerable()
                        .Select(ll => (KeyValueDTO)P1PObjectMapper.Convert(ll, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }

        public List<KeyValueDTO> GetLinkStatuses()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from ls in ctx.LinkStatuses
                        select ls)
                        .AsEnumerable()
                        .Select(ls => (KeyValueDTO)P1PObjectMapper.Convert(ls, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }

        public List<KeyValueDTO> GetOutreachActions()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from oa in ctx.OutreachActions
                        select oa)
                        .AsEnumerable()
                        .Select(oa => (KeyValueDTO)P1PObjectMapper.Convert(oa, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }

        public List<KeyValueDTO> GetOutreachTypes()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from ot in ctx.OutreachTypes
                        select ot)
                        .AsEnumerable()
                        .Select(ot => (KeyValueDTO)P1PObjectMapper.Convert(ot, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }

        public List<KeyValueDTO> GetLinkTypes()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                // Removes undefined
                return (from lt in ctx.LinkTypes where lt.Id != 1
                        select lt)
                        .AsEnumerable()
                        .Select(lt => (KeyValueDTO)P1PObjectMapper.Convert(lt, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }

        public List<KeyValueDTO> GetLinkStrategies()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                // Removes undefined
                return (from ls in ctx.LinkStrategies where ls.Id != 1
                        select ls)
                        .AsEnumerable()
                        .Select(ls => (KeyValueDTO)P1PObjectMapper.Convert(ls, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }

        public List<KeyValueDTO> GetLinkBuildingModes()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from m in ctx.LinkBuildingModes
                        select m)
                        .AsEnumerable()
                        .Select(m => (KeyValueDTO)P1PObjectMapper.Convert(m, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }

        public List<KeyValueDTO> GetArticleStatuses()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from s in ctx.ArticleStatuses select s)
                    .AsEnumerable()
                    .Select(s => (KeyValueDTO)P1PObjectMapper.Convert(s, typeof(KeyValueDTO))).ToList<KeyValueDTO>();
            }
        }
    }
}
