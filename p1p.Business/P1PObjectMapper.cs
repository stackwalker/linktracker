using System;
using System.Collections.Generic;

namespace p1p.Business
{
    public static class P1PObjectMapper
    {
        private static Dictionary<System.Type, Func<object, object>> typeMap;

        static P1PObjectMapper()
        {
            typeMap = new Dictionary<Type, Func<object, object>>();
            typeMap.Add(typeof(p1p.Data.Link), convertLinkToModel);
            typeMap.Add(typeof(p1p.Types.DTO.LinkDTO), convertLinkToDTO);
            typeMap.Add(typeof(p1p.Data.Customer), convertCustomerToModel);
            typeMap.Add(typeof(p1p.Types.DTO.CustomerDTO), convertCustomerToDTO);
            typeMap.Add(typeof(p1p.Data.Employee), convertEmployeeToModel);
            typeMap.Add(typeof(p1p.Types.DTO.EmployeeDTO), convertEmployeeToDTO);
            typeMap.Add(typeof(p1p.Data.LandingPage), convertLandingPageToModel);
            typeMap.Add(typeof(p1p.Types.DTO.LandingPageDTO), convertLandingPageToDTO);
            typeMap.Add(typeof(p1p.Data.Outreach), convertOutreachToModel);
            typeMap.Add(typeof(p1p.Types.DTO.OutreachDTO), convertOutreachToDTO);
            typeMap.Add(typeof(p1p.Data.Project), convertProjectToModel);
            typeMap.Add(typeof(p1p.Types.DTO.ProjectDTO), convertProjectToDTO);
            typeMap.Add(typeof(p1p.Data.Team), convertTeamToModel);
            typeMap.Add(typeof(p1p.Types.DTO.TeamDTO), convertTeamToDTO);
            typeMap.Add(typeof(p1p.Data.TimeEntry), convertTimeEntryToModel);
            typeMap.Add(typeof(p1p.Types.DTO.TimeEntryDTO), convertTimeEntryToDTO);
            typeMap.Add(typeof(p1p.Types.DTO.KeyValueDTO), convertKeyValueToDTO);
            typeMap.Add(typeof(p1p.Types.DTO.ArticleDTO), convertArticleToDTO);
            typeMap.Add(typeof(p1p.Data.Article), convertArticleToModel);
            typeMap.Add(typeof(p1p.Types.DTO.SocialAccountDTO), convertSocialAccountToDTO);
            typeMap.Add(typeof(p1p.Data.SocialAccount), convertSocialAccountToModel);
            typeMap.Add(typeof(p1p.Data.Persona), convertPersonaToModel);
            typeMap.Add(typeof(p1p.Types.DTO.PersonaDTO), convertPersonaToDTO);
            typeMap.Add(typeof(p1p.Data.Keyword), convertKeywordToModel);
            typeMap.Add(typeof(p1p.Types.DTO.KeywordDTO), convertKeywordToDTO);
        }

        public static object Convert(object src, System.Type type)
        {
            return typeMap[type](src);
        }

        private static object convertKeywordToModel(object src)
        {
            p1p.Types.DTO.KeywordDTO dto = (p1p.Types.DTO.KeywordDTO)src;
            p1p.Data.Keyword mdl = new Data.Keyword();

            mdl.Id = dto.Id;
            mdl.Text = dto.Text;
            return mdl;
        }

        private static object convertKeywordToDTO(object src)
        {
            p1p.Types.DTO.KeywordDTO dto = new Types.DTO.KeywordDTO();
            p1p.Data.Keyword mdl = (p1p.Data.Keyword)src;

            dto.Id = mdl.Id;
            dto.Text = mdl.Text;

            foreach (p1p.Data.ProjectKeywordXREF x in mdl.ProjectKeywordXREFs)
            {
                dto.ProjectPriority = x.KeywordPriority;
            }

            
            foreach (p1p.Data.LandingPageKeywordXREF x in mdl.LandingPageKeywordXREFs)
            {
                dto.LandingPagePriority = x.KeywordPriority;
                dto.LandingPageId = x.LandingPageId;
            }

            return dto;
        }

