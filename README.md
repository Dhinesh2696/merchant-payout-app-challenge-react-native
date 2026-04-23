# Merchant Payout App – Take Home Challenge

## Overview

This project implements a simplified merchant payout application using React Native (Expo). It allows users to:

- View account balance and recent activity  
- Browse transaction history with pagination  
- Initiate payouts with validation and confirmation  
- Handle real-world scenarios such as network failures and biometric authentication  

The focus was to build a clean, maintainable, and production-like solution rather than just a UI demo.

---

## Approach

I approached this challenge with a real-world product mindset, particularly considering reliability in financial flows.

Key goals:
- Clear separation of concerns (UI, logic, data)
- Predictable state management
- Robust handling of edge cases
- Simple and intuitive user experience

---

## Architecture

The app follows a modular and scalable structure:

- `app/` → Screens and navigation (UI layer)  
- `components/` → Reusable UI components  
- `hooks/` → Business logic abstraction  
- `store/` → Redux Toolkit + Redux Saga (state management)  
- `modules/` → Native integrations (biometrics, device ID, screen security)  

This separation ensures maintainability and scalability as the application grows.

---

## State Management

Redux Toolkit with Redux Saga was used to:

- Keep state updates predictable  
- Handle asynchronous flows cleanly (API calls, payouts)  
- Separate side effects from UI logic  

While lighter solutions could work for smaller applications, this approach scales better for complex flows such as payments.

---

## Payout Flow

The payout flow is designed to reflect real-world behavior:

1. User enters payout details  
2. Input validation is performed (amount, IBAN, currency)  
3. A confirmation step is shown before submission  
4. Biometric authentication is triggered for high-value payouts  
5. API request is made including device ID  
6. Success or failure is clearly communicated  
7. Balance is refreshed after successful payout  

---

## Edge Cases Handled

- Prevent duplicate submissions during payout  
- Network failure and retry handling  
- Loading and empty states  
- Invalid input handling  
- Biometric success and failure scenarios  

---

## Native Features

The app integrates with native capabilities:

- Device ID retrieval  
- Biometric authentication  
- Screenshot detection  

These are implemented via a lightweight native bridge to keep the solution simple and maintainable.

---

## Key Design Decisions

- Backend is treated as the source of truth for payout validation  
- Duplicate actions are prevented using UI state control  
- Reliability and clarity are prioritised over over-engineering  
- Focus was placed on production-like flows rather than UI polish  

---

## Trade-offs

- Redux Toolkit with Saga introduces additional complexity but improves scalability and clarity  
- Client-side validation for balance is minimal, relying on backend validation  
- Focused on core functionality and reliability instead of advanced UI or animations  

---

## Future Improvements

- Add client-side balance validation before submission  
- Improve amount validation (decimal precision, limits)  
- Add unit and integration tests  
- Improve accessibility and UI polish  
- Add optimistic updates for transaction list  
- Enhance error handling for partial failures  

---

## Running the App

```bash
npm install
npx expo start
