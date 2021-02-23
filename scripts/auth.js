

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



function signIn() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    console.log("Clicked sign in with " + email + " " + password);
    
    //Successful -> .then code
    //Unsuccessful -> catch code (catch error message)
    auth.signInWithEmailAndPassword(email, password).then(() => {
        console.log("Singed in " + email);

        document.getElementById("idLoginScreen").style.display = "none";
        document.getElementById("idDataScreen").style.display = "block";

    }).catch(e => console.log(e.message));

    
}


function signOut() {
    auth.signOut();
    console.log("Signed Out");

    document.getElementById("idLoginScreen").style.display = "block";
    document.getElementById("idDataScreen").style.display = "none";
}

const addForm = document.querySelector('#data-form');

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(addForm['idName'].value)

    db.collection('players').add({
        name: addForm['idName'].value,
        score: addForm['idScore'].value
        
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
