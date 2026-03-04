# Anandaahar Family Restaurant

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Restaurant website for "Anandaahar Family Restaurant"
- Menu page: display food categories and items with name, description, price
- Online ordering: customers can browse menu and place food orders
- Table booking: customers can book a table by selecting date, time, number of guests, and providing contact info
- Location page: embedded map or address display with directions info
- Home/landing page with restaurant branding, hero section, highlights

### Modify
- N/A

### Remove
- N/A

## Implementation Plan

### Backend
- `MenuItem` type: id, name, description, price, category, isAvailable
- `Order` type: id, items (list of MenuItem ids + quantities), customerName, phone, totalAmount, status, timestamp
- `TableBooking` type: id, customerName, phone, date, time, guestCount, status, timestamp
- Seed sample menu items across categories (Starters, Main Course, Breads, Desserts, Drinks)
- CRUD for menu items (admin: add/update/remove; public: read)
- Place order (public)
- Get orders (admin)
- Create table booking (public)
- Get bookings (admin)

### Frontend
- Navbar with links: Home, Menu, Order, Book a Table, Location
- Home page: hero banner, restaurant tagline, quick links to menu/order/booking
- Menu page: category tabs, menu item cards with name, description, price, add-to-cart button
- Order page: cart view, customer info form (name, phone), place order button, order confirmation
- Book a Table page: date picker, time selector, guest count, name/phone form, submit booking
- Location page: restaurant address, map embed (static or iframe), opening hours
- Responsive design for mobile and desktop
