/**
 *   Class representing the legend of a given Pie Dataset
 *   @class
 *   @extends L.Control
 */

L.Pie.Control.DatasetLegend = L.Control.extend(
{
    options: {
  			position       : 'topright',
        title          : '',
        description    : '',
        source_text    : '',
        source_url     : '',
        labels         : [],
        dataset        : {},
        legend_classes : '',
    },

    /** Constructor */
    initialize(options) {
        L.setOptions(this, options);
    },

    /** Returns legend markup */
    _legend(){
        let list = "<ul class='lpie-legend__categories'>";
        this.options.categories.forEach( function(cat){
            list += L.Util.template("<li class='{i_cl}'><span class={co_cl} style='color: {item_color}'></span><span class='{ca_cl}'>{item_name}</span></li>", {
              i_cl       : 'lpie-legend__categories-item',
              item_color :  cat.color,
              item_name  :  cat.label,
              co_cl      : 'lpie-legend__color-icon',
              ca_cl      : 'lpie-legend__categories-label',
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
        this._container = L.DomUtil.create('div', 'lpie-legend ' + this.options.legend_classes);
        this._container.innerHTML = L.Util.template(
            '<p class="{t_cl}">{t}</p><p class="{p_cl}">{d}</p>{l}<div class="{s_cl}">{s}</div>', {
            t    : this.options.title,
            d    : this.options.description,
            l    : this._legend(),
            s    : this._source(),
            t_cl : 'lpie-legend__title',
            p_cl : 'lpie-legend__description',
            s_cl : 'lpie-legend__source'
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
