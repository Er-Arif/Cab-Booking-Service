# Madhupur Ride Booking Application Blueprint

## Project Title
Hyperlocal Ride Booking Platform for Madhupur, Jharkhand

## Project Vision
Build a practical, scalable, and locally optimized ride-booking platform for Madhupur that allows customers to book **bike rides** and **e-rickshaw rides** quickly and safely through a mobile app, while giving drivers a simple app to manage trips and giving the business owner a complete admin system to control operations.

This is not a national ride-hailing product in phase one. It is a **small-city mobility platform** designed around local landmarks, short travel routes, low fares, cash payments, simple technology, and operational control.

---

## 1. Business Objective
The application should solve the local transportation problem by making it easy for people in Madhupur to:
- book nearby bike rides for fast travel
- book e-rickshaws for family, market, station, and hospital travel
- get fare transparency
- avoid manual searching or bargaining
- access safer and more trackable rides

The business should be able to:
- onboard and verify drivers
- manage fares and service areas
- monitor rides in real time
- earn revenue through commission or subscription
- expand later into other local transport and delivery services

---

## 2. Target Market
### Initial Service Area
Madhupur, Jharkhand

### Initial Ride Categories
- Bike
- E-rickshaw

### Target Customers
- daily commuters
- railway station passengers
- market visitors
- students
- hospital visitors
- elderly users who need short-distance local transport
- families using e-rickshaw for nearby travel

### Target Drivers
- local bike riders providing paid rides
- e-rickshaw drivers
- trusted local operators willing to join a managed booking platform

---

## 3. Product Components
The full system should have 3 major parts:

### 3.1 Customer Mobile App
Used by passengers to register, book rides, track rides, pay, and give ratings.

### 3.2 Driver Mobile App
Used by bike and e-rickshaw drivers to register, get verified, go online, accept rides, and track earnings.

### 3.3 Admin Panel
Used by the platform owner and staff to manage drivers, users, rides, fares, payments, reports, complaints, and promotions.

---

## 4. User Roles
### 4.1 Customer
Can:
- register/login using phone OTP
- manage profile
- select pickup and drop
- choose ride type
- book a ride
- cancel a ride
- track driver
- contact driver
- pay cash or UPI
- view ride history
- rate and report rides

### 4.2 Driver
Can:
- register with documents
- wait for approval
- log in
- go online/offline
- receive ride requests
- accept/reject ride requests
- navigate to pickup
- start and complete rides
- see earnings and trip history
- contact support

### 4.3 Admin
Can:
- manage customers and drivers
- verify or reject driver registrations
- manage ride categories and fares
- view ongoing rides and trip history
- handle complaints and disputes
- view revenue and reports
- send notifications and promotions
- suspend fraudulent users or drivers

### 4.4 Sub-admin or Operations Staff
Optional role for future use. Can be allowed to manage support tickets, review rides, manually assign bookings, and monitor daily activity with limited permissions.

---

## 5. Core Product Philosophy
This platform should be designed for a **small-city environment**, which means:
- the app should be simple and lightweight
- booking should work even for users with low technical familiarity
- support for landmarks should be strong
- cash must be supported in phase one
- driver interface must be very easy
- admin control must be strong in early stage
- route and fare calculation should be predictable and transparent

---

## 6. Core Customer Flow
1. Customer opens app
2. Customer logs in using mobile OTP
3. App detects current location or user enters pickup manually
4. Customer enters destination
5. System calculates approximate distance and fare
6. Customer sees available ride types:
   - Bike
   - E-rickshaw
7. Customer selects ride type
8. Customer confirms booking
9. Nearby eligible drivers are searched
10. Driver is assigned after acceptance
11. Customer sees driver details and live status
12. Driver reaches pickup point
13. Ride starts
14. Ride completes at destination
15. Final fare is shown
16. Payment is completed
17. Customer rates driver and can report an issue if needed

---