        private static object convertPersonaToModel(object src)
        {
            p1p.Types.DTO.PersonaDTO dto = (p1p.Types.DTO.PersonaDTO)src;
            p1p.Data.Persona mdl = new Data.Persona();

            mdl.Bio = dto.Bio;
            mdl.ConnectionToCustomer = dto.ConnectionToCustomer;
            mdl.DateOfBirth = dto.DateOfBirth;
            mdl.DomainUsername = dto.DomainUsername;
            mdl.DomainPassword = dto.DomainPassword;
            mdl.Experience = dto.Experience;
            mdl.GmailUsername = dto.GmailUsername;
            mdl.GmailPassword = dto.GmailPassword;
            mdl.Id = dto.Id;
            mdl.Name = dto.Name;
            mdl.Notes = dto.Notes;
            mdl.Email = dto.Email;
            mdl.SMTPServer = dto.SMTPServer;
            mdl.SMTPPort = dto.SMTPPort;
            mdl.SMTPUsername = dto.SMTPUsername;
            mdl.SMTPPassword = dto.SMTPPassword;
            return mdl;
        }

        private static object convertPersonaToDTO(object src)
        {
            p1p.Types.DTO.PersonaDTO dto = new Types.DTO.PersonaDTO();
            p1p.Data.Persona mdl = (p1p.Data.Persona)src;

            dto.Id = mdl.Id;
            dto.Experience = mdl.Experience;
            dto.DateOfBirth = mdl.DateOfBirth;
            dto.Bio = mdl.Bio;
            dto.ConnectionToCustomer = mdl.ConnectionToCustomer;
            dto.DomainPassword = mdl.DomainPassword;
            dto.DomainUsername = mdl.DomainUsername;
            dto.GmailPassword = mdl.GmailPassword;
            dto.GmailUsername = mdl.GmailUsername;
            dto.Name = mdl.Name;
            dto.Notes = mdl.Notes;
            dto.Email = mdl.Email;
            dto.SMTPServer = mdl.SMTPServer;
            if (mdl.SMTPPort != null)
            {
                dto.SMTPPort = (int)mdl.SMTPPort;
            }
            dto.SMTPUsername = mdl.SMTPUsername;
            dto.SMTPPassword = mdl.SMTPPassword;

            return dto;
        }

        private static object convertSocialAccountToModel(object src)
        {
            p1p.Types.DTO.SocialAccountDTO dto = (p1p.Types.DTO.SocialAccountDTO)src;
            p1p.Data.SocialAccount mdl = new Data.SocialAccount();

            mdl.Id = dto.Id;
            mdl.Name = dto.Name;
            mdl.Password = dto.Password;
            mdl.Url = dto.Url;
            mdl.Username = dto.Username;

            return mdl;
        }

        private static object convertSocialAccountToDTO(object src)
        {
            p1p.Types.DTO.SocialAccountDTO dto = new p1p.Types.DTO.SocialAccountDTO();
            p1p.Data.SocialAccount mdl = (p1p.Data.SocialAccount)src;

            dto.Id = mdl.Id;
            dto.Name = mdl.Name;
            dto.Password = mdl.Password;
            dto.Url = mdl.Url;
            dto.Username = mdl.Username;
            
            return dto;
        }
              
        private static object convertKeyValueToDTO(dynamic src)
        {
            p1p.Types.DTO.KeyValueDTO kvp = new p1p.Types.DTO.KeyValueDTO();
            kvp.Id = src.Id;
            kvp.Name = src.Name;
            return kvp;
        }

        private static object convertTimeEntryToDTO(object src)
        {
            p1p.Data.TimeEntry mdl = (p1p.Data.TimeEntry)src;
            p1p.Types.DTO.TimeEntryDTO dto = new Types.DTO.TimeEntryDTO();

            dto.Activity = mdl.Activity;
            dto.Elapsed = mdl.Elapsed;
            dto.EndTime = mdl.EndTime;
            dto.Id = mdl.Id;
            dto.IsTimeOff = mdl.IsTimeOff;
            dto.Note = mdl.Note;
            dto.ProjectId = mdl.ProjectId;
            dto.StartTime = mdl.StartTime;
            dto.UserId = mdl.UserId;
            dto.InsertDate = mdl.InsertDate;

