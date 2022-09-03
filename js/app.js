/**
---------------------------------------------------------------------------------------------------
Lista de tareas por realizar
---------------------------------------------------------------------------------------------------
2. permitir que modificar permita cambiar la foto del producto
    a) seleccionar foto nueva
    b) cambiarla en el visor de imagenes 
    c) eliminar la foto anterior del storage the imagenes
3. eliminar el borde de la imagen en el visor de añadir nuevo producto
4. crear visor para mostrar el objeto completo con todos sus atributos detallados 
---------------------------------------------------------------------------------------------------
**/

// vars
//--------------------------------------------------------------------------
const endPointDB = 'productListDB'
const endPointStore = 'ImageStore'

// Modals
//==========================================================================
const modalInsertProduct = document.getElementById('modal-insert-product')
const modalUpdateProduct = document.getElementById('modal-update-product')
const modalShowDetails = document.getElementById('modal-show-details')
//==========================================================================

// button to Insert New Product
const insertProduct_btn = document.getElementById('insertProduct')

// close the modals Buttons
const closeModalInsertProduct_btn = document.getElementById('closeRegisterModal')
const closeModalUpdateProduct_btn = document.getElementById('closeUpdateModal')

// const to the form (newProduc - UpdateProduct - ShowDetails)
const insertProductForm = document.getElementById('newProduct-form')
const updateProductForm = document.getElementById('updateProduct-form')
const showDetailsForm = document.getElementById('showDetails-form')

// const images on forms
const visor_InsertForm = document.getElementById('Image-load') // Insert Product Form
const visor_UpdateForm = document.getElementById('Image-load-udate-form') // Update Product Form

//const table to load the data
const productTable = document.getElementById('products-table')

// file selector default button
const defaultBtn = document.getElementById('default-btn')

// const to de button to clear image visor
const clearVisor_btn = document.getElementById('cancel-btn')

// refence of the filename 
const fileName = document.querySelector('.fileName')

// reference to the image visor
const wrapper = document.querySelector('.wrapper')

// Const to form -> Insert new product
//--------------------------------------------------------------------------
const productName = document.getElementById("productName");
const productOrigin = document.getElementById("origin");
const price = document.getElementById("price");
const MOQ = document.getElementById("MOQ");
const discount = document.getElementById("discount");
const category = document.getElementById("category");
const salesUnit = document.getElementById("salesUnit");
const description = document.getElementById("description");

// Functions
//--------------------------------------------------------------------------

// funcion to show and close de Insert Product
function showModal_InsertProduct(){ clearInsertForm(); modalInsertProduct.classList.add('modal-insert-product'); }
function closeModal_InsertProduct(){ modalInsertProduct.classList.remove('modal-insert-product'); }

// funcion to show and close de Update Modal
function showModal_UpdateProduct(){ modalUpdateProduct.classList.add('modal-update-product') }
function closeModal_UpdateProduct(){ modalUpdateProduct.classList.remove('modal-update-product') }

// funcion to show and close de Show Details Modal
function showModal_showDetails(){ modalShowDetails.classList.add('modal-show-details'); }
function closeModal_showDetails(){ modalShowDetails.classList.remove('modal-show-details'); }

// function to clear all the form fields
function clearInsertForm(){
    productName.value = "";
    productOrigin.value = "";
    price.value = "";
    MOQ.value = "";
    discount.value = "";
    category.value = "Select category";
    salesUnit.value = "Select option";
    description.value = "";
    clearImage();
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

// function to load the image on the visor
function loadImageOnVisor(){
    const fileImg = this.files[0];
    if(fileImg){
        const reader = new FileReader();
        reader.onload = function(){
            const result = reader.result;
            visor_InsertForm.src = result;
            wrapper.classList.add("active");
        }
        reader.readAsDataURL(fileImg)
    }
    if(this.value){
        let valueStore = this.value;
        fileName.textContent = valueStore
    }
}

// function to call the input file button
function defaultBtnActive(){
    defaultBtn.click();
}

// function to clear the image of visor
function clearImage(){
    visor_InsertForm.src = " "
    wrapper.classList.remove("active")
}

// function to upload the picture of the imageProduct
async function upLoadImaProduct(file){
    // 1. referencia al espacio en el bucket donde estara el archivo
    // 2. subir el archivo
    // 3. retornar la Url de la imagen

    if(file != null){
        try {
            let storageRef = firebase.storage().ref().child(`${endPointStore}/${file.name}`);
            await storageRef.put(file);
            // and before to return the value download the url from the server and return the value
            return await storageRef.getDownloadURL();
        } catch (error) {
            alert(error.message)        
        }
    }
    return null    
}

//function to remove product from database
function remoreProductFromDataBase(Uid){
    // function to delete the fiche from the storage
    deleteImageProduct(Uid)
    // reference to delete the rest on the information to the firebase
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
                <th style="font-style: italic;"><a class="details-product" id="${products.Uid}">${products.productName}</a></th>
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

        // showLink to see the delails of the product
        document.querySelectorAll('.details-product').forEach((link) => {
            link.addEventListener('click', (e) => {linkShowDetails(e.currentTarget.id)})
        })

        // setup for delete buttons
        document.querySelectorAll('.is-danger').forEach((button) => {
            button.addEventListener('click', (e) => { buttonDelete(e.currentTarget.id) })
        })
        // setup for edit buttons
        document.querySelectorAll('.is-warning').forEach((button) => {
            button.addEventListener('click', (e) => { buttonEdit(e.currentTarget.id) })
        })
    })
}