## 7. Core Driver Flow
1. Driver installs app and registers
2. Driver uploads required documents
3. Admin verifies and approves driver
4. Driver logs in and goes online
5. Driver receives ride request notification
6. Driver can accept or reject within limited time
7. On acceptance, driver sees pickup and drop details
8. Driver navigates to pickup location
9. Driver marks arrival
10. Driver starts trip after passenger pickup
11. Driver ends trip at destination
12. Fare is recorded
13. Payment is recorded
14. Driver can check earnings and history

---

## 8. Admin Flow
1. Admin logs into dashboard
2. Admin monitors key metrics on dashboard
3. Admin verifies new drivers and documents
4. Admin updates fare rules as needed
5. Admin checks ongoing and completed rides
6. Admin handles complaints, refunds, penalties, and disputes
7. Admin monitors city demand and peak booking times
8. Admin sends offers or announcements to users and drivers

---

## 9. Customer App Features
### 9.1 Authentication
- phone number login with OTP
- optional email field
- token-based session management
- logout from device

### 9.2 Profile Management
- name
- phone number
- profile image
- saved addresses
- emergency contact
- preferred payment method

### 9.3 Home Screen
- current location detection
- pickup field
- drop field
- map view
- landmark suggestions
- recent destinations
- saved places

### 9.4 Location Search
Must support:
- GPS location
- manual address entry
- landmark search
- pin on map
- recent locations
- saved locations like Home and Work

### 9.5 Ride Selection
The customer should see:
- ride type name
- estimated fare
- estimated arrival time
- ride capacity or suitability note

Example:
- Bike: faster, cheaper, suitable for 1 passenger
- E-rickshaw: suitable for short local family rides and local travel

### 9.6 Fare Estimation
The app should show estimated fare based on:
- base fare
- distance fare
- time fare if applicable
- minimum fare
- optional waiting charge
- promo discount if available

### 9.7 Ride Booking
- confirm pickup and drop
- select ride category
- show booking summary
- show payment method
- confirm ride

### 9.8 Ride Search and Matching Status
Customer should see statuses like:
- searching for driver
- driver assigned
- driver on the way
- driver arrived
- trip started
- trip completed
- cancelled

### 9.9 Live Ride Tracking
- driver live location
- driver name and photo
- vehicle details
- ETA to pickup
- status updates
- call driver button
- cancel ride button within allowed stage

### 9.10 Payments
Phase 1 should include:
- cash
- UPI

Future:
- wallet
- automatic payment gateway integration

### 9.11 Ride History
- list of all completed and cancelled rides
- fare amount
- date and time
- pickup and drop
- ride category
- payment method
- repeat booking option

### 9.12 Ratings and Reviews
- star rating
- optional text review
- predefined issue tags

### 9.13 Safety Features
- share trip details
- SOS button
- emergency contact access
- driver verification badge display

### 9.14 Support and Complaints
- report ride issue
- report overcharge
- report driver behavior
- no-show complaint
- lost item issue

---

## 10. Driver App Features
### 10.1 Authentication
- phone OTP login
- secure token session

### 10.2 Driver Registration
Fields:
- full name
- phone number
- address
- profile photo
- vehicle type
- vehicle number
- optional license details where needed
- UPI ID or bank details
- emergency contact

### 10.3 Document Upload
The system should allow upload of:
- ID proof
- driving license if required
- vehicle documents if required
- profile photo

Admin should be able to configure required documents by vehicle type.

### 10.4 Verification Status
Driver sees status:
- pending approval
- approved
- rejected
- suspended

### 10.5 Driver Dashboard
- go online/offline
- see trip request count
- see today earnings
- see completed rides today
- active status indicator

### 10.6 Incoming Ride Request Screen
Should show:
- pickup location
- drop location
- distance to pickup
- estimated trip distance
- estimated fare
- countdown timer to accept

### 10.7 Trip Management
- accept ride
- reject ride
- navigate to pickup
- mark arrived
- start ride
- complete ride
- cancel with reason if required

