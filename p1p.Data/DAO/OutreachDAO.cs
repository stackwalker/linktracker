using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Objects;
using p1p.Types.DTO;

namespace p1p.Data
{
    public class OutreachDAO
    {
        public List<OutreachDTO> Search(int linkId, int projectId, int typeId, int actionId, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool onlyMine, int teamId, string userName)
        {
            ObjectResult<p1p.Data.Outreach> resultOutreaches;
            List<OutreachDTO> dtoOutreaches = new List<OutreachDTO>();

            using (P1PContext ctx = new P1PContext())
            {
                resultOutreaches = ctx.SearchOutreaches(linkId, projectId, typeId, actionId, startDate, endDate, onlyMine, teamId, userName);
                foreach (Outreach o in resultOutreaches)
                {
                    OutreachDTO outreach = new OutreachDTO()
                    {
                        Id = o.Id,
                        LinkId = o.LinkId,
                        OutreachAction = new KeyValueDTO()
                        {
                            Id = o.OutreachAction.Id,
                            Name = o.OutreachAction.Name
                        },
                        OutreachType = new KeyValueDTO()
                        {
                            Id = o.OutreachType.Id,
                            Name = o.OutreachType.Name
                        },
                        OutreachNotes = o.OutreachNotes,
                        AddedBy = o.AddedBy,
                        DateOutreached = o.DateOutreached,
                        InsertDate = o.InsertDate,
                        Link = new LinkDTO() {
                            Id = o.Link.Id,
                            TargetUrl = o.Link.TargetUrl
                        }
                    };

                    dtoOutreaches.Add(outreach);

                }
            }

            return dtoOutreaches;
        }
    }
}
