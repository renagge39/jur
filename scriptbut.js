const apiKey = '4KD6KEAUSVF36RFB';
const channelID = '2694420';

// Initialize values for fields
let field6Value = 10;
let field7Value = 20;
let field8Value = 30;

// Function to toggle the button states and update corresponding values
function toggleButton(buttonId, statusId, fieldValue, fieldOnValue, fieldOffValue) {
    const button = document.getElementById(buttonId);
    const status = document.getElementById(statusId);

    if (button.classList.contains('btn-off')) {
        button.classList.remove('btn-off');
        button.classList.add('btn-on');
        button.innerHTML = `Buton ${buttonId.slice(-1)} (ON) <i class="fas fa-check-circle"></i>`;
        status.innerText = `Status: ON`;
        fieldValue = fieldOnValue;
    } else {
        button.classList.remove('btn-on');
        button.classList.add('btn-off');
        button.innerHTML = `Buton ${buttonId.slice(-1)} (OFF) <i class="fas fa-power-off"></i>`;
        status.innerText = `Status: OFF`;
        fieldValue = fieldOffValue;
    }

    return fieldValue;
}

// Event listeners for each button
document.getElementById("button1").addEventListener('click', () => {
    field6Value = toggleButton('button1', 'status1', field6Value, 11, 10);
});

document.getElementById("button2").addEventListener('click', () => {
    field7Value = toggleButton('button2', 'status2', field7Value, 21, 20);
});

document.getElementById("button3").addEventListener('click', () => {
    field8Value = toggleButton('button3', 'status3', field8Value, 31, 30);
});

