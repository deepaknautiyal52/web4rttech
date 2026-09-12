# Infosys Website Clone - React

A professional clone of the Infosys website built with React.js. This project demonstrates modern web development practices including responsive design, component architecture, and routing.

## 🌐 Live Demo

This is a React-based clone of https://www.infosys.com/

## ✨ Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI** - Clean and professional interface with smooth animations
- **Multiple Pages**:
  - Home - Hero section, services overview, latest news
  - About Us - Company information and values
  - Services - Comprehensive list of services offered
  - Careers - Job openings and internship information
  - Contact - Contact form and office information
- **Navigation** - Sticky header with smooth navigation
- **Footer** - Comprehensive footer with multiple sections
- **CSS Styling** - Modern CSS with animations and transitions

## 📋 Project Structure

```
infosys-clone/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── AboutUs.jsx
│   │   ├── AboutUs.css
│   │   ├── Services.jsx
│   │   ├── Services.css
│   │   ├── Careers.jsx
│   │   ├── Careers.css
│   │   ├── Contact.jsx
│   │   └── Contact.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   └── index.css
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
cd c:\xampp\htdocs\infosys-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 🔁 Laravel Backend

This project includes an optional Laravel backend located at `backend` (created with Composer). Use the instructions below to set it up and run it alongside the React frontend.

### Prerequisites
- PHP (installed and available in PATH)
- Composer
- MySQL (XAMPP) or another database server

### Install and run Laravel
1. Change to the backend folder:
```bash
cd C:\xampp\htdocs\infosys-clone\backend
```
2. Install PHP dependencies (if needed):
```bash
composer install
```
3. Copy the example env and set your DB credentials (update DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD):
```bash
copy .env.example .env
# edit .env with your database values
```
4. Generate the application key:
```bash
php artisan key:generate
```
5. (Optional) Run migrations:
```bash
php artisan migrate
```
6. Start the development server:
```bash
php artisan serve --host=127.0.0.1 --port=8000
```
The backend will be available at `http://127.0.0.1:8000`.

### Notes
- If you prefer to serve Laravel via XAMPP/Apache, point a virtual host to the `backend/public` directory and ensure PHP and Apache are configured correctly.
- To use the API from the React app, update any API URLs in the frontend to point to `http://127.0.0.1:8000` (or your configured host/port).


## 🎨 Color Scheme

- **Primary Blue**: `#003478` - Main brand color
- **Dark Blue**: `#0056a8` - Hover/secondary color
- **Light Gray**: `#f5f5f5` - Background
- **Dark Gray**: `#1a1a1a` - Footer background

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px to 1024px
- **Mobile**: Below 768px

## 🔧 Technologies Used

- **React 18.2** - UI Library
- **React Router v6** - Client-side routing
- **CSS3** - Styling with flexbox and grid
- **JavaScript ES6+** - Modern JavaScript

## 📦 Available Scripts

### `npm start`
Runs the app in development mode. Open http://localhost:3000 in your browser.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## 🎯 Pages Overview

### Home
- Hero section with main tagline
- Company purpose statement
- Service cards overview
- Latest news/updates section
- Call-to-action section

### About Us
- Company information
- Global presence highlights
- Core values

### Services
- Detailed service offerings (8 different services)
- Service descriptions and icons
- Benefits of choosing Infosys

### Careers
- Why work at Infosys (6 reasons)
- Current job openings
- Internship programs information

### Contact
- Contact form (Name, Email, Phone, Company, Subject, Message)
- Office locations
- Phone and email contact information
- Social media links
- Business hours

## 🔗 Navigation Structure

```
/               - Home page
/about          - About Us page
/services       - Services page
/careers        - Careers page
/contact        - Contact page
```

## 💡 Component Highlights

### Header
- Sticky positioning
- Responsive hamburger menu for mobile
- Navigation links with hover effects
- Infosys logo/branding

### Footer
- Multiple footer sections (Company, Subsidiaries, Programs)
- Social media links
- Footer bottom with copyright and legal links
- Responsive grid layout

### Service Cards
- Hover animations with elevation effect
- Icon display
- Service descriptions
- Learn more links

## 🎨 Key Features

1. **Smooth Animations**
   - Hover effects on cards and buttons
   - Smooth transitions on all interactive elements
   - Elevation effects on scroll

2. **Responsive Grid Layouts**
   - Services grid (4 columns on desktop, responsive on mobile)
   - News grid
   - Contact form with two-column layout

3. **Professional Forms**
   - Contact form with multiple input types
   - Form validation
   - Focus states for accessibility

4. **Accessibility**
   - Semantic HTML
   - Proper heading hierarchy
   - Form labels and inputs
   - Button styling for visibility

## 🚀 Deployment

To deploy this project:

1. Build the project:
```bash
npm build
```

2. Upload the `build` folder contents to your web hosting service or deploy to:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3
   - Any static hosting service

## 📝 License

This is a clone for educational purposes. Infosys is a registered trademark of Infosys Limited.

## 👨‍💻 Author

Created as a React learning project demonstrating modern web development practices.

## 🤝 Contributing

Feel free to fork this project and submit pull requests with improvements.

## 📧 Support

For questions or issues, please create an issue in the repository.

---

**Note**: This is a clone for educational purposes only. All content is inspired by the official Infosys website.
