// --- DATA SETUP ---

// Hardcoded list of ingredients (each has an id + name)
const ingredientsDB = [
  { id: 'i1', name: 'Eggs' },
  { id: 'i2', name: 'Egg Pasta (Thick)' },
  { id: 'i3', name: 'Bacon' },
  { id: 'i4', name: 'Water Bottles 24x600ml' },
  { id: 'i5', name: 'Milk' },
  { id: 'i6', name: 'Butter' },
  { id: 'i7', name: 'Salt' },
  { id: 'i8', name: 'Pepper' },
  { id: 'i9', name: 'Potatoes' },
  { id: 'i10', name: 'Onions' },
  { id: 'i11', name: 'Parmesan' },
  { id: 'i12', name: 'Paprika' },
  { id: 'i13', name: 'Chicken Breast' },
  { id: 'i14', name: 'Lettuce' },
  { id: 'i15', name: 'Tomatoes' },
  { id: 'i16', name: 'Cucumber' },
  { id: 'i17', name: 'Steak' },
  { id: 'i18', name: 'Garlic' },
  { id: 'i19', name: 'Olive Oil' },
  { id: 'i20', name: 'Rice' },
  { id: 'i21', name: 'Grana Padano' },
  { id: 'i22', name: 'Bacon' },
  { id: 'i23', name: 'Panchetta' },
  { id: 'i24', name: 'Passata' },
  { id: 'i25', name: 'Tinned Tomatoes' },
  { id: 'i26', name: 'Italian Herbs' },
  { id: 'i27', name: 'Chicken Stock' },
  { id: 'i28', name: 'Sugar' },
  { id: 'i29', name: 'Worcestershire Sauce' },
  { id: 'i30', name: 'Soy Sauce' },
  { id: 'i31', name: 'Honey' },
  { id: 'i32', name: 'Beef Mince' },
  { id: 'i33', name: 'Egg Pasta (Thin)' },
  { id: 'i34', name: 'Melty Cheese' },
  { id: 'i35', name: 'Nandos Seasoning' },
  { id: 'i36', name: 'Broccoli' },
  { id: 'i37', name: 'Garlic Powder' },
  { id: 'i38', name: 'Onion Powder' },
  { id: 'i39', name: 'Cumin' },
  { id: 'i40', name: 'Chilli Powder' },
  { id: 'i41', name: 'Turkey Mince' }, 
  { id: 'i42', name: 'Tomato Paste' },
  { id: 'i43', name: 'Peach Iced Tea 1.5L' },
  { id: 'i44', name: 'Chocolate Milk 12x250ml' },
  { id: 'i45', name: 'Solo Cans 10x375ml' },


];

// Hardcoded list of dinners (each has an id + name + which ingredient IDs it uses)
const dinnersDB = [
  { id: 'd1', name: 'Carbonara', ingredientIds: ['i1','i2','i3','i7','i18','i8','i23','i21','i11'] },
  { id: 'd2', name: 'Seasoned Broccoli', ingredientIds: ['i8','i12','i7','i36','i37','i38'] },
  { id: 'd3', name: 'Mashed Potatoes', ingredientIds: ['i7','i8','i9','i5','i6'] },
  { id: 'd4', name: 'Steak', ingredientIds: ['i17','i7','i8','i18','i6'] },
  { id: 'd5', name: 'Spaghetti Bolognese', ingredientIds: ['i18','i7','i8','i37','i38','i34','i33','i32','i10','i29','i28','i26','i27','i24','i25','i42'] },


];

// First, get a flat list of all ingredient IDs used in dinners
const ingredientsInDinners = dinnersDB.flatMap(d => d.ingredientIds);

// Filter ingredients to only those NOT in any dinner
const standaloneIngredients = ingredientsDB.filter(
  ing => !ingredientsInDinners.includes(ing.id)
);

// --- APPLICATION STATE ---

// This array holds the current grocery list items
// Each entry looks like: { id, name, purchased (true/false) }
let currentList = [];

// --- DOM ELEMENT REFERENCES ---

// Grab references to the HTML elements by their IDs
const dinnersListEl = document.getElementById('dinners-list');
const ingredientsListEl = document.getElementById('ingredients-list');
const groceryListEl = document.getElementById('grocery-list');
const searchBoxEl = document.getElementById('search-box');
const clearBtn = document.getElementById('clear-list');
const copyBtn = document.getElementById('copy-list');