            return dto;
        }

        private static object convertTimeEntryToModel(object src)
        {
            p1p.Types.DTO.TimeEntryDTO dto = (p1p.Types.DTO.TimeEntryDTO)src;
            p1p.Data.TimeEntry mdl = new Data.TimeEntry();

            mdl.Activity = dto.Activity;
            mdl.Elapsed = dto.Elapsed;
            mdl.EndTime = dto.EndTime;
            mdl.Id = dto.Id;
            mdl.IsTimeOff = dto.IsTimeOff;
            mdl.Note = dto.Note;
            mdl.ProjectId = dto.ProjectId;
            mdl.StartTime = dto.StartTime;
            mdl.UserId = dto.UserId;
            mdl.InsertDate = dto.InsertDate;

            return mdl;
        }

        private static object convertTeamToDTO(object src)
        {
            p1p.Data.Team mdl = (p1p.Data.Team)src;
            p1p.Types.DTO.TeamDTO dto = new p1p.Types.DTO.TeamDTO();
            
            dto.Id = mdl.Id;
            dto.Name = mdl.Name;
            dto.InsertDate = mdl.InsertDate;

            return dto;
        }

        private static object convertTeamToModel(object src)
        {
            p1p.Types.DTO.TeamDTO dto = (p1p.Types.DTO.TeamDTO)src;
            p1p.Data.Team mdl = new Data.Team();

            mdl.Id = dto.Id;
            mdl.Name = dto.Name;
            mdl.InsertDate = dto.InsertDate;

            return mdl;
        }

        private static object convertProjectToDTO(object src)
        {
            p1p.Data.Project mdl = (p1p.Data.Project)src;
            p1p.Types.DTO.ProjectDTO dto = new Types.DTO.ProjectDTO();
            
            dto.Customer = new p1p.Types.DTO.CustomerDTO() { Id = mdl.Customer.Id, BusinessName = mdl.Customer.BusinessName };
            dto.Categories = new List<p1p.Types.DTO.KeyValueDTO>();
            foreach (p1p.Data.OrderCategoryXREF x in mdl.OrderCategoryXREFs)
            {
                dto.Categories.Add(new p1p.Types.DTO.KeyValueDTO()
                {
                    Id = x.CategoryId,
                    Name = x.SiteCategory.Name
                });
            }
            dto.CustomerId = mdl.CustomerId;
            dto.BillingCycle = new p1p.Types.DTO.KeyValueDTO() { Id = mdl.BillingCycle.Id, Name = mdl.BillingCycle.Name };
            dto.DateCreated = mdl.DateCreated;
            dto.Description = mdl.Description;
            dto.Id = mdl.Id;
            dto.IsActive = mdl.IsActive;
            dto.Name = mdl.Name;
            dto.InsertDate = mdl.InsertDate;
            dto.Team = new Types.DTO.TeamDTO();
            dto.BigWin = mdl.BigWin;
            dto.SpecialRequirements = mdl.SpecialRequirements;
            dto.Strategy = mdl.Strategy;

            return dto;
        }

        private static object convertProjectToModel(object src)
        {
            p1p.Types.DTO.ProjectDTO dto = (p1p.Types.DTO.ProjectDTO)src;
            p1p.Data.Project mdl = new Data.Project();

            mdl.CustomerId = dto.CustomerId;
            mdl.BillingCycleId = dto.BillingCycle.Id;
            mdl.DateCreated = dto.DateCreated;
            mdl.Description = dto.Description;
            mdl.Id = dto.Id;
            mdl.IsActive = dto.IsActive;
            mdl.Name = dto.Name;
            mdl.InsertDate = dto.InsertDate;
            mdl.BigWin = dto.BigWin;
            mdl.SpecialRequirements = dto.SpecialRequirements;
            mdl.Strategy = dto.Strategy;

            return mdl;
        }

