import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

const HistorySection = ({ lines, isLoading, handleProjectClick, deleteLine }) => {
    return (
        <div className={`overflow-hidden relative`}>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                lines.map((line, index) => (
                <div key={index} className="width-content row relative my-4">
                    <p
                        className="py-2 px-2 text-sm font-medium text-gray-700 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-l-2 hover:border-gray-900 dark:hover:border-white"
                        style={{
                            width: "243px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            userSelect: "none",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            handleProjectClick(index);
                        }}
                    >
                        {line}
                    </p>
                        <button onClick={() => deleteLine(index)} className="delete-button">
                            <AiOutlineDelete />
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default HistorySection;