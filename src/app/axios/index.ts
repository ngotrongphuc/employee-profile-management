import axios from "axios";
import { Employees } from "../types";

export const getEmployees = async (params: {
  search: string;
  pageNumber: number;
  pageSize: number;
}): Promise<Employees> => {
  try {
    // test delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000);

    const { data } = await axios.get(`/api/employees`, {
      params,
    });
    return data;
  } catch (error: any) {
    throw error;
  }
};
