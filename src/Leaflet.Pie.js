//https://gist.github.com/mathewbyrne/1280286

L.Util.slugify = function(text){
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')      // Replace spaces with -
        .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
        .replace(/\-\-+/g, '-')    // Replace multiple - with single -
        .replace(/^-+/, '')        // Trim - from start of text
        .replace(/-+$/, '');       // Trim - from end of text
};


// Pie Dataset
L.PieDataset = L.Class.extend(
  {
    categories        : [],

    options: {
        logarithmic_scale : true,
        scale_factor      : 0.1,
    },

    initialize(options, categories){
        L.setOptions(this, options);
        this.categories = categories;
    },

    calculate_radius(total){
        const radius = Math.sqrt( parseFloat(total) / Math.PI);
        return this.options.scale_factor * radius;
    },

});

// Pie Dataset factory function
L.pieDataset = function(options, categories){
    return new L.PieDataset(options, categories);
}

// Pie
L.DivIcon.Pie = L.DivIcon.extend(
{
    options : {
        'dataset'    : {},
        'data'       : [],
        'className'  : 'leaflet-pie',
        'label'      : '',
    },

    initialize(options)
    {
        options.data_sum   = options.data.reduce( (x,y) => x+y );
        const pie_diameter = 2 * Math.floor( options.dataset.calculate_radius(options.data_sum) );
        options.iconSize   = [ pie_diameter, pie_diameter ]
        options.html       = this._drawPie(pie_diameter, options);
        L.setOptions(this, options);
    },

    _drawPie(diameter, options){
        var markup =  "<p class='leaflet-marker-icon__label'>" + options.label + "</p><svg class='leaflet-marker-icon__content leaflet-svg' width=" + diameter + " height=" + diameter + " viewBox='0 0 2 2'>";
        let angle = 0;
        let x = 1 + Math.cos(angle);
        let y = 1 + Math.sin(angle);
        for(var i = 0; i < options.data.length; i++){
            const angle_increment = options.data[i] * Math.PI * 2 / options.data_sum;
            const large_flag      = angle_increment > Math.PI ? 1 : 0;
            let path  = "<path class='leaflet-svg__arc leaflet-svg__arc--" + L.Util.slugify(options.dataset.categories[i].name) + "' fill='" + options.dataset.categories[i].col  + "' d='M " + x + " " + y + " A 1 1 0 ";
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

// Pie factory function
L.divIcon.pie = function(options){
    return new L.DivIcon.Pie(options);
}

L.pieMarker = function(coords, dataset, label, data){
    return L.marker(coords, {
        'icon' : L.divIcon.pie({ dataset, label, data }),
    });
};

L.Control.PieLegend = L.Control.extend(
{
    options: {
  			position    : 'topright',
        title       : '',
        description : '',
        source_text : '',
        source_url  : '',
        dataset     : {},
    },

    initialize(options) {
        L.setOptions(this, options);
    },

    _legend(){
        let list = "<ul>";
            this.options.dataset.categories.forEach( function(category){
                list += L.Util.template("<li class='{item_class}'><span class='icon' style='color: {item_color}'>■</span> <span>{item_name}</span></li>", {
                  item_class    : 'leaflet-pie-dataset-legend__legend-item',
                  item_color    :  category.col,
                  item_name     :  category.name,
                });
           });
        list += "</ul>";
        return list;
    },

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

L.Control.pieLegend = function(options){
    return new L.Control.PieLegend(options);
}
