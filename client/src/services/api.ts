import { Record } from "../types";

const API_BASE_URL = "/api";

export const fetchRecords = async (): Promise<Record[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/record`);
    if (!response.ok) {
      throw new Error("Failed to fetch records");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export const createRecord = async (
  record: Omit<Record, "_id">
): Promise<Record> => {
  try {
    const response = await fetch(`${API_BASE_URL}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error("Failed to create record");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating record:", error);
    throw error;
  }
};