// function to handle the events of the link show product details
function linkShowDetails(idLink){
    showModal_showDetails()

    /*
        Body of the function here
        to show the full data product 
    */

    showDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault()
        closeModal_showDetails()
    }) 
}

// function to control the event to delete product
function buttonDelete(idbutton){
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
}

// function to control the event to edit product 
function buttonEdit(idbutton){
    showModal_UpdateProduct()
    firebase.database().ref(`${endPointDB}/${idbutton}`).once('value')
    .then((thisProduct) => {
        const data = thisProduct.val()
        
        updateProductForm['productName'].value = data.productName;
        updateProductForm['origin'].value = data.origin;
        updateProductForm['price'].value = data.price; 
        updateProductForm['MOQ'].value = data.MOQ;
        updateProductForm['discount'].value = data.discount;
        updateProductForm['category'].value = data.category; 
        updateProductForm['salesUnit'].value = data.salesUnit; 
        updateProductForm['description'].value = data.description;
        updateProductForm['isAvailableCheck-update'].checked = data.isAvailable;
        updateProductForm['isDisableCheck-update'].checked = data.isDisable;
        updateProductForm['inSeasonCheck-update'].checked = data.inSeason;

        visor_UpdateForm.src = data.imageProduct;  

        updateProductForm.addEventListener('submit', (e) => {
            e.preventDefault()

            firebase.database().ref(`${endPointDB}/${idbutton}`).update({
                productName: updateProductForm['productName'].value,
                origin: updateProductForm['origin'].value,
                price: updateProductForm['price'].value,
                MOQ: updateProductForm['MOQ'].value,
                discount: updateProductForm['discount'].value,
                category: updateProductForm['category'].value,
                salesUnit: updateProductForm['salesUnit'].value,
                isAvailable: updateProductForm['isAvailableCheck-update'].checked,
                isDisable: updateProductForm['isDisableCheck-update'].checked,
                inSeason: updateProductForm['inSeasonCheck-update'].checked,
                description: updateProductForm['description'].value,
            })              
            closeModal_UpdateProduct()

            swal({
                title: "Update completed!",
                icon: "success",
                button: "Done!",
              });
        })
    })
}

// function to delete de imageProduct from the storage
function deleteImageProduct(Uid){
    var productList = [];
    const dbRef = firebase.database().ref();
    const storageRef = firebase.storage().ref();

    // get que name of the imagen product
    dbRef.child(endPointDB).get().then((snapshot) => {
        if(snapshot.exists()) {
            snapshot.forEach(childSnapshot => {productList.push(childSnapshot.val())})
            
            productList.forEach((item) => {
                if(item.Uid == Uid){
                    // create reference to the product Image
                    var fileName = firebase.storage().refFromURL(item.imageProduct).name;                    
                    storageRef.child(`${endPointStore}/${fileName}`).delete();
                }
            })
        }
    })   
}

// function to getPostId
function getPostId(fullPath){
    return fullPath.split("/")[4]
}

// function to get the file
function getFile(){
    fileInput = document.querySelector("#default-btn")
    return fileInput.files[0];
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

// Events control -------------------->>>>
//--------------------------------------------------------------------------
    // event to the button insert product
    insertProduct_btn.addEventListener('click', showModal_InsertProduct)

    // button to close form
    closeModalInsertProduct_btn.addEventListener('click', closeModal_InsertProduct)
    closeModalUpdateProduct_btn.addEventListener('click', closeModal_UpdateProduct)

    defaultBtn.addEventListener('change', loadImageOnVisor)
    clearVisor_btn.addEventListener('click', clearImage)

    // button to insert new product
    insertProductForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        // refence of the data base
        // **************************
        const databaseRef = firebase.database().ref(endPointDB)
        const postRef = databaseRef.push() 

        // load image of the product
        var imageProduct = await upLoadImaProduct(getFile());        

        // check the mandatory fields -> Product name, origin, price, discount, category, salesUnit, productImage 
        if(Boolean(productName.value) && Boolean(productOrigin.value) &&
            Boolean(price.value) && Boolean(discount.value) &&
            !(category.value === "Select category") &&
            !(salesUnit.value === "Select option") && imageProduct != null
        ){  
            postRef.set({
                Uid: getPostId(postRef.toString()),
                idProduct: uuid.v4(),
                productName: productName.value,
                origin: productOrigin.value,
                price: price.value,
                MOQ: MOQ.value,
                discount: discount.value,
                category: category.value,
                salesUnit: salesUnit.value,
                isAvailable: document.getElementById("isAvailableCheck").checked,
                isDisable: document.getElementById("isDisableCheck").checked,
                inSeason: document.getElementById("inSeasonCheck").checked,
                description: description.value,
                imageProduct: String(imageProduct)
            });

            closeModal_InsertProduct(); // function to hide the register modal
            getAllDataFromDB(); // function to reload de table
        } 
        else{ swal("Warning!!", "Any of the required fields are empty!!"); }
    })

    // Functions main call  -------------------->>>>
    configuration() // function to setup the firebase database
    getAllDataFromDB() // function to load all the products on the table first time
//--------------------------------------------------------------------------