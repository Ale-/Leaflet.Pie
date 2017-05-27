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
        options.html       = L.Pie.Util.drawPie(pie_diameter, options);
        L.setOptions(this, options);
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