        private static object convertOutreachToDTO(object src)
        {
            p1p.Data.Outreach mdl = (p1p.Data.Outreach)src;
            p1p.Types.DTO.OutreachDTO dto = new Types.DTO.OutreachDTO();
            dto.Link = new Types.DTO.LinkDTO();
            if (mdl.Link != null)
            {
                dto.Link = (p1p.Types.DTO.LinkDTO)convertLinkToDTO(mdl.Link);
            }
            if (mdl.OutreachAction != null)
            {
                dto.OutreachAction = new p1p.Types.DTO.KeyValueDTO() { Id = mdl.OutreachAction.Id, Name = mdl.OutreachAction.Name };
            }
            if (mdl.ArticleId != null)
            {
                dto.ArticleId = (int)mdl.ArticleId;
            }
            if (mdl.PersonaId != null)
            {
                dto.PersonaId = (int)mdl.PersonaId;
            }
            dto.AddedBy = mdl.AddedBy;
            dto.DateOutreached = mdl.DateOutreached;
            dto.Id = mdl.Id;
            dto.LinkId = mdl.LinkId;
            dto.OutreachNotes = mdl.OutreachNotes;
            dto.OutreachType = new p1p.Types.DTO.KeyValueDTO() { Id = mdl.OutreachType.Id, Name = mdl.OutreachType.Name };
            dto.InsertDate = mdl.InsertDate;

            return dto;
        }

        private static object convertOutreachToModel(object src)
        {
            p1p.Types.DTO.OutreachDTO dto = (p1p.Types.DTO.OutreachDTO)src;
            p1p.Data.Outreach mdl = new p1p.Data.Outreach();

            mdl.OutreachActionId = dto.OutreachAction.Id;
            mdl.AddedBy = dto.AddedBy;
            mdl.DateOutreached = dto.DateOutreached;
            mdl.Id = dto.Id;
            mdl.LinkId = dto.LinkId;
            mdl.OutreachNotes = dto.OutreachNotes;
            mdl.OutreachTypeId = dto.OutreachType.Id;
            mdl.InsertDate = dto.InsertDate;
            mdl.EmailBody = dto.EmailBody;
            mdl.EmailRecipient = dto.EmailRecipient;

            if (dto.PersonaId < 1)
            {
                mdl.PersonaId = null;
            }
            else
            {
                mdl.PersonaId = dto.PersonaId;
            }           
            
            if (dto.ArticleId < 1)
            {
                mdl.ArticleId = null;
            }
            else
            {
                mdl.ArticleId = dto.ArticleId;
            }

            return mdl;
        }

        private static object convertLandingPageToDTO(object src)
        {
            p1p.Data.LandingPage mdl = (p1p.Data.LandingPage)src;
            p1p.Types.DTO.LandingPageDTO dto = new Types.DTO.LandingPageDTO();

            dto.Id = mdl.Id;
            dto.LandingPageUrl = mdl.LandingPageUrl;
            dto.InsertDate = mdl.InsertDate;
            foreach (p1p.Data.ProjectLandingPageXREF x in mdl.ProjectLandingPageXREFs)
            {
                dto.Priority = x.LandingPagePriority;
            }

            return dto;
        }

        private static object convertLandingPageToModel(object src)
        {
            p1p.Types.DTO.LandingPageDTO dto = (p1p.Types.DTO.LandingPageDTO)src;
            p1p.Data.LandingPage mdl = new Data.LandingPage();

            mdl.Id = dto.Id;
            mdl.LandingPageUrl = dto.LandingPageUrl;
            mdl.InsertDate = dto.InsertDate;

            return mdl;
        }

        private static object convertEmployeeToDTO(object src)
        {
            p1p.Data.Employee mdl = (p1p.Data.Employee)src;
            p1p.Types.DTO.EmployeeDTO dto = new Types.DTO.EmployeeDTO();

            dto.Email = mdl.Email;
            dto.Id = mdl.Id;
            dto.FirstName = mdl.FirstName;
            dto.Username = mdl.Username;
            dto.InsertDate = mdl.InsertDate;
            dto.LastName = mdl.LastName;

            return dto;
        }

