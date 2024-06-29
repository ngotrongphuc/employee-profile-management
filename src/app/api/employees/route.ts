"use server";
import { promises as fs } from "fs";
import path from "path";
import { Employees, PositionResources } from "@/app/types";
import { type NextRequest } from "next/server";
import { toNumber, chunk, ceil } from "lodash";

export async function GET(request: NextRequest) {
  const jsonDirectory = path.join(process.cwd(), "");
  const fileContents = await fs.readFile(
    jsonDirectory + "/mockDb.json",
    "utf8"
  );
  const db: { employees: Employees; positionResources: PositionResources } =
    JSON.parse(fileContents);
  const employees = db.employees;

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const pageNumber = toNumber(searchParams.get("pageNumber")) || 1;
  const pageSize = toNumber(searchParams.get("pageSize")) || 10;
  const searchedPageItems = employees.pageItems.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalItems = searchedPageItems.length;
  const totalPages = ceil(searchedPageItems.length / pageSize);
  const paginatedPageItems = chunk(searchedPageItems, pageSize)[pageNumber - 1];
  const result: Employees = {
    totalItems,
    totalPages,
    pageItems: paginatedPageItems||[],
  };

  return Response.json(result, {
    status: 200,
    statusText: "success",
  });
}
