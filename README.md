# Agri-Trek: Precision Clustering of Aerial Objects Using Trajectory Analysis

![Agri-Trek Platform](https://pplx-res.cloudinary.com/image/private/user_uploads/Q details, land parcels, government schemes, and analyzing aerial imagery using trajectory-based clustering techniques.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌾 About

Agri-Trek is a specialized software solution designed to computerize farmer and land details along with beneficiary schemes information. The platform integrates advanced aerial image analysis capabilities using trajectory-based clustering algorithms to help identify patterns and insights from drone or satellite imagery of agricultural lands.

## ✨ Features

- **Farmer Management**: Register and manage farmer profiles with personal and contact details
- **Land Parcel Management**: Track land ownership, size, location, and characteristics
- **Scheme Management**: Configure and monitor government schemes and benefits
- **Beneficiary Tracking**: Link farmers to schemes and track application status
- **Aerial Data Analysis**: Upload and process aerial imagery
- **Trajectory Analysis**: Precision clustering of objects identified in aerial imagery
- **Interactive Dashboard**: Visual representation of key metrics and insights
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 💻 Technologies

- **Backend**:
  - Laravel 11.x
  - MySQL/PostgreSQL
  - RESTful API architecture

- **Frontend**:
  - React.js
  - Material UI (MUI)
  - Chart.js for data visualization

## 🚀 Installation

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 16.x
- NPM or Yarn
- MySQL/PostgreSQL

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agri-trek.git
cd agri-trek
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install JavaScript dependencies:
```bash
npm install
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Configure your database in the `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=agri_trek
DB_USERNAME=root
DB_PASSWORD=
```

6. Generate application key:
```bash
php artisan key:generate
```

7. Run migrations:
```bash
php artisan migrate
```

8. Build frontend assets:
```bash
npm run dev
```

9. Start the development server:
```bash
php artisan serve
```

## 🖥️ Usage

1. Access the application at `http://localhost:8000`
2. Register an admin account or use the default credentials:
   - Email: admin@agritrek.com
   - Password: password
3. Start by adding farmers, lands, and schemes through the intuitive interface
4. Upload aerial data for analysis through the Aerial Data section
5. Run trajectory analysis on uploaded data to identify patterns and clusters

## 📚 API Documentation

The API endpoints are organized around the following resources:

- `/api/farmers` - Farmer management endpoints
- `/api/lands` - Land parcel management endpoints
- `/api/schemes` - Scheme management endpoints
- `/api/beneficiaries` - Beneficiary tracking endpoints
- `/api/aerial-data` - Aerial data management endpoints
- `/api/trajectory-analyses` - Analysis endpoints

For detailed API documentation, refer to the [API Documentation](docs/api.md) file.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


