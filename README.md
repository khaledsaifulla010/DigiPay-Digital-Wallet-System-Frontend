# 💸 DigiPay – Digital Wallet System

Welcome to **DigiPay – Digital Wallet System**, a secure, modular, and role-based client application for a digital wallet system inspired by popular platforms like **bKash** and **Nagad**.  
Built using **React.js**, **Redux Toolkit**, and **RTK Query**, this frontend empowers **Users**, **Agents**, and **Admins** to seamlessly interact with the DigiPay backend API for wallet management, transactions, and monitoring.

---

## 🔗 Live URLs

- **Frontend:** [https://digipay-digital-wallet-system-front.vercel.app](https://digipay-digital-wallet-system-front.vercel.app)
- **Backend:** [https://digi-pay-digital-wallet-system-back.vercel.app](https://digi-pay-digital-wallet-system-back.vercel.app)

---

## 🚀 Project Introduction

The DigiPay – Digital Wallet System is built with **modern UI/UX** principles, offering role-based dashboards for **Users**, **Agents**, and **Admins**.  
It features **JWT authentication with refresh tokens**, **real-time wallet updates**, **transaction history**, and **admin controls**, ensuring a smooth and secure financial experience.

---

## 🧭 Project Overview

- **Users** can register, log in, manage their wallet, transfer or withdraw funds, and view transaction history.
- **Agents** can perform cash-in/cash-out operations and track commission stats.
- **Admins** can monitor all wallets, transactions, and users with full control over account statuses.

The app uses **RTK Query** for efficient API data fetching, **Redux Toolkit** for state management, and **React Router** for role-based navigation.

---

## ✨ Features

### Authentication & Authorization

- Secure login and registration with JWT-based tokens.
- Automatic token refresh on expiration.
- Role-based route protection for **Admin**, **Agent**, and **User**.

### User Features

- Register, update profile, and view wallet balance.
- Withdraw, transfer, and view transaction history.

### Agent Features

- Perform **cash-in** and **cash-out** operations.
- Access commission history and statistics.

### Admin Features

- View all users, wallets, and transactions.
- Block/unblock users and wallets.
- Manage agent statuses and oversee all activities.

### General Features

- Modern responsive UI built with TailwindCSS.
- Toast notifications for actions and errors.
- Recharts integration for transaction and commission visualizations.

---

## 🖥️ Frontend API Endpoints

All frontend API calls are routed via **RTK Query** with base URL:

### 🔐 Auth

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| POST   | /auth/login         | Login with email & password |
| POST   | /auth/register      | Register as User/Agent      |
| POST   | /auth/refresh-token | Refresh JWT token           |
| POST   | /auth/logout        | Logout and clear session    |

### 👤 User

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| GET    | /user/me        | Get logged-in user info     |
| PATCH  | /user/me        | Update logged-in profile    |
| GET    | /user/all-users | [Admin] Get all users       |
| GET    | /user/:id       | [Admin] Get user by ID      |
| PATCH  | /user/:id       | [Admin] Change agent status |

### 🏦 Wallet

| Method | Endpoint            | Description                      |
| ------ | ------------------- | -------------------------------- |
| GET    | /wallet/me          | Get logged-in user’s wallet      |
| POST   | /wallet/withdraw    | Withdraw money                   |
| POST   | /wallet/transfer    | Transfer money to another user   |
| POST   | /wallet/cashIn      | [Agent] Add money to user wallet |
| GET    | /wallet/all-wallets | [Admin] Get all wallets          |
| PATCH  | /wallet/:id         | [Admin] Update wallet status     |

### 📜 Transactions

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | /user-transaction             | [User] Get own transaction history |
| GET    | /transaction/all-transactions | [Admin] Get all transactions       |
| GET    | /transaction/:id              | [Admin] Get transaction by ID      |

### 💼 Agent Commission

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| GET    | /agent-commission       | [Agent] Get commission history |
| GET    | /agent-commission/stats | [Agent] Get commission stats   |

---

## ⚙️ Backend API Table

Base URL: `/api/v1`

| Module           | Endpoints                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Auth             | `/auth/login`, `/auth/refresh-token`, `/auth/logout`                                                         |
| User             | `/user/register`, `/user/me`, `/user/all-users`, `/user/:id`                                                 |
| Wallet           | `/wallet/me`, `/wallet/withdraw`, `/wallet/transfer`, `/wallet/cashIn`, `/wallet/all-wallets`, `/wallet/:id` |
| Transactions     | `/user-transaction`, `/transaction/all-transactions`, `/transaction/:id`                                     |
| Agent Commission | `/agent-commission`, `/agent-commission/stats`                                                               |

---

## 🧱 Tech Stack

| Package                        | Description                   |
| ------------------------------ | ----------------------------- |
| `react`                        | Core React library            |
| `react-router-dom`             | Routing and navigation        |
| `@reduxjs/toolkit`             | State management & RTK Query  |
| `react-redux`                  | Redux bindings for React      |
| `react-hook-form`              | Form handling with validation |
| `zod`                          | Schema validation library     |
| `tailwindcss`                  | Utility-first CSS framework   |
| `framer-motion`                | Animations & transitions      |
| `lucide-react`                 | Icon library                  |
| `recharts`                     | Charting library              |
| `react-toastify`               | Toast notifications           |
| `react-joyride`                | Guided product tours          |
| `date-fns`                     | Date utilities                |
| `clsx` & `tailwind-merge`      | Class merging utilities       |
| `vite`                         | Next-gen frontend tooling     |
| `typescript`                   | Type-safe JavaScript          |
| `eslint` + `typescript-eslint` | Linting & code quality        |

---

## ⚙️ Setup Instructions

Clone the project and install dependencies:

```bash
git clone https://github.com/khaledsaifulla010/digipay-digital-wallet-system-frontend.git
cd digipay-digital-wallet-system-frontend
npm install
```

---

<p align="center">
  🛠️ Developed by <strong>Khaled Saifulla</strong> with clean frontend architecture ❤️.
</p>

---
