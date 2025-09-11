# ParkPal

[My Notes](notes.md)

This application is a platform to connect event-goers to local driveway hosts that are willing to rent out their driveway space as event parking.

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [ ] A concise and compelling elevator pitch
- [ ] Description of key features
- [ ] Description of how you will use each technology
- [ ] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Unless you arrive an hour or two early, event parking is always an inconsistent, dreaded part of going to the game, concert, festival, etc. Instead of hoping that you'll find a magic street parking spot, confirm your time and space by booking a local nieghbors driveway as your parking for the night. The homeowner makes the easiest passive income of their lives, and both parties walk away with a great experience. 

### Design

![Design image](ParkpalMocks.png)

The web app design will be as simple and intuitive as possible, since people want to think about parking the least they can. There will be a page with a map to find a driveway easily, as well as a simple form to post a listing.

```mermaid
sequenceDiagram
    actor Driver
    actor Host
    Driver->>Backend: User searches for and books driveway
    Host->>Backend: Host posts their driveway
```

### Key features

- Hosts can post their driveway to specific events
- Drivers can book host's driveway during their event
- Hosts can collect payouts and Drivers can pay directly through the web app
- Hosts and Drivers can communicate through the app

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Structure basic layout of all of the pages including auth, driveway select page, and hosting dashboard
- **CSS** - Set a consistent pallet for colors and reusable, responsive designs 
- **React** - React will be used for building the forms to collect information from drivers and hosts as well as setting the state for pages. 
- **Service** - Backend service with endpoints for:
  - Authentication
  - Posting driveways
  - Looking up available driveways by event
  - Booking Specific Driveways
  - Messaging between host and driver
- **DB/Login** - Store users, venues, events, driveways, and bookings in database with clear rules to certain data
- **WebSocket** - The database will be the source of truth for available driveways and bookings

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Server deployed and accessible with custom domain name** - [My server link](https://yourdomainnamehere.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **HTML pages** - I did not complete this part of the deliverable.
- [ ] **Proper HTML element usage** - I did not complete this part of the deliverable.
- [ ] **Links** - I did not complete this part of the deliverable.
- [ ] **Text** - I did not complete this part of the deliverable.
- [ ] **3rd party API placeholder** - I did not complete this part of the deliverable.
- [ ] **Images** - I did not complete this part of the deliverable.
- [ ] **Login placeholder** - I did not complete this part of the deliverable.
- [ ] **DB data placeholder** - I did not complete this part of the deliverable.
- [ ] **WebSocket placeholder** - I did not complete this part of the deliverable.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Header, footer, and main content body** - I did not complete this part of the deliverable.
- [ ] **Navigation elements** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing** - I did not complete this part of the deliverable.
- [ ] **Application elements** - I did not complete this part of the deliverable.
- [ ] **Application text content** - I did not complete this part of the deliverable.
- [ ] **Application images** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - I did not complete this part of the deliverable.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.


## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
