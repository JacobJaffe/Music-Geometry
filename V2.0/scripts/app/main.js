/**
 * Created by JacobJaffe on 11/6/17.
 */

define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var music = require('./music');
    var coords = require('./coords');

    // Load library/vendor modules using
    // full IDs, like:
    // var print = require('print');
    music.setup();
});