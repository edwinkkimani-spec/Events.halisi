// ==========================================================================
// Events Database
// Each event  includes latitude/longitude so we can calculate
// how far it is from the user's current location.
// ==========================================================================
// NOTE: lat/lng values below are approximate landmark coordinates.

const eventsData = [
    {
        id: "evt-101",
        title: "Kenya Food Festival",
        date: "Aug 14, 2026 • 8:00 AM",
        venue: "Uhuru Gardens, Nairobi",
        category: "Food",
        price: "Ksh2,800",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
        lat: -1.3181,
        lng: 36.8115
    },
    {
        id: "evt-102",
        title: "Victor Thompson - Rooted Tour",
        date: "Aug 23, 2026 • 4:00 PM",
        venue: "Kenyatta International Convention Centre (KICC), Nairobi",
        category: "Music",
        price: "Ksh1,900",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
        lat: -1.2897,
        lng: 36.8219
    },
    {
        id: "evt-103",
        title: "Kenya Food Expo 2026",
        date: "Aug 19-21, 2026",
        venue: "Sarit Expo Centre, Nairobi",
        category: "Expo",
        price: "Ksh1,890",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
        lat: -1.2627,
        lng: 36.8047
    },
    {
        id: "evt-104",
        title: "SEED Business School Festival 2026",
        date: "Aug 27, 2026 • 4:30 PM",
        venue: "Hyatt Regency Nairobi Westlands",
        category: "Business",
        price: "Ksh2,800",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
        lat: -1.2649,
        lng: 36.8039
    },
    {
        id: "evt-105",
        title: "Nairobi International Trade Fair 2026",
        date: "Sep 28, 2026 • 6:00 AM",
        venue: "Jamhuri Park, Nairobi",
        category: "Expo",
        price: "Ksh1,500",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
        lat: -1.3009,
        lng: 36.7794
    }
];

// Holds the user's coordinates once geolocation succeeds
let userLocation = null;

// Remembers which event is being registered for while the modal is open
let pendingEventId = null;


// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    initEventsPage();
    initTicketPage();
    initRegisterModal();
});

