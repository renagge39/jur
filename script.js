const fieldUrls = [
    "https://api.thingspeak.com/channels/2694420/fields/1.json?results=50",
    "https://api.thingspeak.com/channels/2694420/fields/2.json?results=50",
    "https://api.thingspeak.com/channels/2694420/fields/3.json?results=50",
    "https://api.thingspeak.com/channels/2694420/fields/4.json?results=50",
];

// Function to format the timestamp for the chart (HH:mm)
function formatChartTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // HH:mm format
}

// Function to format the timestamp for the table (YYYY-MM-DD HH:mm)
function formatTableTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false,
        timeZone: 'Asia/Jakarta', // GMT+7 timezone
    }).replace(',', ''); // Removing unnecessary comma for cleaner formatting
}

// Function to fetch and display the latest data
function fetchData(fieldIndex) {
    if (fieldIndex === 4) {
        // Field 5 has no data, display empty chart and table
        const emptyData = {
            feeds: []
        };
        updateEmptyData(fieldIndex);
        return;
    }

    return fetch(fieldUrls[fieldIndex])
        .then(response => response.json())
        .then(data => {
            const latestFeed = data.feeds[data.feeds.length - 1]; // Get the latest feed data
            const latestTimestampForTable = formatTableTimestamp(latestFeed.created_at); // Format the timestamp for table
            const latestTimestampForChart = formatChartTimestamp(latestFeed.created_at); // Format the timestamp for chart
            const latestValue = latestFeed[`field${fieldIndex + 1}`];

            // Update the table with the latest data
            const tableBody = document.querySelector(`#table${fieldIndex + 1} tbody`);
            tableBody.innerHTML = ''; // Clear the table
            const row = document.createElement('tr');
            const timestampCell = document.createElement('td');
            const valueCell = document.createElement('td');
            timestampCell.textContent = latestTimestampForTable;
            valueCell.textContent = latestValue;
            row.appendChild(timestampCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);

            // Data for chart
            const labels = data.feeds.map(feed => formatChartTimestamp(feed.created_at)); // Format each timestamp for chart
            const chartData = data.feeds.map(feed => feed[`field${fieldIndex + 1}`]);

            // Create the chart with customizations
            new Chart(document.getElementById(`chart${fieldIndex + 1}`), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `Field ${fieldIndex + 1} Data`,
                        data: chartData,
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'][fieldIndex],
                        fill: false,
                        pointStyle: 'circle',  // Point style (circle, triangle, etc.)
                        pointRadius: 5,  // Size of the points
                        pointBackgroundColor: '#fff', // Point color
                        borderWidth: 2,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    animation: {
                        duration: 1000, // Animation duration
                        easing: 'easeInOutQuad', // Easing effect for smooth animation
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Timestamp',
                                color: '#000'
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 30
                            },
                            grid: {
                                color: '#f0f0f0',
                                borderColor: '#ddd',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Value',
                                color: '#000'
                            },
                            grid: {
                                color: '#f0f0f0',
                                borderColor: '#ddd',
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 14
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                        }
                    }
                }
            });
        })
        .catch(error => console.error(`Error fetching data for field ${fieldIndex + 1}:`, error));
}

// Handle empty data for Field 5
function updateEmptyData(fieldIndex) {
    const tableBody = document.querySelector(`#table${fieldIndex + 1} tbody`);
    tableBody.innerHTML = ''; // Clear the table
    const row = document.createElement('tr');
    const timestampCell = document.createElement('td');
    const valueCell = document.createElement('td');
    timestampCell.textContent = 'No data';
    valueCell.textContent = '-';
    row.appendChild(timestampCell);
    row.appendChild(valueCell);
    tableBody.appendChild(row);

    // Empty chart for Field 5
    new Chart(document.getElementById(`chart${fieldIndex + 1}`), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: `Field ${fieldIndex + 1} Data`,
                data: [],
                borderColor: 'rgba(0, 0, 0, 0.1)',
                fill: false,
                pointStyle: 'circle', 
                pointRadius: 5,
                pointBackgroundColor: '#fff',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuad',
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}

// Switch between fields
function switchField(fieldIndex) {
    // Hide all field cards
    const allCards = document.querySelectorAll('.field-card');
    allCards.forEach(card => card.classList.remove('active'));

    // Show the selected field card
    const selectedCard = document.querySelector(`#fieldCard${fieldIndex + 1}`);
    selectedCard.classList.add('active');

    // Fetch data for the selected field
    fetchData(fieldIndex);
}

// Initially display Field 1
switchField(0);
