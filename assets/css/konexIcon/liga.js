/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'facebook': '&#xe916;',
            'arrow_fill_right': '&#xe911;',
            'arrow_fill_left': '&#xe912;',
            'distance': '&#xe913;',
            'call': '&#xe914;',
            'mail': '&#xe915;',
            'arrow_right': '&#xe90f;',
            'arrow_left': '&#xe910;',
            'mision': '&#xe90d;',
            'x_twitter': '&#xe90e;',
            'collection': '&#xe907;',
            'delivery': '&#xe908;',
            'digital_loans': '&#xe909;',
            'electronic_wallet': '&#xe90a;',
            'payment_gateway': '&#xe90b;',
            'soat': '&#xe90c;',
            'turns': '&#xe906;',
            'values': '&#xe902;',
            'mission': '&#xe903;',
            'vision': '&#xe904;',
            'local_phone': '&#xe900;',
            'pin_drop': '&#xe901;',
            'menu': '&#xe905;',
            'instagram': '&#xea92;',
            'youtube': '&#xea9d;',
            'linkedin': '&#xeac9;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/icon_/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