// ==========================================================================
// 1. BROWSE EVENTS PAGE LOGIC (Halisi-events.html)
// ==========================================================================
function initEventsPage() {
    const eventListContainer = document.getElementById("event-list");
    const searchInput = document.getElementById("event-search");

    if (!eventListContainer) return; // Exit if not on Halisi-events.html

    // Render Event List
    function renderEvents(events) {
        if (events.length === 0) {
            eventListContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px 0;">
                    <i class="fa-solid fa-calendar-xmark" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
                    <p>No events found matching your search.</p>
                </div>
            `;
            return;
        }

        eventListContainer.innerHTML = events.map(evt => `
            <article class="event-card">
                <img src="${evt.image}" alt="${evt.title}" />
                <div class="event-card-content">
                    <span class="hero-badge" style="width: fit-content; margin-bottom: 8px;">${evt.category}</span>
                    <h3>${evt.title}</h3>
                    <p><i class="fa-regular fa-clock"></i> ${evt.date}</p>
                    <p><i class="fa-solid fa-location-dot"></i> ${evt.venue}</p>
                    ${evt.distanceKm !== undefined
                        ? `<p style="color:#38bdf8;"><i class="fa-solid fa-route"></i> ${evt.distanceKm.toFixed(1)} km away</p>`
                        : ""}
                    <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 16px;">
                        <span style="font-weight: 700; color: #38bdf8; font-size: 1.1rem;">${evt.price}</span>
                        <button class="btn btn-primary" onclick="registerTicket('${evt.id}')">
                            <i class="fa-solid fa-ticket"></i> Get Pass
                        </button>
                    </div>
                </div>
            </article>
        `).join("");
    }

    // Combines the current search text with location-based sorting,
    // then renders. Called on load and whenever the user types or
    // location becomes available.
    function updateView() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

        let list = eventsData.filter(evt =>
            evt.title.toLowerCase().includes(query) ||
            evt.venue.toLowerCase().includes(query) ||
            evt.category.toLowerCase().includes(query)
        );

        // If we know the user's location, attach distance and sort by it
        if (userLocation) {
            list = list.map(evt => ({
                ...evt,
                distanceKm: getDistanceKm(
                    userLocation.lat, userLocation.lng,
                    evt.lat, evt.lng
                )
            })).sort((a, b) => a.distanceKm - b.distanceKm);
        }

        renderEvents(list);
    }

    // Initial render (before we know location, or if location is denied)
    updateView();

    // Ask the browser for the user's location. If granted, recompute
    // distances and re-render sorted nearest-first.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                updateView();
            },
            () => {
                // Permission denied or unavailable — silently fall back
                // to the unsorted list already rendered above.
                console.log("Location unavailable — showing events without distance.");
            }
        );
    }

    // Re-filter as the user types
    if (searchInput) {
        searchInput.addEventListener("input", updateView);
    }
}

// Haversine formula — calculates the distance in kilometers between
// two lat/lng points on Earth's surface.
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

// ==========================================================================
// Registration Modal (same-page form triggered by "Get Pass")

window.registerTicket = function (eventId) {
    const selectedEvent = eventsData.find(e => e.id === eventId);
    if (!selectedEvent) return;

    pendingEventId = eventId;

    const modalTitle = document.getElementById("modalEventTitle");
    const modal = document.getElementById("registerModal"); // Defined locally here

    if (modalTitle) modalTitle.textContent = selectedEvent.title;
    
    if (modal) {
        modal.classList.add("open");
        const form = document.getElementById("registerForm");
        if (form) form.reset();
    }
};

function initRegisterModal() {
    const registerForm = document.getElementById("registerForm");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modal = document.getElementById("registerModal"); // Defined locally here

    // Form submit handler
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const selectedEvent = eventsData.find(ev => ev.id === pendingEventId);
            if (!selectedEvent) return;

            const holderName = document.getElementById("holderName").value.trim();
            const holderEmail = document.getElementById("holderEmail").value.trim();

            const ticketPass = {
                ticketId: "TSMART-" + Math.floor(100000 + Math.random() * 900000),
                eventName: selectedEvent.title,
                holderName: holderName,
                holderEmail: holderEmail,
                registeredAt: new Date().toLocaleString(),
                isScanned: false
            };

            localStorage.setItem("tsmart_active_ticket", JSON.stringify(ticketPass));

            alert(`Success! You got a pass for "${selectedEvent.title}". Redirecting to your ticket...`);
            window.location.href = "qrcode.html";
        });
    }

    // Close on 'X' button click
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener("click", () => {
            modal.classList.remove("open");
        });
    }

    // Close when clicking outside the modal box
    if (modal) {
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("open");
            }
        });
    }
}


// ==========================================================================
// 2. TICKET & GATE SCANNER LOGIC (qrcode.html)
// ==========================================================================
function initTicketPage() {
    const ticketWrapper = document.getElementById("ticketWrapper");
    const scanBtn = document.getElementById("scanTicketBtn");
    const deleteBtn = document.getElementById("deleteTicketBtn");
    const scanMessage = document.getElementById("scanMessage");

    if (!ticketWrapper) return; // Exit if not on qrcode.html

    const rawData = localStorage.getItem("tsmart_active_ticket");

    // Case 1: No Ticket Stored
    if (!rawData) {
        ticketWrapper.innerHTML = `
            <div class="ticket-card" style="padding: 48px 24px;">
                <i class="fa-solid fa-ticket-simple" style="font-size: 3rem; color: #64748b; margin-bottom: 16px;"></i>
                <h3>No Active Ticket Found</h3>
                <p style="color: #94a3b8; margin-bottom: 24px;">You haven't registered for any event pass yet.</p>
                <a href="Halisi-events.html" class="btn btn-primary" style="text-decoration: none; display: inline-block;">Browse Events</a>
            </div>
        `;
        if (scanBtn) scanBtn.parentElement.style.display = "none";
        return;
    }

    // Restore Scanner Box visibility if ticket exists
    if (scanBtn) scanBtn.parentElement.style.display = "block";

    // Case 2: Render Ticket Details & QR Code
    const ticket = JSON.parse(rawData);

    document.getElementById("ticket-event").textContent = ticket.eventName;
    document.getElementById("ticket-name").textContent = ticket.holderName;
    document.getElementById("ticket-id").textContent = ticket.ticketId;

    const qrContainer = document.getElementById("qrcode-box");
    qrContainer.innerHTML = ""; // Clear existing QR

    // Generate QR Code using QRCodeJS Library
    if (typeof QRCode !== "undefined") {
        new QRCode(qrContainer, {
            text: JSON.stringify({ id: ticket.ticketId, event: ticket.eventName }),
            width: 160,
            height: 160,
            colorDark: "#0f172a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Check scanned status UI state
    if (ticket.isScanned && scanMessage) {
        scanMessage.style.color = "#f43f5e";
        scanMessage.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> TICKET ALREADY USED AT GATE`;
    }

    // Scan Event Listener
    if (scanBtn) {
        // Remove old listeners to prevent duplicates
        const newScanBtn = scanBtn.cloneNode(true);
        scanBtn.parentNode.replaceChild(newScanBtn, scanBtn);

        newScanBtn.addEventListener("click", () => {
            let current = JSON.parse(localStorage.getItem("tsmart_active_ticket"));
            if (!current) return;

            const msg = document.getElementById("scanMessage");

            if (current.isScanned) {
                msg.style.color = "#f43f5e";
                msg.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ENTRY DENIED: Ticket ID ${current.ticketId} has already been scanned!`;
            } else {
                current.isScanned = true;
                localStorage.setItem("tsmart_active_ticket", JSON.stringify(current));

                msg.style.color = "#10b981";
                msg.innerHTML = `<i class="fa-solid fa-circle-check"></i> ACCESS GRANTED! Pass validated successfully.`;
            }
        });
    }

    // Delete Event Listener
    if (deleteBtn) {
        const newDeleteBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

        newDeleteBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to cancel and delete this active pass?")) {
                localStorage.removeItem("tsmart_active_ticket");
                if (scanMessage) scanMessage.textContent = "";
                initTicketPage(); // Refresh view state
            }
        });
    }
}