# Product Listing App — Assignment Submission

This project implements the required features listed in the assignment using **Next.js**, **Zustand**, **TanStack Query**, **shadcn/ui**, and **TailwindCSS**.  
The application fetches products from a <a href="https://dummyjson.com/products/">dummy API</a>, allows filtering, infinite scrolling, and includes optional enhancements.

## Implemented Features

### **Core Requirements**

- **Homepage with Product List**  
  Products are fetched from a dummy API using **TanStack Query** for caching & request management.

- **Search Bar**  
  Users can filter products by name in real time.

- **Category Filter Dropdown**  
  A dropdown allows filtering products by category.

- **Infinite Scroll**  
  Additional products are automatically loaded when the user scrolls to the bottom of the page.

- **Responsive Design**  
  Fully responsive layout built with **TailwindCSS** and **shadcn/ui** components.

## Bonus Features (Implemented)

- **Dark/Light Theme Toggle**  
  Theme switching implemented using `next-themes`.

- **Sort Options**  
  Users can sort products by **price** or **rating**.

- **Add to Cart Functionality**  
  Cart state handled with **Zustand**, with item count updates and persistence.

- **Improved Loading States**  
  Skeleton loaders and subtle animations added for a smoother UX.

## Tech Stack

### **Frontend Framework**

- **Next.js 14** (App Router)

### **State Management**

- **Zustand** — lightweight global store for cart and UI states.

### **Data Fetching**

- **TanStack Query** — for caching, refetching, and managing API states.

### **UI & Styling**

- **TailwindCSS**
- **shadcn/ui** component library
- **Lucide Icons**

### **Other Tools**

- <a href="https://dummyjson.com/products/"> DummyJSON / FakeStore API </a>
- Next Themes for dark/light toggle

## Running the Project

### Setup .env

create a .env file in the project root directory

```env
NEXT_PUBLIC_BASE_URL = "https://dummyjson.com/products"
```

```bash
npm install
npm run dev
```

The project will be available at:

```
http://localhost:3000
```

## Folder Structure (Simplified)

```
/app
  /products
  /components
  /hooks
  /store (zustand)
  /lib (helpers)
```