### 10.8 Earnings Module
- today earnings
- weekly earnings
- completed rides count
- commission charged
- pending payout
- payment method breakdown

### 10.9 Ride History
- past trips
- trip amount
- customer name if permitted
- payment status
- cancellation reasons

### 10.10 Support
- report customer issue
- report no-show
- report wrong location
- call support

### 10.11 Driver Performance
- rating
- acceptance rate
- cancellation rate
- total rides
- active hours

---

## 11. Admin Panel Features
### 11.1 Dashboard
Show:
- total rides today
- completed rides
- cancelled rides
- active drivers
- active customers
- gross revenue
- platform commission
- top routes
- peak booking hours

### 11.2 Driver Management
- driver list
- driver profile view
- document review
- approve/reject/suspend
- change vehicle category
- see ratings and complaints

### 11.3 Customer Management
- user list
- user profile
- booking history
- complaints raised
- block or flag suspicious users

### 11.4 Ride Management
- ongoing rides list
- completed rides list
- cancelled rides list
- ride detail view
- manually intervene in disputes
- future option for manual booking assignment

### 11.5 Fare Management
Must allow configuration by ride type:
- base fare
- minimum fare
- per km rate
- per minute or waiting rate
- cancellation charge
- night surcharge if ever needed
- zone-based fare settings if needed later

### 11.6 Zone and Landmark Management
Admin should manage:
- major pickup landmarks
- city hotspots
- operational service areas
- restricted or unsupported zones

### 11.7 Payment and Finance Management
- payment reports
- driver payout reports
- commission reports
- cash vs UPI summary
- refund entries

### 11.8 Complaints and Dispute Handling
- complaint queue
- ride-linked issue details
- resolution notes
- refund or penalty action
- close case action

### 11.9 Notification Management
- customer push notifications
- driver push notifications
- promotional banners
- emergency notices
- maintenance alerts

### 11.10 Offers and Referral Management
- coupon creation
- first ride discount
- referral settings
- validity period
- usage limits

### 11.11 Reports and Analytics
- daily, weekly, monthly rides
- revenue report
- driver earning report
- most used routes
- category usage comparison
- cancellation report
- repeat customer metrics

---

## 12. Small City Specific Requirements
The product must include local practical features that big-city products often ignore.

### 12.1 Landmark-Based Search
Users should be able to choose pickup and drop using:
- Madhupur Railway Station
- Bus Stand
- Main Market
- major hospitals
- schools and colleges
- temples and common local landmarks

### 12.2 Flexible Address Entry
Since exact map addresses may be inconsistent, users should be able to add notes like:
- near water tank
- opposite SBI bank
- beside market gate

### 12.3 Call Booking Support
Future feature: admin or operator should be able to create bookings manually for customers who call by phone.

### 12.4 Low Network Tolerance
- app should handle temporary internet drops gracefully
- last ride state should be cached
- retry mechanisms should exist

### 12.5 Cash-First Operations
Cash must be fully supported from first release.

### 12.6 Simple Driver UI
The driver app should use:
- larger buttons
- minimal steps
- clear Hindi-friendly structure in future
- simplified ride lifecycle

---

## 13. Functional Requirements
### 13.1 Authentication Requirements
- system must support OTP-based mobile login for customer and driver
- system must prevent unauthorized access to driver and admin modules
- system must maintain session securely using tokens

### 13.2 Booking Requirements
- user must be able to choose pickup and drop
- user must be able to choose ride category
- system must estimate fare before booking
- system must find nearby online drivers of selected category
- system must assign first eligible accepted driver

### 13.3 Ride Lifecycle Requirements
- ride must move through defined statuses
- driver should only be able to start ride after assignment
- ride should only complete after explicit driver action
- final fare must be recorded

### 13.4 Payment Requirements
- each ride must have a payment record
- system must support cash and UPI in phase one
- commission and driver earning must be calculated

### 13.5 Rating Requirements
- customer can rate completed ride
- driver rating should affect admin monitoring

