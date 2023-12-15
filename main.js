const LS = window.localStorage;
let totalPrice = 0;
let totalDisc = 0;
let currentTotal = 0;
let theTotal = document.querySelector(
  "section#add-coupon .cart-totals table .subtotal .price"
);
let theDisc = document.querySelector(
  "section#add-coupon .cart-totals table .disc .price"
);
let theCurrentTotal = document.querySelector(
  "section#add-coupon .cart-totals table .total .price"
);
// nav bar on phone
const burgerMenu = document.querySelector("#header .mobile .burger-menu");
const navbar = document.querySelector("#header #navbar");
const closeBurgerMenu = document.querySelector("#header #navbar .close");

if (burgerMenu) {
  burgerMenu.addEventListener("click", () => {
    navbar.classList.add("active");
  });
}
if (closeBurgerMenu) {
  closeBurgerMenu.addEventListener("click", () => {
    navbar.classList.remove("active");
  });
}

//* add items to local storage
function addItemToLocalStorage() {
  const buyItemBtn = document.querySelector(
    "#single-product .details-side .buy-btn"
  );
  if (buyItemBtn) {
    buyItemBtn.addEventListener("click", function () {
      LS.setItem(
        `product-${LS.length + 1}`,
        `{
        "name": "${
          document.querySelector("#single-product .details-side .product-name")
            .textContent
        }",
        "price": "${
          document.querySelector("#single-product .details-side .price")
            .textContent
        }",
        "img": "${
          document.querySelector("#single-product .imgs-side .main-img img").src
        }",
        "quantity": "${
          document.querySelector("#single-product .details-side .count").value
        }",
        "size": "${
          document.querySelector("#single-product .details-side .select-size")
            .value
        }"
      }`
      );
      newItemEffect();
    });
  }
}

//* add new Item effect
function newItemEffect() {
  let addItem = document.createElement("div");
  addItem.className = "addItem";
  addItem.innerHTML = "+1";
  document
    .querySelector("section#header #navbar li.basket")
    .appendChild(addItem);
  setTimeout(() => addItem.remove(), 1200);
}

//* add the products from localstorage to the cart

function addItemToCart() {
  let MyTabel = document.querySelector("#my-items table tbody");
  if (MyTabel) {
    if (LS.length != 0 && LS.getItem("product-1") !== null) {
      for (let i = 0; i < LS.length; i++) {
        let data = JSON.parse(LS.getItem(LS.key(i)));
        let row = document.createElement("tr");
        row.className = LS.key(i);
        // td remove
        let tdRemove = document.createElement("td");
        tdRemove.className = "remove";
        tdRemove.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
        row.appendChild(tdRemove);
        tdRemove.firstElementChild.addEventListener("click", function () {
          tdRemove.parentElement.remove();
          LS.removeItem(this.parentElement.parentElement.className);
          getTotalPrice();
          LS.length === 0 ? MyTabel.appendChild(saySomething()) : "";
        });
        //  td img
        let tdImg = document.createElement("td");
        tdImg.className = "product-img";
        tdImg.innerHTML = `<img src="${data.img}" alt="">`;
        row.appendChild(tdImg);
        //  td name
        let tdName = document.createElement("td");
        tdName.className = "product-name";
        tdName.innerHTML = data.name;
        row.appendChild(tdName);
        //  td size
        let tdSize = document.createElement("td");
        tdSize.className = "product-size";
        tdSize.innerHTML = data.size;
        row.appendChild(tdSize);
        //  td price
        let tdPrice = document.createElement("td");
        tdPrice.className = "product-price";
        tdPrice.innerHTML = data.price;
        row.appendChild(tdPrice);
        //  td quantity
        let tdQuantity = document.createElement("td");
        tdQuantity.className = "product-q";
        tdQuantity.innerHTML = data.quantity;
        row.appendChild(tdQuantity);
        //  td total price
        let tdTotalPrice = document.createElement("td");
        tdTotalPrice.className = "product-totalprice";
        tdTotalPrice.innerHTML = `$${
          data.quantity * data.price.split("$").join("")
        }`;
        row.appendChild(tdTotalPrice);
        MyTabel.appendChild(row);
      }
      getTotalPrice();
    } else {
      MyTabel.appendChild(saySomething());
      getTotalPrice();
      LS.clear();
    }
  }
}
window.onload = addItemToCart;

//* create message if the cart is empty
function saySomething() {
  let row = document.createElement("tr");
  row.className = "no-items";
  row.innerHTML =
    '<td><div class="warning">there are no items in the cart, <a href="shop.html">Go Shopping..</a></div></td>';
  return row;
}

//* get the products from json file
let productsContainer = document.querySelector("#products1.shop .products");
let productsContainerMain = document.querySelector(
  "#products1.main-page .products"
);
let productsContainerMain2 = document.querySelector(
  "#products2.main-page .products"
);

fetch("./products.json")
  .then((r) => r.json())
  .then((data) => showProductsInTheStore(data))
  .catch((e) => e);

