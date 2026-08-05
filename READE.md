 T-Smart | Smart Digital Ticketing Web Application

T-Smart is an end-to-end digital ticketing and entry verification platform designed for event organizers and attendees. It eliminates physical ticket counterfeiting by producing dynamically rendered, single-use QR pass entries linked directly to attendee registrations.

---

##  Key Features

1. **Semantic & Responsive Layout**: Clean, accessible markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) with sidebar drawer navigation.
2. **Event Browsing & Dynamic Search**: Instant client-side search filtering across upcoming Halisi events by title, venue, or category.
3. **Registration Form Validation**: Complete user details validation (Name, Email, Phone, Pass Type) before ticket generation.
4. **Data Persistence via `localStorage`**: Registration data persists across web pages without requiring a backend server.
5. **Smart Ticket & QR Code Generation**: Instant QR code generation encoding attendee registration metadata.
6. **Single-Use Entry Verification Simulator**: Entrance gate simulation that marks tickets as **USED/SCANNED** to block reuse and duplication.

---

## Project Structure

* `index.html`: Landing homepage featuring platform introduction, key stats, and an about section.
* `Halisi-events.html`: Directory listing for Halisi events, live search bar, and interactive registration modal.
* `qrcode.html`: Smart Digital Pass rendering page displaying QR codes and entrance gate validation scanner.
* `styles.css`: Centralized stylesheet featuring modern glassmorphic accents, CSS grid/flexbox layouts, dark mode theme, and mobile responsiveness.
* `script.js`: Core application logic covering UI events, DOM updates, form validation, localStorage persistence, and QR rendering.

---

##  Technology Stack

* **HTML5**: Semantic elements and structured document architecture.
* **CSS3**: CSS Variables, Flexbox, CSS Grid, media queries, CSS transitions.
* **JavaScript (ES6+)**: DOM manipulation, event listeners, form validation, state management via Web Storage API.
* **Libraries**: 
  * [FontAwesome v6.4.0](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css) (Icons)
  * [QRCode.js v1.0.0](https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js) (QR Code rendering)

---

##  How to Run the Project Locally

1. Clone or download the repository files into a single directory:
   ```bash
   git clone [https://github.com/your-username/t-smart-ticketing.git](https://github.com/your-username/t-smart-ticketing.git)
   cd t-smart-ticketing