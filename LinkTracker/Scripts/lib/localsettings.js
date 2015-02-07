(function () {
    p1p.namespace("localsettings");

    p1p.localsettings.get = function (namespace, element, type, defaultSettings) {
        var localSettings = {};

        if (localStorage['localSettings']) {
            localSettings = JSON.parse(localStorage['localSettings']);
        }

        if (!localSettings[namespace]) {
            localSettings[namespace] = { elements: {} };
        }

        if (!localSettings[namespace].elements[element]) {
            localSettings[namespace].elements[element] = defaultSettings;
            localStorage['localSettings'] = JSON.stringify(localSettings);
        }

        switch (type) {
            case 'grid':
                return getGrid(namespace, element);
                break;
            case 'switch':
                return getSwitch(namespace, element);
                break;
            default:
                break;
        }
    }

    function getGrid(namespace, element) {
        var localSettings = JSON.parse(localStorage['localSettings']);
        return localSettings[namespace].elements[element];
    }

    function getSwitch(namespace, element) {
        var localSettings = JSON.parse(localStorage['localSettings']);
        return localSettings[namespace].elements[element];
    }

    p1p.localsettings.set = function (namespace, element, type, property, id, setting, alteration) {
        switch (type) {
            case 'grid':
                setGrid(namespace, element, property, id, setting, alteration);
                break;
            case 'switch':
                setSwitch(namespace, element, alteration);
                break;
            default:
                break;
        };
    }

    function setGrid(namespace, element, property, id, setting, alteration) {
        var localSettings = JSON.parse(localStorage['localSettings']);
        if (property === 'columns') {
            $.each(localSettings[namespace].elements[element].columns, function (i, column) {
                if (column.field === id) {
                    localSettings[namespace].elements[element].columns[i][setting] = alteration;
                }
            })
        }

        localStorage['localSettings'] = JSON.stringify(localSettings);
    }

    function setSwitch(namespace, element, alteration) {
        var localSettings = JSON.parse(localStorage['localSettings']);
        localSettings[namespace].elements[element] = alteration;
        localStorage['localSettings'] = JSON.stringify(localSettings);
    }

}());