// import type { Table as ITable } from "@tanstack/react-table";

// export function Pagination<TData>({ tableLib }: { tableLib: ITable<TData> }) {
//   const totalPages = Math.max(1, tableLib.getPageCount());
//   const currentPage = tableLib.getState().pagination.pageIndex + 1;
//   const canPreviousPage = tableLib.getCanPreviousPage();
//   const canNextPage = tableLib.getCanNextPage();

//   return (
//     <div className="flex flex-col items-center justify-between gap-3 mt-4 text-sm font-medium text-black md:gap-4 md:flex-row">
//       <div className="flex items-center gap-1.5">
//         <span>Showing</span>
//         <span>
//           Page {currentPage} of {totalPages} entries
//         </span>
//       </div>
//       <div className="flex flex-col items-center gap-3 md:flex-row">
//         <div className="flex items-center text-sm">
//           <button
//             className="flex items-center gap-1 px-5 py-3 text-sm border border-r-0 border-gray-500 rounded-l-full"
//             onClick={() => tableLib.previousPage()}
//             disabled={!canPreviousPage}
//           >
//             Previous
//           </button>
//           {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => (
//             <button
//               key={index}
//               className={`flex items-center gap-1 px-5 py-3 text-sm border border-r-0 ${
//                 index + 1 === currentPage
//                   ? "text-white bg-primary"
//                   : "border-gray-500"
//               }`}
//               onClick={() => tableLib.setPageIndex(index)}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             className="flex items-center gap-1 px-5 py-3 text-sm border border-gray-500 rounded-r-full"
//             onClick={() => tableLib.nextPage()}
//             disabled={!canNextPage}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import type { Table as ITable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination<TData>({ tableLib }: { tableLib: ITable<TData> }) {
  const pageIndex = tableLib.getState().pagination.pageIndex;
  const pageSize = tableLib.getState().pagination.pageSize;
  const totalRows = tableLib.getFilteredRowModel().rows.length;
  const totalPages = Math.max(1, tableLib.getPageCount());

  // Calculate current range
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRows);

  const canPreviousPage = tableLib.getCanPreviousPage();
  const canNextPage = tableLib.getCanNextPage();

  return (
    <div className="flex items-center justify-start py-3 px-2 text-sm text-gray-500">
      <div className="flex items-center gap-3">
        {/* Previous button */}
        <button
          onClick={() => tableLib.previousPage()}
          disabled={!canPreviousPage}
          className={`p-1 transition-colors font-bold text-black text-md ${
            canPreviousPage
              ? "hover:text-gray-700"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Range text */}
        <span className="text-md font-bold text-black">
          {start} – {end} of {totalRows}
        </span>

        {/* Next button */}
        <button
          onClick={() => tableLib.nextPage()}
          disabled={!canNextPage}
          className={`p-1 transition-colors font-bold text-black text-md ${
            canNextPage
              ? "hover:text-gray-700"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
