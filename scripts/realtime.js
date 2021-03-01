// this file will connect us with the realtime database on
// firebase. The database will be within firestore
// in order to use it, we need to add the firestore SDK link in
// our HTML file and create a firestore const like we did for auth

var gameNameV, consoleV, hoursPlayedV;    // values of the input boxes in the HTML
 
function ready() {
  gameNameV = document.getElementById('idGameNameUp').value;
  consoleV = document.getElementById('idConsoleNameUp').value;
  hoursPlayedV = document.getElementById('idGameHoursUp').value;
   
}


const logList = document.querySelector('.player');
const loggedOutLinks = document.querySelectorAll('.logged-out'); // need All bc there are > 1
const loggedInLinks = document.querySelectorAll('.logged-in');

/*
    SET UP UI 

    In this function we toggle the links based on whether the user is signed in or not
    This function is called from auth.js when the auth status changes. If someone logs in
    or logs out, then their auth status has changed, therefore this method is called and the 
    user auth token is passed to it.  If there is a user, then the first statement will show
    the links that have the class of logged-in and will hide the links with a class of logged-out.

    If the user isn't logged in, then nothing is passed to this function, therefore the else will
    execute, and in this case the links are toggled the other way.  
*/

const setupUI = (user) => {
  if (user) {
    // toggle UI elements with a forEach loop that will change the display to show or hide them
    loggedInLinks.forEach(item => item.style.display = 'block');  // show
    loggedOutLinks.forEach(item => item.style.display = 'none');  // hide

  }
  else {
    loggedInLinks.forEach(item => item.style.display = 'none');  // hide
    loggedOutLinks.forEach(item => item.style.display = 'block');  // sho
  }
}


const form = document.querySelector('#create-form');

/*
    GENERATE ONE ROW OF Player DATA

    This function generates each <li> row for the data in the database. Each time
    a player is added or deleted, the change in onSnapshot method call in onAuthStateChanged in
    auth.js.  When that add happens, this function is called and it is passed a parameter, 
    doc, which is the document that needs to be added.  This parameter contains the data for the 
    document in the database, which we can access via the .data() method and then the attribute 
    name after that such as: doc.data().name;

    So... what the function is doing is first creating the HTML tags that will be used to build up the
    row of data for this log to add.  After that, we add a attribute for data-id which is the unique ID
    value for the document that way later we have a way to connect it back to the database.  

    Next we set the text we want to display for this HTML element.
    After that, I set the class property for the HTML elements for their CSS styles
    From there, we begin building up the HTML that will be added to the DOM using the 
    append child tag.  We build up the <li> and then add the <li> to the <ul>

    Lastly, I added a listener for the delete "button" for each player.  This works by getting the
    gets unique id that we set as an attribute in its HTML tag.  Once we have that id, we have what we
    need to call the delete function from firestore on the 'logs' collection.


*/
function renderLog(doc) {

    let li = document.createElement('li');
    let gameName = document.createElement('span');
    let gameConsole = document.createElement('span');
    let gameHours = document.createElement('span');
    let deleteX = document.createElement('span');
    let newLine = document.createElement('br');
    let newLine2 = document.createElement('br');
    // we need to attach the UID to the li tag so that way if we need to 
    // access it later, we know which element it was

    // I am adding the string id in front of the UID because if the UID starts with a 
    // number instead of a letter, then it isn't a valid id and the query won't work when
    // trying to update or delete the document in the database
     
    const idVal = 'id' + doc.id;
    li.setAttribute('data-id', idVal);

    // Set the text for the elements to display
    gameName.textContent = 'Video game: ' + doc.data().videoGameName;
    gameConsole.textContent = 'Console: ' + doc.data().consoleName;
    gameHours.textContent = 'Hours Played: ' + doc.data().hoursPlayed;
    deleteX.textContent = 'Delete';

    // set the class for the styles to apply to the HTML tag
    deleteX.classList = 'deleteX';
    gameName.classList = 'logLI';
    gameConsole.classList = 'logLI';
    gameHours.classList = 'logLI';

    li.appendChild(gameName);
    li.appendChild(newLine);
    li.appendChild(gameConsole);
    li.appendChild(newLine2);
    li.appendChild(gameHours);
    li.appendChild(deleteX);
    logList.appendChild(li);

    // Add listener for the delete option
    deleteX.addEventListener('click', (e) => {
      e.stopPropagation();
      var id = e.target.parentElement.getAttribute('data-id');  
      id = id.substring(2);
      db.collection('player').doc(id).delete();
    })
    
  };

// SEARCH/SHOW DATA FUNCTIONALITY - ONCLICK
/*
    This code has two different search capabilities - first by
    idNum and then by name. The idea is that the user would type
    in a name (with the rest of the fields blank) and
    then press the show data button to have the rest of the info
    shown. They could also do the same thing with the
    id number.

    Using the where() function allows me to do a query and
    limit the values that are returned from the collection

    bad assumptions - name and id are unique. She didn't really
    design this project for multiple documents with same name / id


    When we call get(), we are getting a snapshot of the database,
    which is essentially an instance of the database (or collection)
    at that moment in time

    After getting this snapshot, you can iterate through the snapshot
    and see all the documents that are in it.
*/

function showData(){
   ready();
   console.log(gameNameV + " " + consoleV + " " + hoursPlayedV);
   db.collection('player').where("idGameNameUp", '==', gameNameV).get().then((snapshot) => {
       snapshot.forEach((doc) => {
           console.log(doc.id, " => ", doc.data());
           console.log(doc.data().idGameNameUp);
           document.getElementById('idGameNameUp').value = doc.data().videoGameName;
           document.getElementById('idConsoleNameUp').value = doc.data().consoleName;
           document.getElementById('idGameHoursUp').value = doc.data().hoursPlayed;
           
       });
   }).catch((e) => {
       console.log("Error getting game by name: ", e.message);
   });
}; 

// UPDATE FUNCTIONALITY - ONCLICK

function update(){
   ready();
   console.log(gameNameV + " " + consoleV + " " + hoursPlayedV);
   db.collection('player').where("idGameNameUp", '==', gameNameV).get().then((snapshot) => {
       snapshot.forEach((doc) => {
           console.log(doc.id, " => ", doc.data());
           // gets UID so we can locate the document to update it in collection
           const updateID = doc.id;
          console.log("Pain");
           // if any of these fields are empty, we then keep old value
           if (gameNameV == undefined) {
               gameNameV = doc.data().videoGameName;
           }
           if (consoleV == undefined) {
               consoleV = doc.data().consoleName;
           }
           if (idGameHours == undefined) {
               idGameHours = doc.data().hoursPlayed;
           }
 
           // sets new value to this existing student record.  Update will only
           // change the values we ask it to change. 
           db.collection('player').doc(updateID).update({
               videoGameName: gameNameV,
               consoleName: consoleV,
               hoursPlayed: hoursPlayedV,
           }).then(() => {
               console.log("Updated, new data:");
           }).catch(e => console.log(e.message));
       });
   });
   
};
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
