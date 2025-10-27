// import {
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   RowSelectionState,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/Table";
// import { Pagination } from "./Pagination";
// import { useState, useEffect } from "react";

// export default function BaseTable({
//   data,
//   columns,
//   showFilters = true,
//   showPagination = true,
//   onRowClick,
// }: {
//   columns: any;
//   data: any;
//   showFilters?: boolean;
//   showPagination?: boolean;
//   onRowClick?: (row: any) => void;
// }) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
//   const [pageSize, setPageSize] = useState<number>(10);

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//     initialState: {
//       pagination: {
//         pageSize,
//       },
//     },
//   });

//   useEffect(() => {
//     table.setPageSize(pageSize);
//   }, [pageSize, table]);

//   const handlePageSize = (value: string) => {
//     const newSize = Number(value);
//     setPageSize(newSize);
//     table.setPageSize(newSize);
//   };

//   return (
//     <>
//       <Table className=" routes-scroll-area">
//         <TableHeader className="bg-white routes-scroll-area">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id} className="px-12">
//               {headerGroup.headers.map((header) => {
//                 return (
//                   <TableHead
//                     key={header.id}
//                     colSpan={header.colSpan}
//                     className="px-6 py-6 font-bold routes-scroll-area"
//                   >
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 );
//               })}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows.length > 0 ? (
//             table.getRowModel().rows.map((row, index) => (
//               <TableRow
//                 key={row.id}
//                 data-state={row.getIsSelected() && "selected"}
//                 className={`${
//                   index % 2 !== 0 && "bg-white"
//                 } cursor-default hover:bg-gray-50`}
//                 onClick={() => onRowClick && onRowClick(row.original)}
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell className="px-6" key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 No results.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//       {showPagination && <Pagination tableLib={table} />}
//     </>
//   );
// }



import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import { Pagination } from "./Pagination";
import { useState, useEffect } from "react";

export default function BaseTable({
  data,
  columns,
  showFilters = true,
  showPagination = true,
  onRowClick,
}: {
  columns: any;
  data: any;
  showFilters?: boolean;
  showPagination?: boolean;
  onRowClick?: (row: any) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pageSize, setPageSize] = useState<number>(10);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const handlePageSize = (value: string) => {
    const newSize = Number(value);
    setPageSize(newSize);
    table.setPageSize(newSize);
  };

  return (
    <div className="w-full border border-gray-100 rounded-xl shadow-sm bg-white">
      <Table className="">
        {/* Header */}
        <TableHeader className="bg-gray-50 text-gray-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-gray-100">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-left"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* Body */}
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`cursor-pointer border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50 ${
                  index % 2 === 1 ? "bg-white" : "bg-gray-50/50"
                }`}
                onClick={() => onRowClick && onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <TableCell
                    key={cell.id}
                    className={`px-5 py-3 text-sm text-gray-700 ${
                      idx === 0
                        ? "text-[#6200EE] font-medium hover:underline"
                        : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-gray-500"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {showPagination && (
        <div className="p-3 bg-white border-t border-gray-100">
          <Pagination tableLib={table} />
        </div>
      )}
    </div>
  );
}