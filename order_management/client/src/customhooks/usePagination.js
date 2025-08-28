import { useState, useMemo } from "react";

const usePagination = (data = [], rowsPerPage = 5) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => Math.ceil(data.length / rowsPerPage), [data, rowsPerPage]);

    const paginatedData = useMemo(() => {
        const startIdx = (currentPage - 1) * rowsPerPage;
        return data.slice(startIdx, startIdx + rowsPerPage);
    }, [currentPage, rowsPerPage, data]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    return {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
    };
};

export default usePagination;
