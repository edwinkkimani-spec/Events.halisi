// Sample Events Database
const eventsData = [
    {
        id: "evt-101",
        title: "Halisi Music Fest 2026",
        date: "Aug 15, 2026 • 6:00 PM",
        venue: "Nairobi City Park",
        category: "Music",
        price: "$25.00",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "evt-102",
        title: "Tech Innovation Summit",
        date: "Sep 02, 2026 • 9:00 AM",
        venue: "Convention Center Hall A",
        category: "Tech",
        price: "$40.00",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "evt-103",
        title: "Afrobeat & Culture Night",
        date: "Sep 18, 2026 • 8:30 PM",
        venue: "The Dome Lounge",
        category: "Culture",
        price: "$15.00",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
    }
];

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    initEventsPage();
    initTicketPage();
});

/* ==========================================================================
   1. BROWSE EVENTS PAGE LOGIC (Halisi-events.html)
   ========================================================================== */
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