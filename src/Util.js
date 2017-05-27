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

/** Returns the markup of the Icon. **/
L.Pie.Util.drawPie = function(diameter, options, className){
    var markup = "<svg class='" + className + "' width=" + diameter + " height=" + diameter + " viewBox='0 0 2 2'>";
    let angle = 0;
    let x = 1 + Math.cos(angle);
    let y = 1 + Math.sin(angle);
    for(var i = 0; i < options.data.length; i++){
        const angle_increment = options.data[i] * Math.PI * 2 / options.data_sum;
        const large_flag      = angle_increment > Math.PI ? 1 : 0;
        let path  = "<path class='" + className + "__dataitem' fill='" + options.dataset.categories[i].col  + "' d='M " + x + " " + y + " A 1 1 0 ";
        angle    += angle_increment;
        x         = 1 + Math.cos(angle);
        y         = 1 + Math.sin(angle);
        path     += large_flag + " 1 " + x + " " + y + " L 1 1 Z' />";
        markup   += path;
    }
    markup += "</svg>";

    return markup;
};