//* function to display the content inside the store
function showProductsInTheStore(data) {
  if (productsContainer) {
    data.forEach((item) => {
      productsContainer.appendChild(createProductCard(item));
    });
    addEventOnTheItems(data);
  }
  if (productsContainerMain) {
    data.forEach((item) => {
      if (item["product-id"] <= 8) {
        productsContainerMain.appendChild(createProductCard(item));
      }
      if (item["product-id"] > 8 && item["product-id"] <= 16) {
        productsContainerMain2.appendChild(createProductCard(item));
      }
    });
    addEventOnTheItems(data);
  }
}

//* create product card
function createProductCard(item) {
  productBox = document.createElement("div");
  productBox.className = "product-box";
  productBox.id = item["product-id"];
  let productImg = document.createElement("img");
  productImg.className = "product-img";
  productImg.src = item["product-img"];
  productBox.appendChild(productImg);
  let productBrand = document.createElement("p");
  productBrand.className = "product-brand";
  productBrand.innerHTML = item["product-brand"];
  productBox.appendChild(productBrand);
  let productName = document.createElement("h5");
  productName.className = "product-name";
  productName.innerHTML = item["product-name"];
  productBox.appendChild(productName);
  let productRate = document.createElement("div");
  productRate.className = "stars";
  productRate.innerHTML = '<i class="fa-solid fa-star"></i>'.repeat(
    +item["product-rate"]
  );
  productBox.appendChild(productRate);
  let productPrice = document.createElement("h4");
  productPrice.className = "price";
  productPrice.innerHTML = item["product-price"];
  productBox.appendChild(productPrice);
  let buyIcon = document.createElement("i");
  buyIcon.className = "fa-solid fa-cart-shopping buy";
  productBox.appendChild(buyIcon);
  return productBox;
}

//* single product page - show image
function changeTheMainProductImg() {
  const mainImg = document.querySelector(
    "#single-product .imgs-side .main-img img"
  );
  const smallImgs = document.querySelectorAll(
    "#single-product .small-imgs-group .col img"
  );
  smallImgs.forEach((img) => {
    img.addEventListener("click", function () {
      mainImg.src = `${this.src}`;
    });
  });
}

//* go to the single page product when click on it
function addEventOnTheItems(data) {
  let currentId;
  document.addEventListener("click", function (e) {
    if (e.target.closest(".product-box")) {
      // clear the page content
      clearThePage();
      // select the corrent id
      currentId = e.target.closest(".product-box").id;
      // show the product when click on it
      showProduct(currentId, data);
      // show all products
      showAllProducts(data);
      // show pagination
      showPagination();
      // scroll to the top
      window.scroll(0, 0);
      // add the items to local storage when clicke on buy button
      addItemToLocalStorage();
      // change the main img when click on any img from the same type
      changeTheMainProductImg();
    }
  });
}
//* clear the page content
function clearThePage() {
  let sectionElement = document.querySelectorAll("section");
  sectionElement.forEach((section) => {
    if (
      section.id !== "header" &&
      section.id !== "sign-up" &&
      section.id !== "footer"
    ) {
      section.remove();
    }
  });
}

function showProduct(currentId, data) {
  data.forEach((item) => {
    if (item["product-id"] === currentId) {
      // create the current products section
      let productSection = document.createElement("section");
      productSection.id = "single-product";
      productSection.className = "section-p1";
      document.querySelector("section#header").after(productSection);
      // create the imgs section
      let imgsSide = document.createElement("div");
      imgsSide.className = "imgs-side";
      productSection.appendChild(imgsSide);
      // the main product
      showTheMainProduct(item, currentId, imgsSide);
      // the small products group
      showSimilarProducts(data, item, imgsSide);
      // the details Side
      showDetailsSide(item, productSection);
    }
  });
}
//* to display the product we cliked on
function showTheMainProduct(item, currentId, imgsSide) {
  let mainImgBox = document.createElement("div");
  mainImgBox.className = "main-img";
  imgsSide.appendChild(mainImgBox);

  let theMainImg = document.createElement("img");
  theMainImg.id = currentId;
  theMainImg.src = item["product-img"];
  theMainImg.style.width = "100%";
  mainImgBox.appendChild(theMainImg);
}

//* this function to display another products similar to the main product.
function showSimilarProducts(data, item, imgsSide) {
  let ImgsGroupBox = document.createElement("div");
  ImgsGroupBox.className = "small-imgs-group";
  imgsSide.appendChild(ImgsGroupBox);
  let filterdData = data.filter((smallItem) => {
    return (
      smallItem["product-name"] === item["product-name"] &&
      smallItem["product-brand"] === item["product-brand"] &&
      smallItem["product-price"] === item["product-price"]
    );
  });
  let unique = [];
  let randomNum;
  if (filterdData.length >= 4) {
    for (let i = 0; i < 4; i++) {
      randomNum = Math.floor(Math.random() * filterdData.length);
      if (unique.includes(filterdData[randomNum])) {
        i--;
        continue;
      } else {
        unique.push(filterdData[randomNum]);
      }
    }
  } else {
    filterdData.forEach((item) => unique.push(item));
  }

  unique.forEach((product) => {
    let imgContainer = document.createElement("div");
    imgContainer.className = "col";
    let theSmallImg = document.createElement("img");
    theSmallImg.src = product["product-img"];
    theSmallImg.alt = "";
    theSmallImg.style.width = "100%";
    imgContainer.appendChild(theSmallImg);
    ImgsGroupBox.appendChild(imgContainer);
  });
}

