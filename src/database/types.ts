import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Directors {
  movieId: number;
  personId: number;
}

export interface Movies {
  id: number | null;
  title: string;
  year: number | null;
}

export interface People {
  id: number | null;
  name: string;
  birth: number | null;
}

export interface Ratings {
  movieId: number;
  rating: number;
  votes: number;
}

export interface Screenings {
  id: Generated<number>;
  movieId: number;
  numberOfTickets: number;
  numberOfTicketsLeft: number;
  movieTitle: string;
  movieYear: number;
  createdAt: Generated<string>;
}

export interface Stars {
  movieId: number;
  personId: number;
}

export interface Tickets {
  id: Generated<number>;
  userId: number;
  movieId: number;
  screeningId: number;
  numTickets: number;
  bookingTimestamp: Generated<string>;
}

export interface DB {
  directors: Directors;
  movies: Movies;
  people: People;
  ratings: Ratings;
  screenings: Screenings;
  stars: Stars;
  tickets: Tickets;
}
