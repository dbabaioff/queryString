var QueryString = (function (){
    var QueryString,
        QS_SEPARATOR = ',',
        QS = {},

        _toObj = function() {
            var pairs = window.location.search.substring(1).split('&'),
                obj = {},
                pair,
                isMultiple = false;

            for (var i = 0, length = pairs.length; i < length; i++) {
                if (pairs[i] === '') {
                    continue;
                }

                pair = pairs[i].split('=');
                pair[1] = decodeURIComponent(pair[1]);
                isMultiple = (pair[1].split(QS_SEPARATOR).length !== 1);
                obj[decodeURIComponent(pair[0])] = (isMultiple) ? pair[1].split(QS_SEPARATOR) : [pair[1]];
            }

            QS = obj;
        },
        _serialize = function(obj) {
            var url = [],
                key;

            for (key in obj) {
                url.push(key + '=' + encodeURIComponent(obj[key]));
            }

            return url.join('&');
        },
        _inArray = function(elem, array) {
            if (array) {
                for (var i = 0, length = array.length; i < length; i++) {
                    if (i in array && array[i] === elem) {
                        return i;
                    }
        		}
            }

            return -1;
        },
        _apply = function() {
            window.location.search = _serialize(QS);

            return this;
        };

    // One-time init functions
    _toObj();

    QueryString = function() {};
    QueryString.prototype = {
        set: function(key, value) {
            if (this.isKey(key)) {
                if (_inArray(value, QS[key]) === -1) {
                    QS[key].push(value);
                }
            }
            else {
                QS[key] = value;
            }

            _apply();
        },
        get: function(key, _default) {
            if (typeof _default === 'undefined') {
                _default = '';
            }

            return (this.isKey(key)) ? QS[key] : _default;
        },
        remove: function(key, value) {
            if (!this.isKey(key)) {
                return;
            }

            for (var i = 0, length = QS[key].length; i < length; i++) {
                if (QS[key][i] == value) {
                    QS[key].splice(i, 1);
                    break;
                }
            }

            if (typeof value === 'undefined' || QS[key].length === 0) {
                delete QS[key];
            }

            _apply();
        },
        isKey: function(key) {
            return (QS.hasOwnProperty(key));
        }
    };

    return (new QueryString);
}());