// Function to check the state of the switches and update the boxes
async function checkSwitchStates() {
    try {
        // Fetch data for each field
        const responseField6 = await fetch(`https://api.thingspeak.com/channels/${channelID}/fields/6.json?api_key=${apiKey}&results=1`);
        const responseField7 = await fetch(`https://api.thingspeak.com/channels/${channelID}/fields/7.json?api_key=${apiKey}&results=1`);
        const responseField8 = await fetch(`https://api.thingspeak.com/channels/${channelID}/fields/8.json?api_key=${apiKey}&results=1`);

        const dataField6 = await responseField6.json();
        const dataField7 = await responseField7.json();
        const dataField8 = await responseField8.json();

        if (dataField6.feeds.length > 0) {
            const field6Value = dataField6.feeds[0].field6;
            if (field6Value === "11") {
                document.getElementById("kotak1").classList.add("on");
                document.getElementById("kotak1").classList.remove("off");
                kotak1.innerHTML = '<i class="fa-regular fa-lightbulb fa-bounce"></i>'
            } else if (field6Value === "10") {
                document.getElementById("kotak1").classList.add("off");
                document.getElementById("kotak1").classList.remove("on");
                kotak1.innerHTML = '<i class="fa-regular fa-lightbulb "></i>'
            }
        }

        if (dataField7.feeds.length > 0) {
            const field7Value = dataField7.feeds[0].field7;
            if (field7Value === "21") {
                document.getElementById("kotak2").classList.add("on");
                document.getElementById("kotak2").classList.remove("off");
                kotak2.innerHTML = ` <i class="fa-solid fa-fan fa-spin fa-spin-reverse"></i>`;
            } else if (field7Value === "20") {
                document.getElementById("kotak2").classList.add("off");
                document.getElementById("kotak2").classList.remove("on");
                kotak2.innerHTML = ` <i class="fa-solid fa-fan "></i>`;
            }
        }

        if (dataField8.feeds.length > 0) {
            const field8Value = dataField8.feeds[0].field8;
            if (field8Value === "31") {
                document.getElementById("kotak3").classList.add("on");
                document.getElementById("kotak3").classList.remove("off");
                 kotak3.innerHTML ='<i class="fa-solid fa-faucet-drip "></i>'
            } else if (field8Value === "30") {
                document.getElementById("kotak3").classList.add("off");
                document.getElementById("kotak3").classList.remove("on");
                kotak3.innerHTML ='<i class="fa-solid fa-faucet"></i>'
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Initially check the switch states
checkSwitchStates();

// Set an interval to check every 1 seconds
setInterval(checkSwitchStates, 1000);

// Update function to send data to ThingSpeak
document.getElementById("updateButton").addEventListener("click", async () => {
    const countdownElement = document.getElementById("countdown");
    updateButton.disabled = true;
    updateButton.classList.add("disabled");
    // Reset countdown
    let countdown = 10;
    countdownElement.innerText = `${countdown}s`;
    countdownElement.classList.add("animate");

    // Start countdown
    const countdownInterval = setInterval(() => {
        countdown -= 1;
        countdownElement.innerText = `${countdown}s`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdownElement.innerText = "Done!";
            countdownElement.classList.remove("animate");
            // Re-enable the update button
            updateButton.disabled = false;
            updateButton.classList.remove("disabled");
            setTimeout(() => {
                countdownElement.innerText = ""; // Clear the text
            }, 1000);
        }
    }, 1000);

    // Delay for 1 miliseconds before sending the update
    setTimeout(async () => {
        const apiUrl = `https://api.thingspeak.com/update?api_key=JKZFBI2I1N8XFICW&field6=${field6Value}&field7=${field7Value}&field8=${field8Value}`;
        try {
            const response = await fetch(apiUrl);
            const jsonResponse = await response.json();
            document.getElementById("response").innerText = `Response: ${JSON.stringify(jsonResponse)}`;
            document.getElementById("response").style.display = "block"; // Show the response
        } catch (error) {
            document.getElementById("response").innerText = `Error: ${error.message}`;
            document.getElementById("response").style.display = "block"; // Show the error
        }
        document.getElementById("loading").style.display = "none"; // Hide loading spinner
    }, 100);

    document.getElementById("loading").style.display = "flex"; // Show loading spinner
});


const urls = [
    "https://api.thingspeak.com/channels/2694420/fields/6.json?results=10",
    "https://api.thingspeak.com/channels/2694420/fields/7.json?results=10",
    "https://api.thingspeak.com/channels/2694420/fields/8.json?results=10"
];

// Fungsi untuk format tanggal ke format "30-10-24 12.00"
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}.${minutes}`;
}

// Fungsi untuk mengambil data dari beberapa URL Thingspeak
async function fetchMultiData() {
    try {
        // Fetch data dari semua URL
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const jsonData = await Promise.all(responses.map(response => response.json()));

        // Ekstraksi data untuk chart
        const labels = jsonData[0].feeds.map(feed => formatDate(feed.created_at)); // Format tanggal
        const datasets = [
            {
                label: "Lampu",
                data: jsonData[0].feeds.map(feed => parseFloat(feed.field6) || 0),
                borderColor: "rgba(255, 99, 132, 1)", // Warna garis
                stepped: true // Stepped line style
            },
            {
                label: "Kipas Angin",
                data: jsonData[1].feeds.map(feed => parseFloat(feed.field7) || 0),
                borderColor: "rgba(54, 162, 235, 1)", // Warna garis
                stepped: true // Stepped line style
            },
            {
                label: "Pompa Air",
                data: jsonData[2].feeds.map(feed => parseFloat(feed.field8) || 0),
                borderColor: "rgba(75, 192, 192, 1)", // Warna garis
                stepped: true // Stepped line style
            }
        ];

        // Membuat chart setelah data diperoleh
        createChart(labels, datasets);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fungsi untuk membuat chart menggunakan Chart.js
function createChart(labels, datasets) {
    const ctx = document.getElementById("multiChart").getContext("2d");
    new Chart(ctx, {
        type: "line", // Line chart
        data: {
            labels: labels, // Label untuk sumbu X (timestamp)
            datasets: datasets // Dataset untuk 3 fields
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Fleksibel mengikuti ukuran container
            plugins: {
                legend: {
                    position: 'top', // Posisi legend
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Timestamp" // Judul untuk sumbu X
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Value" // Judul untuk sumbu Y
                    }
                }
            }
        }
    });
}

// Memanggil fungsi untuk fetch data dan membuat chart
fetchMultiData();
setInterval(fetchMultiData, 3000);