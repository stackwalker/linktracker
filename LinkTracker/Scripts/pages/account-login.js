(function () {

    function initUi() {

        var number = Math.floor((Math.random()*9) + 1);
        $('body').addClass('bg' + number);
    }


    $(initUi);
}())