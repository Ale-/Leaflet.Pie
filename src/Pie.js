/**
 *   Class representing a leaflet icon holding a SVG rendered pie chart
 *   @class
 *   @extends L.DivIcon
 */
L.Pie.Icon = L.DivIcon.extend(
{
    options : {
        'dataset'    : {},
        'data'       : [],
        'className'  : 'leaflet-pie',
        'label'      : '',
    },

    /** Constructor */
    initialize(options)
    {
        options.data_sum   = options.data.reduce( (x,y) => x+y );
        const pie_diameter = 2 * Math.floor( options.dataset.calculate_radius(options.data_sum) );
        options.iconSize   = [ pie_diameter, pie_diameter ]
        options.html       = this._drawPie(pie_diameter, options);
        L.setOptions(this, options);
    },

    /** Returns the markup of the Icon. **/
    _drawPie(diameter, options){
        var markup =  "<p class='leaflet-marker-icon__label'>" + options.label + "</p><svg class='leaflet-marker-icon__content leaflet-svg' width=" + diameter + " height=" + diameter + " viewBox='0 0 2 2'>";
        let angle = 0;
        let x = 1 + Math.cos(angle);
        let y = 1 + Math.sin(angle);
        for(var i = 0; i < options.data.length; i++){
            const angle_increment = options.data[i] * Math.PI * 2 / options.data_sum;
            const large_flag      = angle_increment > Math.PI ? 1 : 0;
            let path  = "<path class='leaflet-svg__arc leaflet-svg__arc--" + L.Pie.Util.slugify(options.dataset.categories[i].name) + "' fill='" + options.dataset.categories[i].col  + "' d='M " + x + " " + y + " A 1 1 0 ";
            angle    += angle_increment;
            x         = 1 + Math.cos(angle);
            y         = 1 + Math.sin(angle);
            path     += large_flag + " 1 " + x + " " + y + " L 1 1 Z' />";
            markup   += path;
        }
        markup += "</svg>";

        return markup;
    },

});

/**
 *   Factory function that generates a new Pie.Icon
 */
L.Pie.icon = function(options){
    return new L.Pie.Icon(options);
}

/**
 *   Factory function that generates a new marker with a Pie icon
 */
L.Pie.marker = function(coords, dataset, label, data){
    return L.marker(coords, {
        'icon' : L.Pie.icon({ dataset, label, data }),
    });
};
