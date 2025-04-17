import React, { useEffect, useState } from "react";
import { Edit2, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setTableData(data);
    setCurrentPage(1);
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
    setCurrentPage(1);
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

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return tableData.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-secondary">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.accessor)}
                    onClick={() =>
                      column.sortable !== false && handleSort(column.accessor)
                    }
                    className={`px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap ${
                      column.sortable !== false
                        ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-hover"
                        : ""
                    }`}>
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {column.sortable !== false && getSortIcon(column.accessor)}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete || renderActions) && (
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
              {getCurrentPageData().map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`${
                    onRowClick
                      ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-hover"
                      : ""
                  }`}>
                  {columns.map((column) => (
                    <td
                      key={String(column.accessor)}
                      className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-[200px] truncate">
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
                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1">
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(item);
                                }}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1">
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, tableData.length)} de{" "}
            {tableData.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover"
              }`}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
              )
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return [
                    <span
                      key={`ellipsis-${page}`}
                      className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      ...
                    </span>,
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover"
                      }`}>
                      {page}
                    </button>,
                  ];
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover"
                    }`}>
                    {page}
                  </button>
                );
              })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${
                currentPage === totalPages
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover"
              }`}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}