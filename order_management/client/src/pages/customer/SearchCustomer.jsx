const CustomerSearch = ({ search, setSearch, onSearchClick }) => {
    return (
        <div>
            <div className="flex flex-col md:flex-row items-stretch gap-3 w-full md:w-full">
                {/* Search Input */}
                <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 7.5a7.5 7.5 0 010 9.15z"
                            />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder:text-gray-400"
                    />
                </div>

                {/* Optional Search Button */}
                <button
                    onClick={onSearchClick}
                    className="group text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                    style={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                    }}
                >
                    Search
                </button>

            </div>
        </div>
    );
};

export default CustomerSearch;
