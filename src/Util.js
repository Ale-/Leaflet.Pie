/**
 * Slugifies a string
 * @param {string} text - string to be slugified
 * @see https://gist.github.com/mathewbyrne/1280286
 */

L.Pie.Util.slugify = function(text){
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')      // Replace spaces with -
        .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
        .replace(/\-\-+/g, '-')    // Replace multiple - with single -
        .replace(/^-+/, '')        // Trim - from start of text
        .replace(/-+$/, '');       // Trim - from end of text
};

/** Calculates pie radius **/
L.Pie.Util.pieDiameter = function(total, scale_factor){
    const diam = Math.sqrt( parseFloat(total) / Math.PI) * 2;
    return scale_factor * diam;
};

/** Returns the markup of the Icon. **/
L.Pie.Util.drawPie = function(sum, diameter, data, display){
    var markup = "<div class='lpie-icon'><svg class='lpie-icon__pie' width=" + diameter + " height=" + diameter + " viewBox='0 0 2 2'>";
    let angle = 0;
    let x = 1 + Math.cos(angle);
    let y = 1 + Math.sin(angle);
    for(var i = 0; i < data.length; i++){
        const angle_increment = data[i] * Math.PI * 2 / sum;
        const large_flag      = angle_increment > Math.PI ? 1 : 0;
        markup   += "<path class='lpie-icon__slice cat--" + L.Pie.Util.slugify(display.categories[i].label) + "'" +
                    (display.hover_callback ? (" onmouseover='" + display.hover_callback + "(this, this.parent)'") : '') +
                    " data-value='" + data[i] + "'data-category='" + display.categories[i].label +
                    "' data-color='" + display.categories[i].color +"' fill='" + display.categories[i].color +
                    "' d='M " + x + " " + y + " A 1 1 0 ";
        angle  += angle_increment;
        x       = 1 + Math.cos(angle);
        y       = 1 + Math.sin(angle);
        markup += large_flag + " 1 " + x + " " + y + " L 1 1 Z' />";
    }
    markup += "</svg>";
    if(display.default_hover){
        markup += "<ul class='lpie-icon__tooltip " + (display.hover_classes ? display.hover_classes : '') + " '>";
        for(var i = 0; i < data.length; i++){
            markup += "\
            <li class='lpie-icon__tooltip-item'>\
                <p class='lpie-icon__tooltip-label'>\
                    <i class='lpie-icon__tooltip-color-icon' style='color: " + display.categories[i].color + "'></i>" +
                    display.categories[i].label +
                "</p>\
                <p class='lpie-icon__tooltip-value'>" +
                    data[i] + " " + display.units +
                "</p>\
            </li>";
        }
        return markup + '</ul></div>';
    }
    return markup + '</div>';
};
