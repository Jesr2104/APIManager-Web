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
    firebase.initializeApp(firebaseConfig);
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

// function to call the input file button
function defaultBtnActive(){
    defaultBtn.click();
}

// function to load the image on the visor
function loadImageOnVisor(){
    const fileImg = this.files[0];
    if(fileImg){
        const reader = new FileReader();
        reader.onload = function(){
            const result = reader.result;
            img.src = result;
            wrapper.classList.add("active");
        }
        reader.readAsDataURL(fileImg)
    }
    if(this.value){
        let valueStore = this.value;
        fileName.textContent = valueStore
    }
}

// function to clear the image of visor
function clearImage(){
    img.src = " "
    wrapper.classList.remove("active")
}

// function to upload the picture of the imageProduct
async function upLoadImaProduct(file){
    // 1. referencia al espacio en el bucket donde estara el archivo
    // 2. subir el archivo
    // 3. retornar la referencia

    try {
        let storageRef = firebase.storage().ref().child(`${endPointStore}/${file.name}`);
        await storageRef.put(file);

        // get back the refernce store
        return storageRef;
    } catch (error) {
        alert(error.message)        
    }
    return null    
}

// function to get the file
function getFile(){
    fileInput = document.querySelector("#default-btn")
    let file = fileInput.files[0];

    return file
}

// function to get all the products from the database a load it on the table
function getAllDataFromDB(){
    const dbRef = firebase.database().ref()
    dbRef.child(endPointDB).get().then((snapshot) => {
        if(snapshot.exists()) {
            var productList = [];
            snapshot.forEach(childSnapshot => {
                productList.push(childSnapshot.val())                       
            });
            loadDataOnTable(productList)
        } else { 
            // case: data base is empty
            console.log("No data available")
            productTable.innerHTML = ""
        }
    })
    .catch ((error) => {
        console.error(error);
    })    
}

// function to get the code of the category
function getCategory(categoryNumber){
    switch(categoryNumber) {
        case '0':
          return "Others";
        case '1':
            return "Fruit";     
        case '2':
            return "Vegetables";
        case '3':
            return "Fresh Herbs";
        case '4':
            return "Dried Fruit & Nuts";
        case '5':
            return "Mushrooms";
    }
}

//function to remove product from database
function remoreProductFromDataBase(Uid){
    deleteImageProduct(Uid)
    firebase.database().ref(`${endPointDB}/${Uid}`).remove()
}

// function to load the items of table from the database
function loadDataOnTable(productList){
    var cont = 1;
    productTable.innerHTML = ""

    productList.forEach((products) => {
        productTable.innerHTML += `
            <tr>
                <th>${cont}</th>
                <th><a href="url">${products.productName}</a></th>
                <th>${products.origin}</th>
                <th>${products.price}</th>
                <th>${products.discount}</th>
                <th>${products.MOQ}</th>
                <th>${getCategory(products.category)}</th>
                <th>${products.salesUnit}</th>
                <th>
                    <button class="button is-warning" id="${products.Uid}"><span class="material-icons md-24"> edit </span></button>
                    <button class="button is-danger" id="${products.Uid}"><span class="material-icons md-24"> delete </span></button>
                </th>
            </tr>`        
        cont++

        // set to the button to delete
        const deleteButtons = document.querySelectorAll('.is-danger')
        deleteButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                var idbutton = e.currentTarget.id

                swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this product!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        remoreProductFromDataBase(idbutton)
                        getAllDataFromDB()
                        swal("Poof! Your product has been deleted!", {
                        icon: "success",
                      });
                    } else {
                      swal("Your product is safe!");
                    }
                  });
            })
        })
    })
}

// function to getPostId
function getPostId(fullPath){
    const myData = fullPath.split("/")
    return myData[4]
}

// function to delete de imageProduct from the storage
function deleteImageProduct(Uid){
    var productList = [];
    var fileName = "";
    const dbRef = firebase.database().ref();
    const storageRef = firebase.storage().ref();

    // get que name of the imagen product
    dbRef.child(endPointDB).get().then((snapshot) => {
        if(snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                productList.push(childSnapshot.val())
            })
            
            productList.forEach((item) => {
                if(item.Uid == Uid){
                    fileName = item.imageProduct.split("/")[4];

                    // create reference to the store of the product Image
                    var desertRef = storageRef.child(`${endPointStore}/${fileName}`);
                    desertRef.delete();
                }
            })
        }
    })   
}

// vars
//--------------------------------------------------------------------------
const endPointDB = 'productListDB'
const endPointStore = 'ImageStore'
const openModal = document.getElementById('openRegisterModal')
const modal = document.getElementById('modal')
const closeModal = document.getElementById('closeRegisterModal')
const newProductForm = document.getElementById('newProduct-form')
const defaultBtn = document.getElementById('default-btn')
const img = document.getElementById('Image-load')
const cancelBtn = document.getElementById('cancel-btn')
const productTable = document.getElementById('products-table')

const fileName = document.querySelector('.fileName')
const wrapper = document.querySelector('.wrapper')

const checkAvailableButton = document.getElementById('isAvailableTrue')
const checkDisableButton = document.getElementById('isDisableTrue')
const checkSeasonButton = document.getElementById('inSeasonTrue')

// call to the main function
//--------------------------------------------------------------------------
    // Events control -------------------->>>>
    openModal.addEventListener('click', showRegisterModal)
    closeModal.addEventListener('click', showRegisterModal)
    defaultBtn.addEventListener('change', loadImageOnVisor)
    cancelBtn.addEventListener('click', clearImage)
    newProductForm.addEventListener('submit', async (e) => {

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
        var imageProduct = await upLoadImaProduct(getFile());          

        // refence of the data base
        const productRef = firebase.database().ref(endPointDB)
        const postRef = productRef.push() 

        // check the mandatory fields -> Product name, origin, price, discount, category, salesUnit, productImage 
        if(Boolean(productName.value) &&
            Boolean(origin.value) &&
            Boolean(price.value) &&
            Boolean(discount.value) &&
            !(category.value === "Select category") &&
            !(salesUnit.value === "Select option") &&
            imageProduct != null
        ){  
            postRef.set({
                Uid: getPostId(postRef.toString()),
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
                imageProduct: String(imageProduct)
            });

            showRegisterModal()
            getAllDataFromDB()   
        } 
        else{ alert('Any of the required fields are empty!!') }
    })

    // Function call  -------------------->>>>
    configuration()
    getAllDataFromDB()
//--------------------------------------------------------------------------