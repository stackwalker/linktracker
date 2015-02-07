using System;
using System.Web;
using System.Web.Optimization;

namespace p1p
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            
            bundles.Add(new ScriptBundle("~/bundles/template").Include(
                "~/Scripts/lib/template/jquery-ui-1.10.3.js",
                "~/Scripts/lib/template/bootstrap.js",
                "~/Scripts/lib/template/library/jquery.flot.js",
                "~/Scripts/lib/template/library/jquery.flot.pie.js",
                "~/Scripts/lib/template/library/jquery.flot.selection.js",
                "~/Scripts/lib/template/library/jquery.flot.resize.js",
                "~/Scripts/lib/template/library/jquery.flot.orderBars.js"));

            bundles.Add(new ScriptBundle("~/bundles/kendo").Include(
                "~/Scripts/lib/kendo/js/jquery.min.js",
                "~/Scripts/lib/kendo/js/kendo.all.min.js",
                "~/Scripts/lib/kendo/js/jquery.js",
                "~/Scripts/lib/kendo/js/kendo.all.js"));
           

            bundles.Add(new StyleBundle("~/bundles/themecss").Include(
                "~/Content/css/bootstrap-responsive.css",
                "~/Content/css/bootstrap.css",
                "~/Content/css/stylesheet.css",
                "~/Content/icon/font-awesome.css"));

            bundles.Add(new StyleBundle("~/bundles/kendocss").Include(
                "~/Scripts/lib/kendo/styles/kendo.default.css",
                "~/Scripts/lib/kendo/styles/kendo.common.css",
                "~/Scripts/lib/kendo/styles/kendo.default.min.css",
                "~/Scripts/lib/kendo/styles/kendo.common.min.css"));
        }
    }
}