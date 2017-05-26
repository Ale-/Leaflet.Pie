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