//* work on details section
function showDetailsSide(item, productSection) {
  // create the details section
  let detailsSide = document.createElement("div");
  detailsSide.className = "details-side";
  productSection.appendChild(detailsSide);
  let productPath = document.createElement("h5");
  productPath.innerHTML = "Home/T-Shirt";
  detailsSide.appendChild(productPath);
  // create product name
  let productName = document.createElement("h3");
  productName.className = "product-name";
  productName.innerHTML = item["product-name"];
  detailsSide.appendChild(productName);
  // create product price element
  let productPrice = document.createElement("span");
  productPrice.className = "price";
  productPrice.innerHTML = item["product-price"];
  detailsSide.appendChild(productPrice);
  // create size options
  let sizeSelector = document.createElement("select");
  sizeSelector.className = "select-size";
  detailsSide.appendChild(sizeSelector);
  // create size options
  let defaultSelect = document.createElement("option");
  defaultSelect.innerHTML = "Select Size";
  sizeSelector.appendChild(defaultSelect);
  let xlselector = document.createElement("option");
  xlselector.innerHTML = "XL";
  sizeSelector.appendChild(xlselector);
  let xxlselector = document.createElement("option");
  xxlselector.innerHTML = "XXL";
  sizeSelector.appendChild(xxlselector);
  let smallselector = document.createElement("option");
  smallselector.innerHTML = "Small";
  sizeSelector.appendChild(smallselector);
  let largeselector = document.createElement("option");
  largeselector.innerHTML = "Large";
  sizeSelector.appendChild(largeselector);
  // the product count
  let productCount = document.createElement("input");
  productCount.className = "count";
  productCount.type = "number";
  productCount.value = "1";
  productCount.min = "1";
  detailsSide.appendChild(productCount);
  // create btn element
  let buyBtn = document.createElement("button");
  buyBtn.className = "buy-btn";
  buyBtn.type = "button";
  buyBtn.innerHTML = "Add To Cart";
  detailsSide.appendChild(buyBtn);
  // create product information
  let moreDetails = document.createElement("h3");
  moreDetails.innerHTML = "Product Details";
  detailsSide.appendChild(moreDetails);
  let moreDetailsParagraph = document.createElement("p");
  moreDetailsParagraph.innerHTML =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. At beatae omnis maiores esse pariatur sunt et vel vero eum aut dolores ipsa repellat fugiat suscipit velit, dolor nesciunt mollitia eaque perspiciatis accusantium. Incidunt harum voluptate nemo repudiandae ad, natus eum, necessitatibus unde nihil nulla sit tempore? Natus tempora reprehenderit consequuntur.";
  detailsSide.appendChild(moreDetailsParagraph);
}

//* show the all products
function showAllProducts(data) {
  let allProducts = document.createElement("section");
  allProducts.id = "products2";
  allProducts.className = "featured-products section-p1";
  let productsContainer = document.createElement("div");
  productsContainer.className = "products";
  allProducts.appendChild(productsContainer);
  document.querySelector("section#single-product").after(allProducts);
  data.forEach((item) => {
    productsContainer.appendChild(createProductCard(item));
  });
}

//* create pagination
function showPagination() {
  let pagination = document.createElement("section");
  pagination.id = "pagination";
  pagination.className = "section-p1";
  let bullet1 = document.createElement("a");
  bullet1.href = "#";
  bullet1.innerHTML = "1";
  pagination.appendChild(bullet1);
  let bullet2 = document.createElement("a");
  bullet2.href = "#";
  bullet2.innerHTML = "2";
  pagination.appendChild(bullet2);
  let bulletElse = document.createElement("a");
  bulletElse.href = "#";
  bulletElse.innerHTML = '<i class="fa-solid fa-arrow-right-long"></i>';
  pagination.appendChild(bulletElse);
  document
    .querySelector("section#products2.featured-products")
    .after(pagination);
}

//* sum the cart totals
function getTotalPrice() {
  totalPrice = 0;
  currentTotal = 0;
  let allItemsPrice = document.querySelectorAll(
    "section#my-items table tbody tr td.product-totalprice"
  );
  if (allItemsPrice.length > 0) {
    allItemsPrice.forEach((price) => {
      totalPrice += parseInt(price.textContent.slice(1));
    });
  }
  theTotal.innerHTML = `$${totalPrice}`;
  currentTotal = totalPrice - (totalPrice * totalDisc) / 100;
  theCurrentTotal.innerHTML = `$${currentTotal}`;
  theDisc.innerHTML = `${totalDisc}%`;
}

//* check if the user input a coupon or not
let coupon = document.querySelector("section#add-coupon .add-cart button");
let couponInput = document.querySelector("section#add-coupon .add-cart input");
if (coupon) {
  coupon.addEventListener("click", () => {
    if (couponInput.value === "moussa") {
      totalDisc = 10;
      getTotalPrice();
    }
  });
}
