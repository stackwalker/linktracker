/// <reference path="p1p.js" />
(function () {
    p1p.namespace('sharedcontrols');

    p1p.sharedcontrols.errorWindow = function (message) {
        //check to see if there is currently an overlay in place
        if ($('body').hasClass('working')) {
            $('body').removeClass('working');
        }

        $('#p1p-error-content').html(message);

        $('#p1p-error .p1p-error-close').click(function () {
            $('body').removeClass('error');
        });

        $('body').addClass('error');
    };

    p1p.sharedcontrols.loaderWindow = function () {
        var loaderWindow = {};
        
        loaderWindow.start = function () {
            $('body').addClass('working');
        };

        loaderWindow.stop = function () {
            $('body').removeClass('working');
        };
        
        return loaderWindow;
    };

    //jQuery Plugins
    //=====================================
    $.fn.p1pCommandButton = function (clickHandler) {
        var btn = {};
        var isEnabled = true;
        var self = this;

        btn.disable = function () {
            isEnabled = false;
            $(self).addClass('k-state-disabled');
        }

        btn.enable = function () {
            isEnabled = true;
            $(self).removeClass('k-state-disabled');
        }

        $(this).click(function () {
            if (isEnabled) {
                clickHandler();
            }
        });

        $(this).data('p1pCommandButton', btn);
        return btn;
    };

    //Global Event Handlers - This probably belongs somewhere else
    $(document).ajaxError(function (event, jqxhr, settings, exception) {
        p1p.sharedcontrols.errorWindow(exception);
    });

    $(document).ajaxComplete(function (event, jqxhr, settings, exception) {
        p1p.globalEvents.serverProcessComplete.fire();        
    });

    $(document).ajaxSend(function (event, jqxhr, settings, exception) {
        p1p.globalEvents.serverProcessing.fire();        
    });
}());