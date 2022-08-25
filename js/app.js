// Functions
//--------------------------------------------------------------------------
// function to show the field to insert new product
const showRegisterModal = () => {
    modal.classList.toggle('is-active')
}

// Firebase Configuration
async function configuration(){
    const firebaseConfig = {
        apiKey: "AIzaSyD38MhGW8-0NM4oRseY1xIrkI0Xj2-H464",
        authDomain: "grocerystore-justjump.firebaseapp.com",
        databaseURL: "https://grocerystore-justjump-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "grocerystore-justjump",
        storageBucket: "grocerystore-justjump.appspot.com",
        messagingSenderId: "496229318920",
        appId: "1:496229318920:web:98f64838f81f9744a32cbd"
      };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)
}

// vars
//--------------------------------------------------------------------------
const openModal = document.getElementById('openRegisterModal')
const modal = document.getElementById('modal')
const closeModal = document.getElementById('closeRegisterModal')
const newProductForm = document.getElementById('newProduct-form')

// call to the main function
//--------------------------------------------------------------------------
    // Events control -------------------->>>>
    openModal.addEventListener('click', showRegisterModal)
    closeModal.addEventListener('click', showRegisterModal)
    newProductForm.addEventListener('submit', (e) => (
        e.preventDefault()
    ))

    // Function call  -------------------->>>>
    configuration()
//--------------------------------------------------------------------------