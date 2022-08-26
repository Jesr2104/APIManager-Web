// Functions
//--------------------------------------------------------------------------
// function to show the field to insert new product
const showRegisterModal = () => {
    modal.classList.toggle('is-active')
}

// function to do Firebase Configuration
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

// function to check available
function checkAvailable(){
    return checkAvailableButton.checked;
}

// function to check Disable
function checkDisable(){
    return checkDisableButton.checked;
}

// function to check Season
function checkSeason(){
    return checkSeasonButton.checked;
}

// vars
//--------------------------------------------------------------------------
const endPointDB = 'NewProduct'
const openModal = document.getElementById('openRegisterModal')
const modal = document.getElementById('modal')
const closeModal = document.getElementById('closeRegisterModal')
const newProductForm = document.getElementById('newProduct-form')

const checkAvailableButton = document.getElementById('isAvailableTrue')
const checkDisableButton = document.getElementById('isDisableTrue')
const checkSeasonButton = document.getElementById('inSeasonTrue')

// call to the main function
//--------------------------------------------------------------------------
    // Events control -------------------->>>>
    openModal.addEventListener('click', showRegisterModal)
    closeModal.addEventListener('click', showRegisterModal)
    newProductForm.addEventListener('submit', (e) => {

        e.preventDefault()

        // collect form information
        const productName = document.getElementById("productName");
        const origin = document.getElementById("origin");

        const price = document.getElementById("price");
        const MOQ = document.getElementById("MOQ");
        const discount = document.getElementById("discount");

        const category = document.getElementById("category");
        const salesUnit = document.getElementById("salesUnit");

        const isAvailable = document.getElementById("isAvailable");
        const isDisable = document.getElementById("isDisable");
        const inSeason = document.getElementById("inSeason");
        
        const description = document.getElementById("description");

        // load image of the product
        // const productImage = await upLoadImaProduct(getFile());          

        // refence of the data base
        const productRef = firebase.database().ref(endPointDB)
        const postRef = productRef.push()

        // check the mandatory fields -> Product name, origin, price, discount, category, salesUnit, productImage 
        if(Boolean(productName.value) &&
            Boolean(origin.value) &&
            Boolean(price.value) &&
            Boolean(discount.value) &&
            !(category.value === "Select category") &&
            !(salesUnit.value === "Select option") /* &&
            Boolean(productImage.value)
            */
        ){
            postRef.set({
                idProduct: uuid.v4(),
                productName: productName.value,
                origin: origin.value,
                price: price.value,
                MOQ: MOQ.value,
                discount: discount.value,
                category: category.value,
                salesUnit: salesUnit.value,
                isAvailable: checkAvailable(),
                isDisable: checkDisable(),
                inSeason: checkSeason(),
                description: description.value,
            });
    
            alert("Successfully inserted")
            showRegisterModal()        
        } 
        else
        {
            alert('Any of the required fields are empty!!')
        }
    })

    // Function call  -------------------->>>>
    configuration()
//--------------------------------------------------------------------------