### 13.6 Complaint Requirements
- complaint must be linked to ride
- admin must be able to update resolution status

### 13.7 Admin Requirements
- admin must be able to manage fares, drivers, users, and rides
- admin must be able to suspend drivers or customers
- admin must be able to export reports

---

## 14. Non-Functional Requirements
### 14.1 Performance
- booking flow should feel fast
- nearby driver matching should happen quickly
- app should remain responsive on mid-range Android phones

### 14.2 Scalability
- system should be designed so more vehicle types can be added later
- architecture should support future expansion into nearby towns

### 14.3 Security
- secure OTP verification
- secure token management
- encrypted password storage where relevant
- role-based access control for admin panel
- secure document storage

### 14.4 Reliability
- ride records should not be lost even if app closes unexpectedly
- trip status updates should be recoverable

### 14.5 Usability
- app must be simple enough for first-time users
- driver app must be usable by less tech-savvy users

### 14.6 Maintainability
- modular backend
- clean API design
- separate business logic from UI

---

## 15. Ride Categories and Pricing Blueprint
### 15.1 Bike Ride
Use case:
- fast short-distance ride for one passenger

Pricing fields:
- base fare
- minimum fare
- per km charge
- waiting charge
- cancellation fee

### 15.2 E-rickshaw Ride
Use case:
- short-distance family or local market ride

Pricing fields:
- base fare
- minimum fare
- per km charge
- waiting charge
- cancellation fee

### 15.3 Example Fare Rule Structure
For each category store:
- category name
- active/inactive status
- base fare
- minimum fare
- per km rate
- per minute rate or waiting rate
- cancellation fee
- free waiting minutes
- service charge if applicable

---

## 16. Ride Status Model
Every ride should move through a status pipeline:
- requested
- searching_driver
- driver_assigned
- driver_arriving
- driver_arrived
- trip_started
- trip_completed
- cancelled_by_user
- cancelled_by_driver
- cancelled_by_admin
- payment_pending
- payment_completed

---

## 17. Matching and Dispatch Logic
### Phase 1 Matching Logic
1. User confirms booking
2. Backend finds nearby online drivers of requested category
3. Drivers are sorted by proximity
4. Request is sent to one or more drivers based on business rule
5. First accepting valid driver gets assigned
6. Other requests expire

### Possible Dispatch Rules
- nearest-first
- nearest with fair rotation
- nearest with minimum cancellation history

For MVP, nearest-first is enough.

---

## 18. Payment and Revenue Logic
### Phase 1 Payment Methods
- cash
- UPI

### Revenue Models
#### Option A: Commission Per Ride
Platform takes fixed percentage from every completed ride.

#### Option B: Weekly or Monthly Driver Subscription
Driver pays to use platform and ride commission is reduced or removed.

#### Option C: Hybrid
Small subscription plus small ride commission.

### Recommended Start
Use commission-based model for launch because it is easier to understand and track.

---

## 19. Safety and Trust Blueprint
### Must-Have Safety Features
- driver verification before activation
- visible driver details for passenger
- ride status logging
- emergency contact option
- complaint workflow
- admin suspension ability

### Future Safety Features
- SOS with live trip share
- route deviation alerts
- women-only safety features
- emergency call shortcut

---

## 20. Screen Blueprint
### 20.1 Customer App Screens
- Splash screen
- Login/OTP screen
- Profile setup
- Home/map screen
- Pickup/drop selection screen
- Ride selection screen
- Booking confirmation screen
- Searching driver screen
- Driver assigned screen
- Live trip tracking screen
- Payment summary screen
- Rating screen
- Ride history screen
- Profile screen
- Support screen

### 20.2 Driver App Screens
- Splash screen
- Login screen
- Registration screen
- Document upload screen
- Verification status screen
- Driver home dashboard
- Incoming ride request screen
- Navigation to pickup screen
- Active trip screen
- Earnings screen
- Trip history screen
- Profile/support screen

