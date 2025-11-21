const searchInput = document.getElementById("navSearchInput");
const searchBtn = document.getElementById("navSearchBtn");
const resetBtn = document.getElementById("navResetBtn");
const resultContainer = document.getElementById("resultContainer");

resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    resultContainer.innerHTML = "";
});

async function loadData() {
    try {
        const response = await fetch("travel_recommendation_api.json");
        if (!response.ok) {
            throw new Error(`HTTP error, status ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Failed to fetch:", error);
        return null;
    }
}

function displayResults(items) {
    resultContainer.innerHTML = "";

    items.forEach(item => {
        resultContainer.innerHTML +=
            `<div class = "resultCard">
            <img src = "${item.imageUrl}" alt = "${item.name}">
            <div class = "cardContent">
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            </div>
        </div>`;
    });
}

searchBtn.addEventListener("click", async () => {
    const keyword = searchInput.value.toLowerCase().trim();
    const data = await loadData();

    if (!keyword) {
        resultContainer.innerHTML = "<p>Please type something...</p>";
        return;
    }

    let results = [];

    if (keyword.includes("city")) {
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                results.push(city);
            });
        });
    }
    else if (keyword.includes("temple")) {
        results = data.temples;
    }
    else if (keyword.includes("beach")) {
        results = data.beaches;
    }


    else {
        data.countries.forEach(country => {
            if (country.name.toLowerCase().includes(keyword)) {
                country.cities.forEach(city => {
                    results.push(city);
                });
            }
            else {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword)) {
                        results.push(city);
                    }
                });
            }
        });
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(keyword)) {
                results.push(beach);
            }
        });
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(keyword)) {
                results.push(temple);
            }
        });
    }

    displayResults(results);
});