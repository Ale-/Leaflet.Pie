/**
 *   Class representing a dataset
 *   @class
 *   @extends L.Class
 */

L.Pie.Dataset = L.Class.extend(
{

    categories        : [],

    options: {
        logarithmic_scale : true,
        scale_factor      : 0.1,
    },

    /** Constructor */
    initialize(options, categories){
        L.setOptions(this, options);
        this.categories = categories;
    },

    /** Calculate radius */
    calculate_radius(total){
        const radius = Math.sqrt( parseFloat(total) / Math.PI);
        return this.options.scale_factor * radius;
    },

});

/**
 *   Factory function that generates a new Dataset object
 */
L.Pie.dataset = function(options, categories){
    return new L.Pie.Dataset(options, categories);
}
