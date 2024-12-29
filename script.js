// ✅ Inizializza le categorie di default e i prodotti
let products = JSON.parse(localStorage.getItem('products')) || {};
let categories = [
  'Detersivo Lavastoviglie',
  'Detersivo Lavatrice',
  'Ammorbidente',
  'Brillantante',
  'Shampoo',
  'Balsamo',
  'Bagnoschiuma',
  'Deodorante Spray',
  'Dentifricio',
  'Sapone mani',
  'Detersivo Pavimenti',
];

// ✅ Popola dinamicamente le categorie nei dropdown
function populateCategories() {
  const categorySelect = document.getElementById('category');
  const filterCategorySelect = document.getElementById('filterCategory');
  
  categorySelect.innerHTML = '<option value="">Seleziona Categoria</option>';
  filterCategorySelect.innerHTML = '<option value="">Tutte le Categorie</option>';
  
  categories.forEach(category => {
    const option1 = document.createElement('option');
    option1.value = category;
    option1.textContent = category;
    categorySelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = category;
    option2.textContent = category;
    filterCategorySelect.appendChild(option2);
  });
}

// ✅ Funzione per calcolare automaticamente il prezzo unitario
function calculateUnitPrice() {
  const price = parseFloat(document.getElementById('price').value) || 0;
  const unit = parseFloat(document.getElementById('unit').value) || 1;

  if (unit > 0) {
    const unitPrice = price / unit;
    document.getElementById('unitPrice').value = `${unitPrice.toFixed(2)} €/unità`;
  } else {
    document.getElementById('unitPrice').value = '0.00 €/unità';
  }
}

// ✅ Eventi per il calcolo in tempo reale
document.getElementById('price').addEventListener('input', calculateUnitPrice);
document.getElementById('unit').addEventListener('input', calculateUnitPrice);

// ✅ Funzione per capitalizzare automaticamente il testo nei campi input
function capitalizeInput(event) {
  const input = event.target;
  input.value = input.value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// ✅ Assegna eventi di capitalizzazione ai campi necessari
['category', 'productName', 'store', 'newCategory'].forEach(id => {
  document.getElementById(id).addEventListener('input', capitalizeInput);
});

// ✅ Aggiunge una nuova categoria
function addCategory() {
  const newCategoryInput = document.getElementById('newCategory');
  const newCategory = newCategoryInput.value.trim();

  if (!newCategory) {
    alert('⚠️ Inserisci un nome per la nuova categoria.');
    return;
  }

  const capitalizedCategory = newCategory
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (categories.includes(capitalizedCategory)) {
    alert('⚠️ Questa categoria esiste già!');
    return;
  }

  categories.push(capitalizedCategory);
  populateCategories();

  alert(`✅ Categoria "${capitalizedCategory}" aggiunta con successo!`);
  newCategoryInput.value = '';
  closeCategoryModal();
}

// ✅ Aggiunge un nuovo prodotto con confronto prezzi
function addProduct() {
  const category = document.getElementById('category').value;
  const productName = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const unit = parseFloat(document.getElementById('unit').value);
  const store = document.getElementById('store').value.trim();

  if (!category || !productName || isNaN(price) || isNaN(unit) || !store) {
    alert('⚠️ Compila tutti i campi correttamente per aggiungere un prodotto!');
    return;
  }

  const unitPrice = (price / unit).toFixed(2);

  if (products[category]) {
    const existingProduct = Object.values(products[category])[0];
    const existingPrice = parseFloat(existingProduct.price);

    if (price > existingPrice) {
      const differencePercentage = (((price - existingPrice) / existingPrice) * 100).toFixed(2);
      alert(`🤔 Questo prodotto è ${differencePercentage}% meno conveniente rispetto a quello attuale nella categoria "${category}". Prova a cercare un prezzo migliore!`);
      return;
    } else {
      alert(`🎉 Prodotto più conveniente trovato! Il prodotto nella categoria "${category}" è stato aggiornato.`);
    }
  }

  products[category] = {
    [productName]: {
      price: price.toFixed(2),
      unit,
      unitPrice,
      store,
      date: new Date().toLocaleDateString('it-IT'),
    }
  };

  localStorage.setItem('products', JSON.stringify(products));
  renderProducts();
  clearForm();
  alert(`✅ Prodotto "${productName}" aggiunto con successo alla categoria "${category}"!`);
}

// ✅ Funzione per eliminare un prodotto con pressione prolungata
function handleProductLongPress(productCard, category, productName) {
  productCard.addEventListener('mousedown', () => {
    productCard.classList.add('selected');
    setTimeout(() => {
      if (confirm(`⚠️ Sei sicuro di voler eliminare il prodotto "${productName}" dalla categoria "${category}"?`)) {
        delete products[category][productName];
        if (Object.keys(products[category]).length === 0) {
          delete products[category];
        }
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
      }
      productCard.classList.remove('selected');
    }, 1000);
  });
  productCard.addEventListener('mouseup', () => productCard.classList.remove('selected'));
}

function renderProducts() {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  for (const category in products) {
    for (const productName in products[category]) {
      const product = products[category][productName];
      const card = document.createElement('div');
      card.className = 'product-card';
      handleProductLongPress(card, category, productName);
      card.innerHTML = `
        <h3>${category} - ${productName}</h3>
        <p>Prezzo Totale: ${product.price}€</p>
        <p>Prezzo Unitario: ${product.unitPrice} €/unità</p>
        <p>Negozio: ${product.store}</p>
        <p>Data: ${product.date}</p>
      `;
      productList.appendChild(card);
    }
  }
}

populateCategories();
renderProducts();
