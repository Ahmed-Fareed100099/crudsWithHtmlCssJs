
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let title = document.getElementById('title');
let submit = document.getElementById('submit');

let mood = 'create';
let temp; // Temporary index for update mode
let products = JSON.parse(localStorage.getItem('products')) || [];

// Calculate total
function calculateTotal() {
  if (price.value) {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.textContent = `Total: ${result}`;
    total.style.backgroundColor = 'darkgreen';
  } else {
    total.textContent = 'Total: 0';
    total.style.backgroundColor = 'rgb(137, 6, 6)';
  }
}

// Create or update product
function createProduct() {
  let product = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.textContent.split(': ')[1],
    count: count.value,
    category: category.value.toLowerCase(),
  };
    if(title.value!=""&&
      price.value!=""&&
      category.value!=""&&
      count.value<100){
            if (mood === 'create') {
    if (product.count > 1) {
      for (let i = 0; i < product.count; i++) {
        products.push(product);
      }
    } else {
      products.push(product);
    }
  } else {
    products[temp] = product;
    mood = 'create';
    submit.textContent = 'Create';
    count.style.display = 'block';
  }
    clearInputs();
      }


  localStorage.setItem('products', JSON.stringify(products));
  
  showProducts();
}

// Clear input fields
function clearInputs() {
  title.value = '';
  price.value = '';
  taxes.value = '';
  ads.value = '';
  discount.value = '';
  total.textContent = 'Total: 0';
  count.value = '';
  category.value = '';
}

// Show products
function showProducts() {
  let tbody = document.getElementById('tbody');
  let table = '';
  products.forEach((product, index) => {
    table += `
      <tr>
        <td>${index + 1}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${product.discount}</td>
        <td>${product.total}</td>
        <td>${product.count}</td>
        <td>${product.category}</td>
        <td><button onclick="editProduct(${index})">Update</button></td>
        <td><button onclick="deleteProduct(${index})">Delete</button></td>
      </tr>`;
  });

  tbody.innerHTML = table;
  let deleteAll = document.getElementById('deleteAll');
  deleteAll.innerHTML =
    products.length > 0
      ? `<button onclick="deleteAllProducts()">Delete All (${products.length})</button>`
      : '';
}

// Delete product
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  showProducts();
}

// Delete all products
function deleteAllProducts() {
  products = [];
  localStorage.removeItem('products');
  showProducts();
}

// Edit product
function editProduct(index) {
  let product = products[index];
  title.value = product.title;
  price.value = product.price;
  taxes.value = product.taxes;
  ads.value = product.ads;
  discount.value = product.discount;
  category.value = product.category;
  calculateTotal();
  count.style.display = 'none';
  submit.textContent = 'Update';
  mood = 'update';
  temp = index;
}

// Search functionality
let searchMode = 'title';
function getsearchmood(mode) {
  searchMode = mode === 'searchTitle' ? 'title' : 'category';
  document.getElementById('search').placeholder = `Search by ${searchMode}`;
  document.getElementById('search').focus();
}

function searchData(value) {
  let table = '';
  products.forEach((product, index) => {
    if (product[searchMode].includes(value.toLowerCase())) {
      table += `
        <tr>
          <td>${index + 1}</td>
          <td>${product.title}</td>
          <td>${product.price}</td>
          <td>${product.taxes}</td>
          <td>${product.ads}</td>
          <td>${product.discount}</td>
          <td>${product.total}</td>
          <td>${product.count}</td>
          <td>${product.category}</td>
          <td><button onclick="editProduct(${index})">Update</button></td>
          <td><button onclick="deleteProduct(${index})">Delete</button></td>
        </tr>`;
    }
  });
  document.getElementById('tbody').innerHTML = table;
}

// Initial setup
showProducts();
submit.addEventListener('click', createProduct);
