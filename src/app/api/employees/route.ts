"use server";
import {
  Employee,
  Employees,
  Position,
  PositionResources,
  ToolLanguage,
} from "@/app/types";
import { formDataToObject } from "@/app/utils";
import { promises as fs } from "fs";
import { ceil, chunk, isEmpty, random, toNumber } from "lodash";
import { type NextRequest } from "next/server";
import path from "path";

const jsonDirectory = path.join(process.cwd(), "");
const filePath = jsonDirectory + "/mockDb.json";

export async function GET(request: NextRequest) {
  const fileContents = await fs.readFile(filePath, "utf8");
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
    pageItems: paginatedPageItems || [],
  };

  return Response.json(result, {
    status: 200,
    statusText: "success",
  });
}

export async function POST(request: NextRequest) {
  const fileContents = await fs.readFile(filePath, "utf8");
  const db: { employees: Employees; positionResources: PositionResources } =
    JSON.parse(fileContents);
  const employees: Employees = db.employees;

  const formData = await request.formData();

  const employeeObj = formDataToObject(formData);

  if (isEmpty(formDataToObject(formData))) {
    return new Response(`Error`, {
      status: 400,
    });
  }

  const newEmployee: Employee = {
    ...employeeObj,
    id: Date.now(),
    positions: formDataToObject(formData).positions.map(
      (position: Position) => ({
        ...position,
        id: random(1, 999999),
        toolLanguages: position.toolLanguages.map(
          (toolLanguage: ToolLanguage) => ({
            ...toolLanguage,
            id: random(1, 999999),
            images: toolLanguage?.images
              ? toolLanguage?.images?.map((image: any) => ({
                  displayOrder: image.displayOrder,
                  id: random(1, 999999),
                  cdnUrl: `https://picsum.photos/id/${random(0, 999)}/300/200`,
                }))
              : [
                  {
                    displayOrder: 0,
                    id: random(1, 999999),
                    cdnUrl: "https://via.placeholder.com/300",
                  },
                ],
          })
        ),
      })
    ),
  };

  const newData = {
    ...db,
    employees: {
      ...employees,
      totalItems: employees.totalItems + 1,
      totalPages: ceil((employees.totalItems + 1) / 10),
      pageItems: [...employees.pageItems, newEmployee],
    },
  };

  await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf8");

  return Response.json(newEmployee, {
    status: 200,
    statusText: "success",
  });
}
