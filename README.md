# peer-programming-exercise

## High-level requirements for the application:

### Users should be able to:

- [movie] get a list of movies with their id, title and year by providing a list of their IDs (e.g., /movies?id=133093,816692 should return 2 movies with these IDs, if they exist)
- [screening] get a list of screenings available for booking. Screenings should include session information (timestamp, number of tickets, number of tickets left) and movies: (title and year).
- [tickets] get a list of bookings (tickets) they have booked
- [screening] create a booking (ticket) for movie screening that has some tickets left

### Administrators should be able to:

- [screening] create new viewing screenings for watching a movie that has a timestamp and a provided allocation of tickets
- optional requirement: delete viewing screenings while they are empty
- optional requirement: change a screening's ticket allocation as long as it is not lower than the number of reserved tickets
