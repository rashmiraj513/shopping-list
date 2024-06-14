const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromLocalStorage = getItemsFromLocalStorage();
  itemsFromLocalStorage.forEach((item) => addItemToDom(item));
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const item = itemInput.value;

  // Validate the item
  if (item === '') {
    alert('Please add an item!');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    // Remove from the local storage
    removeItemFromLocalStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');

    // Remove from the DOM
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(item)) {
      alert('Item already exists!');
      return;
    }
  }

  addItemToDom(item);
  addItemToLocalStorage(item);

  // After adding one item, call resetUI function.
  resetUI();

  // Clear the input field
  itemInput.value = '';
}

function addItemToDom(item) {
  // Create a new li element
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function checkIfItemExists(item) {
  return getItemsFromLocalStorage().includes(item);
}

function getItemsFromLocalStorage() {
  const itemsFromLocalStorage = localStorage.getItem('items');
  return itemsFromLocalStorage === null
    ? []
    : JSON.parse(itemsFromLocalStorage);
}

function addItemToLocalStorage(item) {
  const itemsFromLocalStorage = getItemsFromLocalStorage();

  // Now, push the new item to local storage.
  itemsFromLocalStorage.push(item);

  // Convert it to string using stringify method
  localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage));
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEditMode(e.target);
  }
}

function setItemToEditMode(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen p-10"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove the element from DOM
    item.remove();

    // Remove the element from local storage
    removeItemFromLocalStorage(item.textContent);
  }

  // After removing one item, call resetUI function.
  resetUI();
}

function removeItemFromLocalStorage(text) {
  let itemsFromLocalStorage = getItemsFromLocalStorage();

  // Using filter method, remove the text from the array and then again set the update array
  // to the local storage.
  itemsFromLocalStorage = itemsFromLocalStorage.filter((item) => {
    return item !== text;
  });

  // Re-set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage));
}

function removeAllItems() {
  if (confirm('Are you sure?')) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    // Clear from local storage
    localStorage.removeItem('items');
  }

  // After removing all items, call resetUI function.
  resetUI();
}

function filterItems(e) {
  // Convert this to lowercase to compare effectively
  const text = e.target.value.toLowerCase();

  const items = itemList.querySelectorAll('li');
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function resetUI() {
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus p-10"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
}

// Initialize App
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', removeAllItems);
  window.addEventListener('load', resetUI);
  document.addEventListener('DOMContentLoaded', displayItems);
  itemFilter.addEventListener('input', filterItems);
}

init();
