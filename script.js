
    const fieldUrls = [
        "https://api.thingspeak.com/channels/2694420/fields/1.json",
        "https://api.thingspeak.com/channels/2694420/fields/2.json",
        "https://api.thingspeak.com/channels/2694420/fields/3.json",
        "https://api.thingspeak.com/channels/2694420/fields/4.json",
        "" // Field 5 has no data URL
    ];

    // Function to format the timestamp for the chart (HH:mm)
    function formatChartTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toISOString().slice(11, 16); // Extracts only HH:mm
    }

    // Function to format the timestamp for the table (YYYY-MM-DDHH:mm)
    function formatTableTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toISOString().slice(0, 15).replace("T", ""); // Extracts YYYY-MM-DDHH:mm
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

                // Create the chart with animations and point styling
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