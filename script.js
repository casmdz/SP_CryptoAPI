// // "live" endpoint - request the most recent cryptocurrency rates
// http://api.coinlayer.com/api/live
//     ? access_key = YOUR_ACCESS_KEY
//     & target = GBP
//     & symbols = BTC,ETH

//const getCoinLayerData = async () => {
//   const res = await fetch(apiUrl);
//     const data = await res.json();

const access_key = "6256174128aa3675b54d68e1ed127d51";
const apiUrl = `http://api.coinlayer.com/live?access_key=${access_key}`;
const listUrl = `http://api.coinlayer.com/list?access_key=${access_key}`;

// function getCoinLayerData() {
//     fetch(apiUrl)
//         .then((res) => res.json())
//         .then((data) => {
//             if (data.success) {
//                 const cryptoCode = Object.keys(data.rates);

//                 shuffleArray(cryptoCode);
//                 const resCodes = cryptoCode.slice(0, 5);
//                 const cryptoData = resCodes.map((code) => ({
//                     code,
//                     price: data.rates[code].toFixed(5)
//                 }));
//                 addToPage(cryptoData);
//                 //callback(cryptoData);
//             } else {
//                 console.log('Failed to fetch api data');
//             }
//         })
//         .catch((error) => {
//             console.log('Error', error);
//         })
// };

async function getCoinLayerData() {
    try {
        const [apiResponse, listResponse] = await Promise.all([
            fetch(apiUrl),
            fetch(listUrl),
        ]);
        if (!apiResponse.ok || !listResponse.ok) {
            throw new Error("API request failed");
        }

        const [apiData, cryptoList] = await Promise.all([
            apiResponse.json(),
            listResponse.json(),
        ]);

        if (apiData.success) {
            const cryptoData = Object.keys(apiData.rates).map((code) => ({

                code,
                price: apiData.rates[code].toFixed(5),
                name: cryptoList.crypto[code].name,
                // ? cryptoList.crypto[code].name : code,
                icon_url: cryptoList.crypto[code].icon_url || '',

                
            }));
            addToPage(cryptoData);
        } else {
            console.log("Failed to fetch API data");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function addToPage(cryptoData) {
    const container = document.querySelector("main");
    container.innerHTML = "";

    shuffleArray(cryptoData);

    const displayedCryptoData = cryptoData.slice(0, 5);

    displayedCryptoData.forEach((crypto) => {
        const cryptoContainer = document.createElement("div");
        cryptoContainer.classList.add("created-container");
        cryptoContainer.innerHTML = `
            <div class="coin-info">
                <div class="coin-logo">
                <img src="${crypto.icon_url}" alt="${crypto.name} Logo" />
                </div>
                <div>
                    <h3>$${crypto.price}</h3>
                    <h1>${crypto.name}</h1>
                    <sub>${crypto.code}</sub>
                </div>
            </div>
            `;
        container.appendChild(cryptoContainer);
    });
}

window.addEventListener("load", getCoinLayerData);
