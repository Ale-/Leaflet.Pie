/**
 *   Class representing the legend of a given Pie Dataset
 *   @class
 *   @extends L.Control
 */

L.Pie.Control.DatasetLegend = L.Control.extend(
{
    options: {
  			position    : 'topright',
        title       : '',
        description : '',
        source_text : '',
        source_url  : '',
        labels      : [],
        dataset     : {},
    },

    /** Constructor */
    initialize(options) {
        L.setOptions(this, options);
    },

    /** Returns legend markup */
    _legend(){
        let list = "<ul>";
            this.options.categories.forEach( function(cat){
                list += L.Util.template("<li class='{item_class}'><span class='icon' style='color: {item_color}'>■</span> <span>{item_name}</span></li>", {
                  item_class    : 'leaflet-pie-dataset-legend__legend-item',
                  item_color    :  cat.color,
                  item_name     :  cat.label,
                });
           });
        list += "</ul>";
        return list;
    },

    /** Returns source markup */
    _source(){
        const is_text = this.options.source_text != '';
        const is_link = this.options.source_url  != '';
        let source = "";
        if(is_text){
            let source = '';
            if(is_link)
                source = "<a href='{s_url}' target='_blank'>{s_txt}</a>";
            else
                source = "<a href='{s_url} target='_blank'>{s_txt}</a>";
            return L.Util.template("<span class='sl_cl'>Source: </span>" + source, {
                s_url : this.options.source_url,
                s_txt : this.options.source_text,
            });
        }
        return ""
    },

    /** Creates control markup */
    onAdd(){
        this._container = L.DomUtil.create('div', 'leaflet-pie-dataset-legend');
        this._container.innerHTML = L.Util.template(
            '<h1 class="{t_cl}">{t}</h1><p class="{p_cl}">{d}</p><div class="{l_cl}">{l}</div><div class="{s_cl}">{s}</div>', {
            t    : this.options.title,
            d    : this.options.description,
            l    : this._legend(),
            s    : this._source(),
            t_cl : 'leaflet-pie-dataset-legend__title',
            p_cl : 'leaflet-pie-dataset-legend__description',
            l_cl : 'leaflet-pie-dataset-legend__legend',
            s_cl : 'leaflet-pie-dataset-legend__source'
        });
        return this._container;
    },
});

/**
 *   Factory function that generates a new Pie.Icon
 */
L.Pie.Control.datasetLegend = function(options){
    return new L.Pie.Control.DatasetLegend (options);
}
