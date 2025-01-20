const charactersContainer = document.getElementById("characters-container");
const errorMessage = document.getElementById("error-message");
const nextPageButton = document.getElementById("next-page-button");
const previousPageButton = document.getElementById("previous-page-button");
let currentPage = 1;
const imageCache = new Set(); // A set to store cached images

async function fetchCharacters(page) {
    try {
        const response = await fetch(
            `https://rickandmortyapi.com/api/character?page=${page}`
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        charactersContainer.innerHTML = "";
        data.results.forEach((character) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
            <img src="${character.image}" alt="${character.name}" class="character-image" onclick="toggleInfo(this)">
            <div class="character-info">
              <p class="character-detail"><span class="attribute">Name:</span> ${character.name}</p>
              <p class="character-detail"><span class="attribute">Status:</span> ${character.status}</p>
              <p class="character-detail"><span class="attribute">Species:</span> ${character.species}</p>
            </div>
        `;
            charactersContainer.appendChild(card);
            imageCache.add(character.image); // Cache the image
        });

        // Preload images for the next and previous pages within 5 pages range
        if (page < 42) {
            preloadImages(page + 1);
        }
        if (page > 1) {
            preloadImages(page - 1);
        }
        if (page - 5 >= 1) {
            preloadImages(page - 5);
        }
        if (page + 5 <= 42) {
            preloadImages(page + 5);
        }
    } catch (error) {
        errorMessage.textContent = "Error fetching characters: " + error.message;
    }
}

function preloadImages(page) {
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
            if (data && data.results) {
                data.results.forEach((character) => {
                    if (!imageCache.has(character.image)) {
                        // Only cache new images
                        const img = new Image();
                        img.src = character.image;
                        imageCache.add(character.image);
                    }
                });
            }
        })
        .catch((error) => {
            console.error("Error preloading images:", error);
        });
}

function toggleInfo(image) {
    const info = image.nextElementSibling;
    info.style.display =
        info.style.display === "none" || !info.style.display ? "block" : "none";
}

nextPageButton.addEventListener("click", () => {
    if (currentPage < 42) {
        currentPage += 1;
        fetchCharacters(currentPage);
    }
});

previousPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        fetchCharacters(currentPage);
    }
});

fetchCharacters(currentPage);