### 20.3 Admin Panel Screens
- Login screen
- Dashboard
- Driver management
- Driver verification
- Customer management
- Ride management
- Fare settings
- Payments and finance
- Complaints and support
- Notifications and offers
- Reports and analytics
- Settings

---

## 21. Suggested Technology Stack
### Mobile Apps
- Flutter for customer app and driver app

Reason:
- one codebase for Android-first rollout
- good performance
- faster MVP development

### Backend
- Node.js + Express
- Socket.io for real-time ride updates

Reason:
- suitable for real-time booking and location updates
- practical for scalable event-based systems

### Database
- PostgreSQL

### Admin Panel
- React.js or Next.js

### Notifications
- Firebase Cloud Messaging

### Maps and Geolocation
- Google Maps API

### File Storage
- cloud object storage for driver documents and profile images

### Authentication
- OTP verification service + JWT session management

---

## 22. Backend Module Blueprint
The backend should be divided into modules:
- auth module
- customer module
- driver module
- vehicle module
- ride module
- pricing module
- payment module
- notification module
- admin module
- complaint module
- reporting module

---

## 23. Database Schema Blueprint
### 23.1 Users Table
- id
- name
- phone
- email
- profile_image_url
- status
- created_at
- updated_at

### 23.2 SavedLocations Table
- id
- user_id
- label
- address
- latitude
- longitude

### 23.3 Drivers Table
- id
- name
- phone
- address
- profile_image_url
- vehicle_type
- status
- is_online
- current_latitude
- current_longitude
- rating
- total_rides
- upi_id
- created_at
- updated_at

### 23.4 DriverDocuments Table
- id
- driver_id
- document_type
- file_url
- verification_status
- reviewed_by
- reviewed_at

### 23.5 Vehicles Table
- id
- driver_id
- category_id
- vehicle_number
- model_name
- color
- status

### 23.6 RideCategories Table
- id
- name
- base_fare
- minimum_fare
- per_km_rate
- per_minute_rate
- waiting_charge
- cancellation_fee
- is_active

### 23.7 Rides Table
- id
- user_id
- driver_id
- vehicle_id
- category_id
- pickup_address
- pickup_latitude
- pickup_longitude
- drop_address
- drop_latitude
- drop_longitude
- estimated_distance_km
- actual_distance_km
- estimated_fare
- final_fare
- status
- payment_status
- booked_at
- accepted_at
- arrived_at
- started_at
- completed_at
- cancelled_at
- cancellation_reason

### 23.8 Payments Table
- id
- ride_id
- amount
- payment_method
- payment_status
- driver_earning
- platform_commission
- transaction_reference
- created_at

### 23.9 Ratings Table
- id
- ride_id
- user_id
- driver_id
- rating
- review_text
- created_at

### 23.10 Complaints Table
- id
- ride_id
- raised_by_type
- raised_by_id
- complaint_type
- description
- resolution_status
- resolution_note
- created_at
- resolved_at

### 23.11 Notifications Table
- id
- target_type
- target_id
- title
- message
- notification_type
- is_read
- created_at

### 23.12 PromoCodes Table
- id
- code
- discount_type
- discount_value
- max_discount
- valid_from
- valid_to
- usage_limit
- status

### 23.13 ServiceZones Table
- id
- zone_name
- status
- notes

### 23.14 Landmarks Table
- id
- name
- address
- latitude
- longitude
- zone_id
- status

---

## 24. API Blueprint
### 24.1 Auth APIs
- send OTP
- verify OTP
- login
- logout
- refresh token

### 24.2 Customer APIs
- get profile
- update profile
- get saved locations
- add saved location
- search landmarks
- estimate fare
- create booking
- cancel booking
- get active ride
- get ride history
- rate ride
- raise complaint

### 24.3 Driver APIs
- register driver
- upload document
- get verification status
- go online
- go offline
- get incoming requests
- accept ride
- reject ride
- mark arrived
- start ride
- complete ride
- get earnings summary
- get trip history
- raise issue

