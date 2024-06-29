export type Employee = {
  id: number;
  name: string;
  positions: Array<{
    id: number;
    positionResourceId: number;
    displayOrder: number;
    toolLanguages: Array<{
      id: number;
      toolLanguageResourceId: number;
      displayOrder: number;
      from: number;
      to: number;
      description: string;
      images: Array<{ id: number; cdnUrl: string; displayOrder: number }>;
    }>;
  }>;
};

export type Employees = {
  totalItems: number;
  totalPages: number;
  pageItems: Employee[];
};

export type PositionResources = Array<{
  positionResourceId: number;
  name: string;
  toolLanguageResources: Array<{
    toolLanguageResourceId: number;
    positionResourceId: number;
    name: string;
  }>;
}>;
