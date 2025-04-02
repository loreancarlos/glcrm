import React, { useEffect, useState } from "react";
import { Edit2, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  renderActions?: (item: T) => React.ReactNode;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onRowClick,
  renderActions,
}: TableProps<T>) {
  const [tableData, setTableData] = useState<T[]>(data);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });

    if (direction === null) {
      setTableData([...data]);
      return;
    }

    const sortedData = [...tableData].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue === null || aValue === undefined)
        return direction === "asc" ? 1 : -1;
      if (bValue === null || bValue === undefined)
        return direction === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return direction === "asc"
        ? (aValue as any) - (bValue as any)
        : (bValue as any) - (aValue as any);
    });

    setTableData(sortedData);
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.accessor)}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.accessor)
                  }
                  className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                    column.sortable !== false
                      ? "cursor-pointer hover:bg-gray-100"
                      : ""
                  }`}>
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable !== false && getSortIcon(column.accessor)}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || renderActions) && (
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData &&
              tableData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                  }>
                  {columns.map((column) => (
                    <td
                      key={String(column.accessor)}
                      className="px-3 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                      {column.render
                        ? column.render(item[column.accessor])
                        : String(item[column.accessor])}
                    </td>
                  ))}
                  {(onEdit || onDelete || renderActions) && (
                    <td className="px-3 py-4 text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {renderActions ? (
                          renderActions(item)
                        ) : (
                          <>
                            {onEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(item);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 p-1">
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(item);
                                }}
                                className="text-red-600 hover:text-red-900 p-1">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
