/**
 *  Leaflet.Pie 0.1
 *  (c) 2017 Ale González
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (typeof L === "undefined") {
  L = {};
}

L.Pie = {
  version: '0.1.0',
  Control: {},
  Util: {}
};

if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
  module.exports = L.Pie;
} else if (typeof define === 'function' && define.amd) {
  define(L.Pie);
}
'use strict';

/**
 * Slugifies a string
 * @param {string} text - string to be slugified
 * @see https://gist.github.com/mathewbyrne/1280286
 */

L.Pie.Util.slugify = function (text) {
    return text.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/** Calculates pie radius **/
L.Pie.Util.scaled_diameter = function (value, min_value, wished_min_diameter) {
    var real_min_diameter = Math.sqrt(parseFloat(min_value)) * 2 / Math.PI;
    var scale_factor = wished_min_diameter / real_min_diameter;
    return Math.sqrt(parseFloat(value)) * 2 * scale_factor / Math.PI;
};

/** Calculates Flannery-compensated magnitude **/
L.Pie.Util.compensated_diameter = function (value, min_value, min_diameter) {
    return 1.0083 * Math.pow(value / min_value, 0.5716) * min_diameter;
};

/** Returns the markup of the Icon. **/
L.Pie.Util.drawPie = function (sum, diameter, data, display) {
    var markup = "<div class='lpie-icon'><svg class='lpie-icon__pie' width=" + diameter + " height=" + diameter + " viewBox='0 0 2 2'>";
    var angle = 0;
    var x = 1 + Math.cos(angle);
    var y = 1 + Math.sin(angle);
    for (var i = 0; i < data.length; i++) {
        var angle_increment = data[i] * Math.PI * 2 / sum;
        var large_flag = angle_increment > Math.PI ? 1 : 0;
        markup += "<path class='lpie-icon__slice cat--" + L.Pie.Util.slugify(display.categories[i].label) + "'" + (display.hover_callback ? " onmouseover='" + display.hover_callback + "(this, this.parent)'" : '') + " data-value='" + data[i] + "'data-category='" + display.categories[i].label + "' data-color='" + display.categories[i].color + "' fill='" + display.categories[i].color + "' d='M " + x + " " + y + " A 1 1 0 ";
        angle += angle_increment;
        x = 1 + Math.cos(angle);
        y = 1 + Math.sin(angle);
        markup += large_flag + " 1 " + x + " " + y + " L 1 1 Z' />";
    }
    markup += "</svg>";
    if (display.default_hover) {
        markup += "<ul class='lpie-icon__tooltip " + (display.hover_classes ? display.hover_classes : '') + " '>";
        for (var i = 0; i < data.length; i++) {
            markup += "\
            <li class='lpie-icon__tooltip-item'>\
                <p class='lpie-icon__tooltip-label'>\
                    <i class='lpie-icon__tooltip-color-icon' style='color: " + display.categories[i].color + "'></i>" + display.categories[i].label + "</p>\
                <p class='lpie-icon__tooltip-value'>" + data[i] + " " + display.units + "</p>\
            </li>";
        }
        return markup + '</ul></div>';
    }
    return markup + '</div>';
};
'use strict';

/**
 *   Class representing a dataset
 *   @class
 *   @extends L.Class
 */

L.Pie.Dataset = L.Class.extend({
    data: {},

    min_value: Number.MAX_VALUE,

    displays: {},

    legends: {},

    /** Constructor */
    initialize: function initialize(data) {
        this.data = data;
        // Get minimum and maximum value
        var min = Number.MAX_VALUE;
        data.forEach(function (item) {
            item.sum = item.data.reduce(function (x, y) {
                return x + y;
            });
            if (item.sum < min) min = item.sum;
        });
        this.min_value = min;
    },


    /** Get data */
    get: function get() {
        return this.data;
    },


    /** Add display */
    addDisplay: function addDisplay(label, conf) {
        this.displays[label] = conf;
    },


    /** Add display */
    addLegend: function addLegend(label, conf, display) {
        if (display) conf.categories = this.displays[display].categories;
        this.legends[label] = conf;
    },


    /** Get a marker */
    marker: function marker(item, display, map) {
        var diam = void 0;
        if (display.compensation) {
            diam = L.Pie.Util.compensated_diameter(item.sum, this.min_value, display.min_size);
        } else {
            diam = L.Pie.Util.scaled_diameter(item.sum, this.min_value, display.min_size);
        }
        // Create icon
        var pie = L.divIcon({
            className: 'leaflet-pie',
            iconSize: [diam, diam],
            iconAnchor: [diam / 2, diam / 2],
            html: L.Pie.Util.drawPie(item.sum, diam, item.data, display)
        });
        // Create marker
        return L.marker(item.coords, { icon: pie });
    },


    /** Add display */
    displaySet: function displaySet(_display, map) {
        var sum = void 0,
            diam = void 0;
        var display = this.displays[_display];
        for (var i in this.data) {
            var item = this.data[i];
            var marker = this.marker(item, display);
            marker.addTo(map);
            if (display.popup) marker.bindPopup(display.popup(item));
        };
    },


    /** Add display */
    displayLegend: function displayLegend(legend, map) {
        L.Pie.Control.datasetLegend(this.legends[legend]).addTo(map);
    }
});

/**
 *   Factory function that generates a new Dataset object
 */
L.Pie.dataset = function (data) {
    return new L.Pie.Dataset(data);
};
'use strict';

/**
 *   Class representing the legend of a given Pie Dataset
 *   @class
 *   @extends L.Control
 */

L.Pie.Control.DatasetLegend = L.Control.extend({
    options: {
        position: 'topright',
        title: '',
        description: '',
        source_text: '',
        source_url: '',
        labels: [],
        dataset: {},
        legend_classes: ''
    },

    /** Constructor */
    initialize: function initialize(options) {
        L.setOptions(this, options);
    },


    /** Returns legend markup */
    _legend: function _legend() {
        var list = "<ul class='lpie-legend__categories'>";
        this.options.categories.forEach(function (cat) {
            list += L.Util.template("<li class='{i_cl}'><span class={co_cl} style='color: {item_color}'></span><span class='{ca_cl}'>{item_name}</span></li>", {
                i_cl: 'lpie-legend__categories-item',
                item_color: cat.color,
                item_name: cat.label,
                co_cl: 'lpie-legend__color-icon',
                ca_cl: 'lpie-legend__categories-label'
            });
        });
        list += "</ul>";
        return list;
    },


    /** Returns source markup */
    _source: function _source() {
        var is_text = this.options.source_text != '';
        var is_link = this.options.source_url != '';
        var source = "";
        if (is_text) {
            var _source2 = '';
            if (is_link) _source2 = "<a href='{s_url}' target='_blank'>{s_txt}</a>";else _source2 = "<a href='{s_url} target='_blank'>{s_txt}</a>";
            return L.Util.template("<span class='sl_cl'>Source: </span>" + _source2, {
                s_url: this.options.source_url,
                s_txt: this.options.source_text
            });
        }
        return "";
    },


    /** Creates control markup */
    onAdd: function onAdd() {
        this._container = L.DomUtil.create('div', 'lpie-legend ' + this.options.legend_classes);
        this._container.innerHTML = L.Util.template('<p class="{t_cl}">{t}</p><p class="{p_cl}">{d}</p>{l}<div class="{s_cl}">{s}</div>', {
            t: this.options.title,
            d: this.options.description,
            l: this._legend(),
            s: this._source(),
            t_cl: 'lpie-legend__title',
            p_cl: 'lpie-legend__description',
            s_cl: 'lpie-legend__source'
        });
        return this._container;
    }
});

/**
 *   Factory function that generates a new Pie.Icon
 */
L.Pie.Control.datasetLegend = function (options) {
    return new L.Pie.Control.DatasetLegend(options);
};