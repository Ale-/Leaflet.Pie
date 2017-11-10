/**
 *   Class representing a dataset
 *   @class
 *   @extends L.Class
 */

L.Pie.Dataset = L.Class.extend(
{
    data      : {},

    min_value : Number.MAX_VALUE,

    displays  : {},

    legends   : {},

    /** Constructor */
    initialize(data){
        this.data = data;
        // Get minimum and maximum value
        let min = Number.MAX_VALUE;
        data.forEach( function(item){
            item.sum = item.data.reduce( (x,y) => x+y );
            if(item.sum < min) min = item.sum;
        });
        this.min_value = min;
    },

    /** Get data */
    get(){
        return this.data;
    },

    /** Add display */
    addDisplay(label, conf){
        this.displays[label] = conf;
    },

    /** Add display */
    addLegend(label, conf, display){
        if(display)
            conf.categories = this.displays[display].categories;
        this.legends[label] = conf;
    },

    /** Get a marker */
    marker(item, display, map){
        let diam;
        if(display.compensation){
            diam = L.Pie.Util.compensated_diameter(item.sum, this.min_value, display.min_size);
        } else {
            diam = L.Pie.Util.scaled_diameter(item.sum, this.min_value, display.min_size);
        }
        // Create icon
        var pie = L.divIcon({
            className  : 'leaflet-pie',
            iconSize   : [diam, diam],
            iconAnchor : [diam/2, diam/2],
            html       : L.Pie.Util.drawPie(item.sum, diam, item.data, display),
        });
        // Create marker
        return L.marker(item.coords, { icon: pie});
    },

    /** Add display */
    displaySet(_display, map){
        let sum, diam;
        const display = this.displays[_display];
        for(let i in this.data){
            let item = this.data[i];
            let marker = this.marker(item, display);
            marker.addTo(map);
            if(display.popup)
                marker.bindPopup( display.popup(item) );
        };
    },

    /** Add display */
    displayLegend(legend, map){
        L.Pie.Control.datasetLegend(
            this.legends[legend]
        ).addTo(map);
    },
});

/**
 *   Factory function that generates a new Dataset object
 */
L.Pie.dataset = function(data){
    return new L.Pie.Dataset(data);
}