        private static object convertEmployeeToModel(object src)
        {
            p1p.Types.DTO.EmployeeDTO dto = (p1p.Types.DTO.EmployeeDTO)src;
            p1p.Data.Employee mdl = new p1p.Data.Employee();

            mdl.Email = dto.Email;
            mdl.Id = dto.Id;
            mdl.FirstName = dto.FirstName;
            mdl.Username = dto.Username;
            mdl.InsertDate = dto.InsertDate;
            mdl.LastName = dto.LastName;

            return mdl;
        }

        private static object convertCustomerToDTO(object src)
        {
            p1p.Data.Customer mdl = (p1p.Data.Customer)src;
            p1p.Types.DTO.CustomerDTO dto = new Types.DTO.CustomerDTO();

            dto.StreetAddress = mdl.StreetAddress;
            dto.Email = mdl.Email;
            dto.Id = mdl.Id;
            dto.BusinessName = mdl.BusinessName;
            dto.Phone = mdl.Phone;
            dto.Username = mdl.Username;
            dto.WebsiteURL = mdl.WebsiteURL;
            dto.InsertDate = mdl.InsertDate;
            dto.FirstName = mdl.FirstName;
            dto.LastName = mdl.LastName;
            dto.City = mdl.City;
            dto.State = mdl.State;
            dto.Zip = mdl.Zip;
            
            return dto;
        }

        private static object convertCustomerToModel(object src)
        {
            p1p.Types.DTO.CustomerDTO dto = (p1p.Types.DTO.CustomerDTO)src;
            p1p.Data.Customer mdl = new Data.Customer();

            mdl.StreetAddress = dto.StreetAddress;
            mdl.Email = dto.Email;
            mdl.Id = dto.Id;
            mdl.BusinessName = dto.BusinessName;
            mdl.Phone = dto.Phone;
            mdl.Username = dto.Username;
            mdl.WebsiteURL = dto.WebsiteURL;
            mdl.InsertDate = dto.InsertDate;
            mdl.FirstName = dto.FirstName;
            mdl.LastName = dto.LastName;
            mdl.City = dto.City;
            mdl.State = dto.State;
            mdl.Zip = dto.Zip;

            return mdl;
        } 

        private static object convertLinkToDTO(object src)
        {
            p1p.Data.Link mdl = (p1p.Data.Link)src;
            p1p.Types.DTO.LinkDTO dto = new Types.DTO.LinkDTO();

            if (mdl.Project != null)
            {
                dto.Project = (p1p.Types.DTO.ProjectDTO)convertProjectToDTO(mdl.Project);
            }
            dto.AcquiredBy = mdl.AcquiredBy;
            dto.AnchorText = mdl.AnchorText;
            dto.ContactEmail = mdl.ContactEmail;
            dto.ContactPhone = mdl.ContactPhone;
            dto.ContactUrl = mdl.ContactUrl;
            dto.DateFound = mdl.DateFound;
            dto.DateLastModified = mdl.DateLastModified;
            dto.DatePublished = mdl.DatePublished;
            dto.DomainAuthority = mdl.DomainAuthority;
            dto.FoundBy = mdl.FoundBy;
            dto.Id = mdl.Id;
            dto.LandingPage = mdl.LandingPage;
            dto.LastModifiedBy = mdl.LastModifiedBy;
            dto.LinkStrategy = new p1p.Types.DTO.KeyValueDTO() { Id = mdl.LinkStrategy.Id, Name = mdl.LinkStrategy.Name };
            dto.LinkType = new p1p.Types.DTO.KeyValueDTO() { Id = mdl.LinkType.Id, Name = mdl.LinkType.Name };
            dto.LinkLocation = new p1p.Types.DTO.KeyValueDTO() { Id = mdl.LinkLocation.Id, Name = mdl.LinkLocation.Name };
            dto.LinkBuildingMode = new Types.DTO.KeyValueDTO() { Id = mdl.LinkBuildingMode.Id, Name = mdl.LinkBuildingMode.Name };
            dto.Notes = mdl.Notes;
            dto.PageRelevance = mdl.PageRelevance;
            dto.ProjectId = mdl.ProjectId;
            dto.PublishedUrl = mdl.PublishedUrl;
            dto.RootMethod = mdl.RootMethod;
            dto.RootUrl = mdl.RootUrl;
            dto.SiteRelevance = mdl.SiteRelevance;
            dto.LinkStatus = new p1p.Types.DTO.KeyValueDTO() { Id = mdl.LinkStatus.Id, Name = mdl.LinkStatus.Name };
            dto.TargetUrl = mdl.TargetUrl;
            dto.InsertDate = mdl.InsertDate;
            dto.Article = new p1p.Types.DTO.ArticleDTO();
            if (mdl.ProjectArticleXREF != null)
            {
                dto.Article.Id = mdl.ProjectArticleXREF.ArticleId;
                dto.Article.Title = mdl.ProjectArticleXREF.Article.Title;
            }
            dto.IsWinner = mdl.IsWinner;