### 24.4 Admin APIs
- login
- get dashboard stats
- get drivers
- approve driver
- reject driver
- suspend driver
- get users
- get rides
- update fare settings
- get complaints
- resolve complaint
- create notification
- get reports

---

## 25. Real-Time Features
The following actions should use real-time communication where possible:
- new booking request to drivers
- driver acceptance updates to customer
- driver live location updates
- ride status changes
- cancellation notifications

This can be built using Socket.io or WebSockets.

---

## 26. MVP Scope
### Customer MVP
- OTP login
- pickup/drop selection
- bike/e-rickshaw selection
- fare estimate
- booking confirmation
- ride status tracking
- cash/UPI payment marking
- history
- rating

### Driver MVP
- registration
- document upload
- approval status
- online/offline toggle
- ride accept/reject
- arrive/start/complete ride
- earnings screen

### Admin MVP
- dashboard
- driver approval
- customer and driver list
- ride list
- fare management
- complaint handling
- reports

---

## 27. Post-MVP Features
Build later after first launch:
- scheduled rides
- shared e-rickshaw ride
- manual operator booking
- wallet
- referral program
- promo coupons
- multilingual support
- in-app chat
- subscription plans
- driver incentive engine
- school transport mode
- parcel and medicine delivery

---

## 28. Development Phases
### Phase 1: Product Planning
- define business rules
- define pricing model
- define service area
- define required driver documents
- define cancellation policy
- define commission model

### Phase 2: UX/UI Design
- customer flow wireframes
- driver flow wireframes
- admin dashboard wireframes
- design system and theme

### Phase 3: Backend Development
- authentication
- user and driver models
- booking engine
- pricing engine
- payment records
- admin APIs
- reports

### Phase 4: Mobile App Development
- customer app features
- driver app features
- real-time integration
- map and booking flow

### Phase 5: Admin Panel Development
- dashboards
- driver verification
- ride monitoring
- fare setup
- analytics and complaints

### Phase 6: Testing
- OTP flow testing
- ride booking testing
- dispatch testing
- payment recording testing
- network interruption testing
- low-end Android testing

### Phase 7: Pilot Launch
- onboard small set of drivers
- launch in limited areas
- monitor demand
- improve pricing and operations

---

## 29. Pilot Launch Plan for Madhupur
Do not launch across the entire city on day one.

### Suggested Initial Service Points
- Railway Station
- Bus Stand
- Main Market
- Hospital Area
- major school or college points

### Suggested Initial Driver Base
- 10 bike drivers
- 10 e-rickshaw drivers

### Pilot Goals
- test booking demand
- test route pricing
- observe peak hours
- measure cancellation rate
- gather customer feedback

---

## 30. Policies to Define Before Development
These business rules must be finalized before coding:
- minimum fare for bike
- minimum fare for e-rickshaw
- serviceable boundaries
- cancellation charge rules
- waiting time rules
- payment settlement cycle for drivers
- required documents by category
- customer refund policy
- driver suspension policy
- complaint resolution SLA

---

## 31. Recommended Architecture Summary
### Mobile
- Flutter customer app
- Flutter driver app

### Backend
- Node.js + Express + Socket.io

### Database
- PostgreSQL

### Admin
- React or Next.js web panel

### External Services
- OTP provider
- Firebase push notifications
- maps and route API
- cloud storage for files

---

## 32. Final Recommendation
Build only the most essential version first.

Do not try to build a full Uber clone immediately.

For Madhupur, success will depend more on:
- trust
- simple driver onboarding
- landmark-based booking
- reliable support
- good fare control
- fast local operations

A strong MVP for one city can later grow into a larger regional transport platform.

---

## 33. Next Deliverables That Can Be Created From This Blueprint
This blueprint can now be expanded into any of the following:
1. detailed software requirement specification
2. complete AI build prompt for generating the app
3. database ER diagram and table relationships
4. module-wise development roadmap
5. screen-by-screen UI blueprint
6. full API contract document
7. admin panel feature matrix
8. revenue and pricing strategy for launch

