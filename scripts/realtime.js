// this file will connect us with the realtime database on
// firebase. The database will be within firestore
// in order to use it, we need to add the firestore SDK link in
// our HTML file and create a firestore const like we did for auth



var nameV, scoreV    // values of the input boxes in the HTML
 
function ready() {
   nameV = document.getElementById('idName').value;
   scoreV = document.getElementById('idScore').value;
}




 
/*
    SET UP MATERIALIZE COMPONENTS
    **  You only need this if you are using the Materialize styling and the code you
    use here depends on the materialize components you need to set up.  Since I only used
    modals, that is all I need to initialize.

    This function is listening for when you load the DOM.  At that point, all the modals 
    are queried.  Then, they are all initialized with the init function
*/

document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});
