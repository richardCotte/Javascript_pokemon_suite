// Selection des elements html
const input = document.querySelector('input[name=pokemon-name]');
const searchButton = document.querySelector('button.search');
const errorLabel = document.querySelector('label');
const pokeCardTemplate = document.querySelector('.poke-card');
const pokeList = document.querySelector('.poke-list');

/**
 * Essaie de trouver un pokemon correspondant au nom en parametre
 * @param {string} name Le nom en anglais du pokemon
 */
async function tryFetchPokemon(name) {
    // Valide que le nom n'est pas vide
    if (name.length === 0) {
        return;
    }
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
        return;
    }
    return await response.json();
}

function showError() {
    errorLabel.classList.remove('hidden');
}

function clearError() {
    errorLabel.classList.add('hidden');
}

/**
 * Affiche les pokemon passes en parametres
 * @param {Array} pokemonList Tableau de pokemon
 */
function displayPokemons(pokemonList) {
    // On supprime les anciennes cartes
    while (pokeList.firstChild) {
        pokeList.firstChild.remove();
    }
    // On en cree de nouvelle pour chaque valeur du tableau
    pokemonList.forEach(pokemon => {
        const node = createPokemonNode(pokemon);
        // On ajoute la carte dans l'element pokelist
        pokeList.appendChild(node);
    });
}

/**
 * Creer une carte affichant un pokemon
 * @param {object} pokemon 
 */
function createPokemonNode(pokemon) {
    // Clonage du template
    const card = pokeCardTemplate.cloneNode(true);
    // Selection des elements a changer dans le clone
    const name = card.querySelector('.name');
    const weight = card.querySelector('.weight');
    const img = card.querySelector('img');
    const types = card.querySelector('.types');

    // Insertion des donnees dans le clone
    name.textContent = pokemon.name;
    weight.textContent = `${pokemon.weight}Kg`;
    img.src = pokemon.sprites.front_default;

    // Suppression des anciens types
    while (types.firstChild) {
        types.firstChild.remove();
    }
    console.log(pokemon.types);
    // Ajout des nouveaux types
    pokemon.types.forEach(type => {
        const span = document.createElement('span');
        span.classList.add('type');
        span.innerText = type.type.name;
        types.appendChild(span);
    });
    card.classList.remove('hidden');
    // On retourne la carte ainsi cree
    return card;
}

// Liste des pokemon requete
const pokemons = [];

/**
 * Essaie de trouver un pokemon correspondant a la recherche
 * Et l'affiche dans l'HTML
 */
async function searchAndDisplayPokemon() {
    const pokemon = await tryFetchPokemon(input.value);

    // Une erreur, on quitte la fonction après avoir afficher une erreur.
    if (!pokemon) {
        showError();
        return;
    } else {
        // Sinon on ajoute le pokemon
        pokemons.push(pokemon);
        console.log(pokemon);
        clearError();
    }

    // Enfin on affiche la liste
    displayPokemons(pokemons);
}

searchButton.addEventListener('click', searchAndDisplayPokemon);