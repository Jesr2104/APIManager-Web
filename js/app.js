/**
---------------------------------------------------------------------------------------------------
Lista de tareas por realizar
---------------------------------------------------------------------------------------------------
2. permitir que modificar permita cambiar la foto del producto.
    a) seleccionar foto nueva
    b) cambiarla en el visor de imagenes 
    c) eliminar la foto anterior del storage the imagenes
4. restringir el numero de caracteres mostrados en las columnas de las tabla.
    .ellipsis {
        max-width: 40px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
}
5. login de la base as a administrator of the database.
---------------------------------------------------------------------------------------------------
**/

// vars
//--------------------------------------------------------------------------
const endPointDB = 'productListDB'
const endPointStore = 'ImageStore'
const iconSize = '15px'
const currency = '£'

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

// function to show the hide the image if it's not ready
function showImageVisorInsertProduct(){ visor_InsertForm.classList.remove('hide-image');}
function hideImageVisorInsertProduct(){ visor_InsertForm.classList.add('hide-image');}

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

// function to clear all the form after to used
function clearformFromDetails(){
    document.getElementById("productName-fromDetails").innerHTML = ""
    document.getElementById("caregory-fromDetails").innerHTML = ""
    document.getElementById("iconCategory-fromDetails").src = ""
    document.getElementById("origin-fromDetails").innerHTML = ""
    document.getElementById("price-fromDetails").innerHTML = ""
    document.getElementById("Discount-fromDetails").innerHTML = ""
    document.getElementById("MOQ-fromDetails").innerHTML = ""
    document.getElementById("Description-fromDetails").innerHTML = ""
    document.getElementById("inSeason-fromDetails").innerHTML = ""
    document.getElementById("isAvailable-fromDetails").innerHTML = ""
    document.getElementById("isDisable-fromDetails").innerHTML = ""
    document.getElementById("imageProduct-fromDetails").src = ""
    document.getElementById("idProduct-fromDetails").innerHTML = ""
    document.getElementById("Uid-fromDetails").innerHTML = ""
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
        showImageVisorInsertProduct()
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
                <th>${calculateDiscount(products.discount, products.price)}</th>
                <th>${products.discount} %</th>
                <th>${products.MOQ}</th>
                <th> 
                    <img src="${getCategoryIcon(products.category)}" width="${iconSize}" height="${iconSize}">
                    <span> ${getCategory(products.category)}</span>
                </th>
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

    firebase.database().ref(`${endPointDB}/${idLink}`).once('value')
    .then((thisProduct) => {
        const data = thisProduct.val()

        document.getElementById("productName-fromDetails").innerHTML = data.productName
        document.getElementById("caregory-fromDetails").innerHTML = getCategory(data.category)
        document.getElementById("iconCategory-fromDetails").src = getCategoryIcon(data.category)
        document.getElementById("origin-fromDetails").innerHTML = data.origin
        document.getElementById("price-fromDetails").innerHTML =  calculateDiscount(data.discount, data.price)
        document.getElementById("Discount-fromDetails").innerHTML = data.discount + '%'
        document.getElementById("MOQ-fromDetails").innerHTML = data.MOQ + ' ' + data.salesUnit
        document.getElementById("Description-fromDetails").innerHTML = checkDescriptionEmpty(data.description)
        document.getElementById("inSeason-fromDetails").innerHTML = data.inSeason
        document.getElementById("isAvailable-fromDetails").innerHTML = data.isAvailable
        document.getElementById("isDisable-fromDetails").innerHTML = data.isDisable
        document.getElementById("imageProduct-fromDetails").src = data.imageProduct
        document.getElementById("idProduct-fromDetails").innerHTML = data.idProduct
        document.getElementById("Uid-fromDetails").innerHTML = data.Uid

        showDetailsForm.addEventListener('submit', (e) => {
            e.preventDefault()
            closeModal_showDetails()
            clearformFromDetails()
        })
    }) 
}

// check is the description is empty to put a message to the user
function checkDescriptionEmpty(description){
    if(description.length == 0){
        // is empty 
        return "Description is empty..."
    } else {
        // it's not empty
        return description
    }
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

        // event to update the information on the server
        updateProductForm.addEventListener('submit', updateInfoOnServer)
        updateProductForm.myParam = idbutton;
    })
}

// function to update de information on the firebase
function updateInfoOnServer(idbutton){
    // deprecate function this will be need update
    event.preventDefault()

    firebase.database().ref(`${endPointDB}/${idbutton.currentTarget.myParam}`).update({
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
    });              
    closeModal_UpdateProduct();
    getAllDataFromDB(); // function to reload de table

    swal({
        title: "Update completed!",
        icon: "success",
        button: "Done!",
    });
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

// function to get the icon of the category
function getCategoryIcon(categoryNumber){
    switch(categoryNumber) {
        case '0':
          return "https://firebasestorage.googleapis.com/v0/b/grocerystore-justjump.appspot.com/o/IconsWeb%2Fproduct-design.png?alt=media&token=4dec3dda-a48b-48bf-aadf-d26f0bbba830";
        case '1':
            return "https://firebasestorage.googleapis.com/v0/b/grocerystore-justjump.appspot.com/o/IconsWeb%2Fapple.png?alt=media&token=87769a0d-a90d-4496-94ce-f69015680e62";     
        case '2':
            return "https://firebasestorage.googleapis.com/v0/b/grocerystore-justjump.appspot.com/o/IconsWeb%2Fbroccoli.png?alt=media&token=9b1580c1-f40e-47b1-bb27-74b75c71777d";
        case '3':
            return "https://firebasestorage.googleapis.com/v0/b/grocerystore-justjump.appspot.com/o/IconsWeb%2Fherbs.png?alt=media&token=2c8f2ddc-d360-4c20-8913-933aa5873071";
        case '4':
            return "https://firebasestorage.googleapis.com/v0/b/grocerystore-justjump.appspot.com/o/IconsWeb%2Fwalnut.png?alt=media&token=4c9cca32-84dc-4745-ac97-4e7a2029be37";
        case '5':
            return "https://firebasestorage.googleapis.com/v0/b/grocerystore-justjump.appspot.com/o/IconsWeb%2Fmushroom.png?alt=media&token=e0890589-9b3c-4830-8cf1-5129e96cdb99";
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

// function to calculate de discount if the product have any of them
function calculateDiscount(discount, price){
    var result = price - (price * (discount/100))
    if(discount != '0'){
        return `${result.toFixed(2)} ${currency} - <span style="color:#bdbdbd; text-decoration: line-through;"> ${price} ${currency}</span>`
    } else {
        return `${price} ${currency}`
    }
}

// Events control -------------------->>>>
//-------------------------------------------------------------------------
    // event to the button insert product
    insertProduct_btn.addEventListener('click', (e) => {
        showModal_InsertProduct(); hideImageVisorInsertProduct();
    })

    clearVisor_btn.addEventListener('click', (e) => {
        clearImage(); hideImageVisorInsertProduct();
    })

    // when the button select a new picture the event is caught like a change
    defaultBtn.addEventListener('change', loadImageOnVisor)

    // button to close form
    closeModalInsertProduct_btn.addEventListener('click', closeModal_InsertProduct)
    closeModalUpdateProduct_btn.addEventListener('click', closeModal_UpdateProduct)

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