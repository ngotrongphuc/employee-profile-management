import axios from "axios";
import { Employee, Employees, PositionResources } from "../types";
import { objectToFormData } from "../utils";

export const getEmployees = async (params: {
  search: string;
  pageNumber: number;
  pageSize: number;
}): Promise<Employees> => {
  try {
    // test delay
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);

    const { data } = await axios.get(`/api/employees`, {
      params,
    });
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const getPositionResources = async (): Promise<PositionResources> => {
  try {
    const { data } = await axios.get(`/api/positionResources`);
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const createEmployee = async (
  payload: Employee
): Promise<{
  message: string;
  statusCode: number;
}> => {
  try {
    const { data } = await axios.post(`/api/employees`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteEmployee = async (
  employeeId: number
): Promise<Employees> => {
  try {
    const { data } = await axios.delete(`/api/employees/${employeeId}`);
    return data;
  } catch (error: any) {
    throw error;
  }
};
