import React, { useState } from "react";
import styled from "styled-components";
import { createRecord } from "../services/api";
import { Record } from "../types";

interface AddRecordFormProps {
  onRecordAdded: (record: Record) => void;
}

export const AddRecordForm: React.FC<AddRecordFormProps> = ({
  onRecordAdded,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    level: "junior",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.position.trim()) {
      setError("Name and position are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newRecord = await createRecord(formData);
      onRecordAdded(newRecord);
      setFormData({ name: "", position: "", level: "junior" });
      setSuccess("Record added successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Add New Record</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="position">Position</Label>
          <Input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            placeholder="Enter position"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="level">Level</Label>
          <Select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Record"}
          </Button>
        </FormGroup>
      </Form>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </FormContainer>
  );
};

const FormContainer = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const FormTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 1.2rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 15px;
  align-items: end;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: 0;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: 0;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 0.875rem;
  margin-top: 5px;
`;