            return dto;
        }

        private static object convertLinkToModel(object src)
        {
            p1p.Types.DTO.LinkDTO dto = (p1p.Types.DTO.LinkDTO)src;
            p1p.Data.Link mdl = new Data.Link();

            mdl.AcquiredBy = dto.AcquiredBy;
            mdl.AnchorText = dto.AnchorText;
            mdl.ContactEmail = dto.ContactEmail;
            mdl.ContactPhone = dto.ContactPhone;
            mdl.ContactUrl = dto.ContactUrl;
            mdl.DateFound = dto.DateFound;
            mdl.DateLastModified = dto.DateLastModified;
            mdl.DatePublished = dto.DatePublished;
            mdl.DomainAuthority = dto.DomainAuthority;
            mdl.FoundBy = dto.FoundBy;
            mdl.Id = dto.Id;
            mdl.LandingPage = dto.LandingPage;
            mdl.LastModifiedBy = dto.LastModifiedBy;
            mdl.LinkStrategyId = dto.LinkStrategy.Id;
            if (mdl.LinkStrategyId == 0)
            {
                mdl.LinkStrategyId = 1;
            }
            mdl.LinkTypeId = dto.LinkType.Id;
            if (mdl.LinkTypeId == 0)
            {
                mdl.LinkTypeId = 1;
            }
            mdl.LinkLocationId = dto.LinkLocation.Id;
            if (mdl.LinkLocationId == 0)
            {
                mdl.LinkLocationId = 1;
            }
            mdl.LinkBuildingModeId = dto.LinkBuildingMode.Id;
            mdl.Notes = dto.Notes;
            mdl.PageRelevance = dto.PageRelevance;
            mdl.ProjectId = dto.ProjectId;
            mdl.PublishedUrl = dto.PublishedUrl;
            mdl.RootMethod = dto.RootMethod;
            mdl.RootUrl = dto.RootUrl;
            mdl.SiteRelevance = dto.SiteRelevance;
            mdl.LinkStatusId = dto.LinkStatus.Id;
            mdl.TargetUrl = dto.TargetUrl;
            mdl.InsertDate = dto.InsertDate;
            mdl.IsWinner = dto.IsWinner;
            return mdl;
        }

        private static object convertArticleToDTO(object src)
        {
            p1p.Data.Article mdl = (p1p.Data.Article)src;
            p1p.Types.DTO.ArticleDTO dto = new Types.DTO.ArticleDTO();

            dto.Id = mdl.Id;
            dto.Title = mdl.Title;
            dto.CreatedBy = mdl.CreatedBy;
            dto.ArticleStatusId = mdl.ArticleStatusId;
            dto.Content = mdl.Content;
            dto.CreatedDate = mdl.CreatedDate;

            return dto;
        }

        private static object convertArticleToModel(object src)
        {
            p1p.Types.DTO.ArticleDTO dto = (p1p.Types.DTO.ArticleDTO)src;
            p1p.Data.Article mdl = new Data.Article();

            mdl.Id = dto.Id;
            mdl.Title = dto.Title;
            mdl.CreatedBy = dto.CreatedBy;
            mdl.ArticleStatusId = dto.ArticleStatusId;
            mdl.Content = dto.Content;
            mdl.CreatedDate = dto.CreatedDate;

            return mdl;
        }
        
    }
}
