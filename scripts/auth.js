
/*This file will contain all the JS that will communicate with 
the firebase firestore database and also firebase auth that is needed to authenticate
authorized users.  If you don't use auth, then some of this code is not needed.
*/

auth.onAuthStateChanged(user => {
    //  if the user was logged out, then user parameter will be null
    //  if the user is logged in, then user parameter will equal a reference to their account (auth token)

        if (user) {
        // get data if a valid user is logged in
            //setupUI(user);      // display correct links in navbar based on login status

            /*
            In this section of code, we are getting the logs collection and then calling the onSnapshot method.
            This will grab a current snapshot of the state of the database.  This is done every time there is a
            change to the database, but only if the user is logged in.

            Because we are using the onSnapshot method, this will execute every time there is a change to the database.  
            This will be what causes our web app to update in real time.  So IF the user is logged in, and a change is made,
            then the user will see it on the web app.

            The parameter snapshot refers to a current static copy of the database at this exact moment in time.
            docChanges is a method that is called of the snapshot and we are using a for each loop to cycle through
            all the changes for each entry of the log.  If the change was 'added', we need to call renderLog to add a 
            new Student <li> entry to our display.  If the change was 'removed', we need to query that specific <li> tag
            from the DOM and remove it so it is removed from the display.  If you were also allowing the display to update
            in realtime, then you would have another option here for 'modified'.

            The else statement for the top function is what to do if the user is NOT logged in.  In this case
            we want to make sure that the logs do NOT display and that the UI displays the appropriate links to Log in or 
            Sign up
            */
            db.collection('player').onSnapshot(snapshot => {
                
                let changes = snapshot.docChanges();
                // based on change made, either add to display or remove from display
                changes.forEach(change => {
                   if (change.type == 'added') {
                       renderLog(change.doc)
                       
                    }
                    else if (change.type == 'removed') {
                        // finding the li in the DOM of the document that was just removed
                        const idToRemove = 'id' + change.doc.id;

                        let li = logList.querySelector('[data-id=' + idToRemove + ']');
                        // remove this li from the ul
                        logList.removeChild(li);
                    }
                    // if an entry was updated, the change type is 'modified'
                    // if you wanted to listen for changes in the db, you'd need this added it if statement
                })
            });
        }
        else {
            setupUI();  // don't send anything so it will evaluate to false in the method
            setupLogs([]);
        }
    });

/*
    This function creates a new account using a new email and password and saves it on firebase.
    The account can then be used to log into this program once created.

*/
const signupForm = document.querySelector('#signUp-form');

function signUp() {
    var email = document.getElementById("signUpEmail").value;
    var password = document.getElementById("signUpPassword").value;
    console.log("Clicked signup with " + email + " " + password);

    //Successful -> .then code
    //Unsuccessful -> catch code (catch error message)
    auth.createUserWithEmailAndPassword(email, password).then(() => {
        console.log("Signed up " + email);
        const modal = document.querySelector('#modalSignUp');
        M.Modal.getInstance(modal).close();
        signupForm.reset(); 
    }).catch(e => console.log(e.message));
}


/*
    This function logs the account(if registered) into the program and changes to the login screen to the data screen
*/
function signIn() {
    var email = document.getElementById("idEmail").value;
    var password = document.getElementById("idPassword").value;
    
    console.log("Clicked sign in with " + email + " " + password);
    
    //Successful -> .then code
    //Unsuccessful -> catch code (catch error message)
    auth.signInWithEmailAndPassword(email, password).then(() => {
        console.log("Signed in " + email);
        
        document.getElementById("idEmail").value = "";
        document.getElementById("idPassword").value = "";
        document.getElementById("idLoginScreen").style.display = "none";
        document.getElementById("idUpdateDataScreen").style.display = "none";
        document.getElementById("idDataScreen").style.display = "block";

    }).catch(e => console.log(e.message));

    
}

/*This function signs out of the account being used and takes the user back to the login screen
*/
function signOut() {
    auth.signOut();
    console.log("Signed Out");

    document.getElementById("idLoginScreen").style.display = "block";
    document.getElementById("idDataScreen").style.display = "none";
    document.getElementById("idUpdateDataScreen").style.display = "none";
}

/*
    This form is used to add the video game name, console name, and hours played onto the firebase storage

*/
const addForm = document.querySelector('#data-form');

addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('player').add({
        videoGameName: addForm['idGameName'].value,
        consoleName: addForm['idConsoleName'].value,
        hoursPlayed: addForm['idGameHours'].value
        
    }).then(()=> {
        // get a reference to the open modal
        const modal = document.querySelector('#modal-add');
        // using the Material library methods, we close the modal
        M.Modal.getInstance(modal).close();
        // call the JS method reset to clear the form
        addForm.reset();
        
    }).catch(err => {
        console.log(err.message);
        // this will catch any errors that might come back from firebase when trying
        // to add, and if it doesn't work, then it will log the error message 
    })
})


/*
*/
function toUpdateScreen(){
    document.getElementById("idLoginScreen").style.display = "none";
    document.getElementById("idDataScreen").style.display = "none";
    document.getElementById("idUpdateDataScreen").style.display = "block";
}

/*
*/
function backToDataScreen(){
    document.getElementById("idLoginScreen").style.display = "none";
    document.getElementById("idDataScreen").style.display = "block";
    document.getElementById("idUpdateDataScreen").style.display = "none";
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
