/**
 *   Class representing a dataset
 *   @class
 *   @extends L.Class
 */

L.Pie.Dataset = L.Class.extend(
{
    data     : {},

    displays : {},

    legends  : {},

    /** Constructor */
    initialize(data){
        this.data = data;
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
        var sum           = item.data.reduce( (x,y) => x+y );
        var diam          = L.Pie.Util.pieDiameter(sum, display.scale_factor);
        // Create icon
        var pie = L.divIcon({
            className  : 'leaflet-pie',
            iconSize   : [diam, diam],
            iconAnchor : [diam/2, diam/2],
            html       : L.Pie.Util.drawPie(sum, diam, item.data, display),
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
