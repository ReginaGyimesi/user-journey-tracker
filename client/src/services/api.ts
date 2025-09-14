import { Session, User, UserSessionsResponse } from "../types";

const API_BASE_URL = "/api";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error("Failed to get users");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }
      throw new Error("Failed to get user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getSessions = async (): Promise<Session[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`);
    if (!response.ok) {
      throw new Error("Failed to get sessions");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }
};

export const getUserSessions = async (
  userId: string
): Promise<UserSessionsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/sessions`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }
      throw new Error("Failed to get user sessions");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    throw error;
  }
};

// export const createRecord = async (
//   record: Omit<Record, "_id">
// ): Promise<Record> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/record`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(record),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create record");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error creating record:", error);
//     throw error;
//   }
// };
