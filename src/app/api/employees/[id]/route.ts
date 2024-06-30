"use server";
import {
  Employees,
  PositionResources
} from "@/app/types";
import { promises as fs } from "fs";
import {
  ceil,
  parseInt,
  reject
} from "lodash";
import { type NextRequest } from "next/server";
import path from "path";

const jsonDirectory = path.join(process.cwd(), "");
const filePath = jsonDirectory + "/mockDb.json";
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const fileContents = await fs.readFile(filePath, "utf8");
  const db: { employees: Employees; positionResources: PositionResources } =
    JSON.parse(fileContents);
  const employees: Employees = db.employees;

  const { id } = params;

  const newData = {
    ...db,
    employees: {
      ...employees,
      totalItems: employees.totalItems - 1,
      totalPages: ceil((employees.totalItems - 1) / 10),
      pageItems: reject(employees.pageItems, { id: parseInt(`${id}`) }),
    },
  };

  await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf8");

  return Response.json(newData.employees, {
    status: 200,
    statusText: "success",
  });
}
