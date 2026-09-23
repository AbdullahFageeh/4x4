Build a mobile-first app for people in Saudi Arabia who own or love the same car model. The app should help car communities organize trips, manage shared expenses, communicate, and discover places to visit.

Language and local experience:
Support Arabic with proper right-to-left layouts and English. Use Saudi riyals (SAR), Saudi phone numbers (+966), and Saudi Arabia’s time zone. Design for outdoor use, with clear maps, large controls, and readable text.

Community and profiles:
Users can create profiles with their name, photo, car model, and optional car details. They can create or join public or private car communities, request membership, and invite others through links. Include organizer and member roles, community rules, reporting, and blocking.

Trip planning:
Organizers can create trips with a title, description, destination, meeting point, date, departure time, itinerary, participant limit, and estimated cost. Include trip categories such as scenic drives, camping, off-road adventures, and city meetups. Members can join, decline, or join a waiting list. Show participants, trip updates, reminders, and a preparation checklist. Organizers can update or cancel a trip and notify participants.

Maps and location:
Let users search for places, share map pins, choose meeting points, and add route stops such as fuel stations, restaurants, campsites, and rest areas. Provide directions through Google Maps.

Offer optional live location sharing during trips. Users choose who can see their location and how long sharing lasts, and can stop sharing at any time. Sharing should expire automatically. Display the last update time and clearly mark stale locations when connectivity is poor. Cache essential trip information for weak-signal areas.

Trip suggestions:
Use Google Maps Platform’s supported place data, ratings, and available reviews to suggest destinations in Saudi Arabia. Let users filter by distance, category, rating, and available amenities. Explain why each place is suggested and link to its Google Maps listing.

Distinguish verified place information from community recommendations. Do not assume a destination is suitable for off-road driving, camping, or a particular vehicle based only on reviews. Members can suggest destinations and vote on where to go next.

Payments and shared expenses:
Organizers can set a trip fee or record shared expenses such as food, campsite bookings, and supplies. Show each participant’s share, payment status, receipts, and remaining balance. Support equal splits and custom amounts.

Integrate a payment provider available in Saudi Arabia, with mada, Apple Pay, and cards where supported. Clearly show who receives the payment, any fees, and the cancellation and refund terms before checkout. Support refunds and payment confirmations. Keep payment credentials with the payment provider.

Chat and notifications:
Include community chat and a dedicated chat for each trip. Support text, photos, map pins, replies, reactions, and pinned announcements. Let users mute conversations and manage notifications. Highlight important trip changes, departure reminders, and payment updates.

Trust and trip safety:
Include organizer moderation, content reporting, and membership controls. Make location visibility and privacy settings easy to understand. Provide a way to share trip details with a trusted contact. Clearly explain that live location and in-app assistance depend on connectivity and do not replace emergency services.

Core screens:
Create onboarding, community discovery, community home, trip discovery, trip details, trip creation, trip map, chat, payments and expenses, user profile, and notification/privacy settings.

Build a complete working MVP around this main journey:
A user joins a car community, discovers or creates a trip, confirms attendance, pays their share, joins the trip chat, and optionally shares their live location during the trip.

Include loading, empty, error, and offline states. Use realistic Saudi sample content and clearly label demonstration data. Any feature requiring external credentials or services must have a clearly identified setup requirement; do not present simulated payments, locations, or reviews as real.
