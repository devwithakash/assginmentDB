export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
      >
        Previous
      </button>
      
      <span className="font-bold">
        Page {page} of {totalPages}
      </span>
      
      <button
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
}