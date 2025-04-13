// ==UserScript==
// @name         United Trip Summary Renderer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extracts and displays flight info from /api/myTrips/lookup JSON on united.com after booking lookup completes, with toggle for raw JSON/summary.
// @author       wangdashuai888
// @include      https://www.united.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// ==/UserScript==
 
(function () {
    'use strict';
 
    const originalXHR = window.XMLHttpRequest;
    class InterceptedXHR extends originalXHR {
        constructor() {
            super();
            let url = '', method = '';
            const origOpen = this.open;
            const origSend = this.send;
 
            this.open = function (m, u) {
                method = m;
                url = u;
                return origOpen.apply(this, arguments);
            };
 
            this.send = function (body) {
                this.addEventListener('load', function () {
                    if (url.includes('/api/myTrips/lookup') && method.toUpperCase() === 'POST') {
                        try {
                            const json = JSON.parse(this.responseText);
                            renderFlightSummary(json);
                        } catch (err) {
                            console.error('❌ Failed to parse response JSON:', err);
                        }
                    }
                });
                return origSend.apply(this, arguments);
            };
        }
    }
    window.XMLHttpRequest = InterceptedXHR;
 
    function renderFlightSummary(data) {
        const flightSegments = data?.Detail?.FlightSegments || [];
        const traveler = data?.Detail?.Travelers?.[0];
        const passengerName = `${traveler?.Person?.GivenName || ''} ${traveler?.Person?.Surname || ''}`;
        const confirmationID = data?.Detail?.ConfirmationID;
        const totalFare = data?.Detail?.Prices?.[0]?.Totals?.find(t => t.Name === 'GrandTotalForCurrency')?.Amount || 'N/A';
        const miles = traveler?.LoyaltyProgramProfile?.Balances?.find(b => b.Characteristics)?.Characteristics?.find(c => c.Code === 'RDM')?.Value || 'N/A';
 
        const wrapper = document.createElement('div');
        wrapper.style = 'background: #f0f8ff; border: 2px solid #0071bc; padding: 16px; margin: 20px; font-family: sans-serif; line-height: 1.6;';
 
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Show Raw JSON';
        toggleBtn.style = 'margin-bottom: 10px; padding: 6px 12px; font-size: 14px; cursor: pointer;';
        wrapper.appendChild(toggleBtn);
 
        const summaryView = document.createElement('div');
        summaryView.innerHTML = `
            <h2>✈️ United Trip Summary</h2>
            <p><strong>Passenger:</strong> ${passengerName}</p>
            <p><strong>Confirmation #:</strong> ${confirmationID}</p>
            <p><strong>Total Fare:</strong> $${totalFare}</p>
            <p><strong>Miles Earned:</strong> ${miles}</p>
            <h3>Flight Segments:</h3>
            ${flightSegments.map(seg => {
                const f = seg.FlightSegment;
                return `
                    <div style="margin-bottom: 10px;">
                        <strong>${f.DepartureAirport?.Name || f.DepartureAirport?.IATACode} → ${f.ArrivalAirport?.Name || f.ArrivalAirport?.IATACode}</strong><br>
                        Flight #: ${f.FlightNumber} | Aircraft: ${f.Equipment?.Model?.Description || 'N/A'}<br>
                        Depart: ${f.DepartureDateTime}<br>
                        Arrive: ${f.ArrivalDateTime}<br>
                        Meal: ${seg.Characteristic?.find(c => c.Code === 'MealDescription')?.Value || 'N/A'}
                    </div>
                `;
            }).join('')}
        `;
 
        const rawJsonView = document.createElement('pre');
        rawJsonView.style.display = 'none';
        rawJsonView.style.maxHeight = '500px';
        rawJsonView.style.overflow = 'auto';
        rawJsonView.style.background = '#fff';
        rawJsonView.style.border = '1px solid #ccc';
        rawJsonView.style.padding = '10px';
        rawJsonView.textContent = JSON.stringify(data, null, 2);
 
        wrapper.appendChild(summaryView);
        wrapper.appendChild(rawJsonView);
        document.body.prepend(wrapper);
 
        toggleBtn.addEventListener('click', () => {
            const showingJson = rawJsonView.style.display === 'block';
            rawJsonView.style.display = showingJson ? 'none' : 'block';
            summaryView.style.display = showingJson ? 'block' : 'none';
            toggleBtn.textContent = showingJson ? 'Show Raw JSON' : 'Show Summary';
        });
    }
})();
