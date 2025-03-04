import {Joke} from "../models/Joke.ts";

const BASE_URL = "http://localhost:3000";

export interface PaginatedJokes {
    totalJokes: number;
    page: number;
    totalPages: number;
    limit: number;
    data: Joke[];
}

export const jokesService = {
    addJoke: async (): Promise<string> => {
        try {
            const response = await fetch(`${BASE_URL}/joke/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to add joke: ${response.status}`);
            }

            const result = await response.json();
            return result.message;
        } catch (error) {
            console.error("Error adding joke:", error);
            return "Failed to add joke";
        }
    },

    getJoke: async (): Promise<Joke | null> => {
        jokesService.addJoke().then();

        try {
            const response = await fetch(`${BASE_URL}/joke`);

            if (!response.ok) {
                throw new Error(`Failed to fetch joke: ${response.status}`);
            }

            const data: Joke = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching joke:", error);
            return null;
        }
    },

    deleteJoke: async (id: string): Promise<string> => {
        try {
            if (!id) {
                throw new Error("Invalid ID");
            }

            const response = await fetch(`${BASE_URL}/joke/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete joke: ${response.status}`);
            }

            const result = await response.json();
            return result.message;
        } catch (error) {
            console.error("Error deleting joke:", error);
            return "Failed to delete joke";
        }
    },

    updateJoke: async (id: string, updateData: { question?: string; answer?: string }): Promise<string> => {
        try {
            if (!id) {
                throw new Error("Invalid ID");
            }

            const response = await fetch(`${BASE_URL}/joke/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`Failed to update joke: ${response.status}`);
            }

            const result = await response.json();
            return result.message;
        } catch (error) {
            console.error("Error updating joke:", error);
            return "Failed to update joke";
        }
    },

    voteJoke: async (id: string, voteLabel: string): Promise<string> => {
        try {
            const response = await fetch(`${BASE_URL}/joke/${id}?label=${voteLabel}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to vote for joke: ${response.status}`);
            }

            const result = await response.json();
            return result.message;
        } catch (error) {
            console.error("Error voting for joke:", error);
            return "Failed to vote for joke";
        }
    },

    getJokes: async (page: number = 1, limit: number = 10): Promise<PaginatedJokes | null> => {
        try {
            const response = await fetch(`${BASE_URL}/jokes?page=${page}&limit=${limit}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch jokes: ${response.status}`);
            }

            const data: PaginatedJokes = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching jokes:", error);
            return null;
        }
    },
};