// --- POPULATE THE DINNERS AND INGREDIENTS COLUMNS ---

// Render all dinners into the dinners column
dinnersDB.forEach(dinner => {
  const li = document.createElement('li');       // Create <li>
  li.textContent = dinner.name;                  // Show dinner name
  li.addEventListener('click', () => {           // When clicked...
    addDinnerById(dinner.id);                    // Add its ingredients to grocery list
  });
  dinnersListEl.appendChild(li);                 // Add <li> to the dinners column
});

// Render the filtered ingredients
standaloneIngredients.forEach(ing => {
  const li = document.createElement('li');       // Create <li>
  li.textContent = ing.name;                     // Show ingredient name
  li.addEventListener('click', () => {           // When clicked...
    addIngredientById(ing.id);                   // Add that ingredient to grocery list
  });
  ingredientsListEl.appendChild(li);             // Add <li> to the ingredients column
});

// --- FUNCTIONS TO ADD TO THE GROCERY LIST ---

// Add a dinner: loop through all its ingredient IDs and add them one by one
function addDinnerById(dinnerId) {
  const dinner = dinnersDB.find(d => d.id === dinnerId);   // Find the dinner by id
  if (!dinner) return;                                     // If not found, stop
  dinner.ingredientIds.forEach(ingId => {                  // For each ingredient in that dinner...
    addIngredientById(ingId);                              // Add ingredient to grocery list
  });
}

// Add a single ingredient by id (deduplicated)
function addIngredientById(ingId) {
  const ing = ingredientsDB.find(i => i.id === ingId);     // Find ingredient by id
  if (!ing) return;                                        // If not found, stop

  // Check if this ingredient is already in the grocery list
  const existing = currentList.find(item => item.id === ingId);

  if (existing) {
    // If already present, do nothing (avoids duplicates)
    return;
  }

  // Otherwise create a new entry object
  const newItem = {
    id: ing.id,
    name: ing.name,
    purchased: false
  };

  currentList.push(newItem);           // Add to the array
  addItemToDOM(newItem);               // Render it on the page
}

// --- RENDERING FUNCTIONS ---

// Render a grocery list item into the grocery list UL
function addItemToDOM(item) {
  const li = document.createElement('li');   // Create <li>
  li.dataset.id = item.id;                   // Store the item id for later reference

  const checkbox = document.createElement('input'); // Create a checkbox
  checkbox.type = 'checkbox';                       // Checkbox type
  checkbox.checked = item.purchased;                // Match current state
  checkbox.addEventListener('change', () => {       // When checkbox clicked...
    item.purchased = checkbox.checked;              // Update item state
  });

  const label = document.createElement('span');     // Create text span
  label.textContent = item.name;                    // Set text to ingredient name
  label.style.marginLeft = '8px';                   // Add spacing after checkbox

  li.appendChild(checkbox);                         // Add checkbox into <li>
  li.appendChild(label);                            // Add label into <li>
  groceryListEl.appendChild(li);                    // Add <li> to grocery list UL
}

// --- SEARCH BOX BEHAVIOR ---

// When user presses Enter in the search box
searchBoxEl.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') return;                      // Only respond to Enter key
  const raw = searchBoxEl.value.trim();               // Get the typed text
  if (!raw) return;                                   // Ignore if empty

  // Try to match typed text to a dinner
  const dinner = dinnersDB.find(d => d.name.toLowerCase() === raw.toLowerCase());
  if (dinner) {
    addDinnerById(dinner.id);                         // If dinner found, add its ingredients
  } else {
    // Otherwise try to match typed text to an ingredient
    const ing = ingredientsDB.find(i => i.name.toLowerCase() === raw.toLowerCase());
    if (ing) {
      addIngredientById(ing.id);                      // If ingredient found, add it
    } else {
      alert('Not found in dinners or ingredients');   // Otherwise show an error
    }
  }

  searchBoxEl.value = '';                             // Clear the search box
});

// --- CLEAR AND COPY BUTTONS ---

// Clear the grocery list
clearBtn.addEventListener('click', () => {
  currentList = [];                 // Reset array
  groceryListEl.innerHTML = '';     // Empty the list in the DOM
});

// Copy the grocery list to clipboard
copyBtn.addEventListener('click', () => {
  const text = currentList.map(it => it.name).join('\n');  // Join all names with line breaks
  navigator.clipboard.writeText(text)                      // Write to clipboard
    .then(() => alert('Copied to clipboard!'));            // Confirm success
});
