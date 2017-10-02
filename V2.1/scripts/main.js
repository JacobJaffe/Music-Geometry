/**
 * Created by JacobJaffe on 9/24/17.
 */

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: './scripts/',

    paths: {
        app: '../app'
    }
});

// Start the main app logic.
requirejs(['controller', 'shapes'],
    function   ($,        canvas,   sub) {
        console.log("test");
    });