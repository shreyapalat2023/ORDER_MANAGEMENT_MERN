import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Pagination = ({ currentPage, totalPages, goToPage, nextPage, prevPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-between items-center mt-4 text-sm">
            <div className="flex items-center gap-2">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
                >
                    <LeftOutlined />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
                >
                    <RightOutlined />
                </button>
            </div>
            <p className="text-gray-600">
                Page {currentPage} of {totalPages}
            </p>
        </div>
    );
};

export default Pagination;
