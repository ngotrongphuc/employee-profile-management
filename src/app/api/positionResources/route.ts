"use server";
import { promises as fs } from "fs";
import path from "path";
import { Employees, PositionResources } from "@/app/types";
import { type NextRequest } from "next/server";

const jsonDirectory = path.join(process.cwd(), "");
const filePath = jsonDirectory + "/mockDb.json";

export async function GET(request: NextRequest) {
  const fileContents = await fs.readFile(filePath, "utf8");
  const db: { employees: Employees; positionResources: PositionResources } =
    JSON.parse(fileContents);
  const positionResources = db.positionResources;

  return Response.json(positionResources, {
    status: 200,
    statusText: "success",
  });
}
