import React, { useState, useMemo, useEffect, useCallback, useRef, useReducer } from 'react';
import {
    Column,
    Table,
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    RowData,
    ColumnResizeDirection,
} from '@tanstack/react-table';
import CloudinaryVideoPlayer from "../VideoPlayer/cloudinaryVideoPlayer.js";
import '../../assets/css/Table.css'


function CustomCell({ getValue, row: { index }, column: { id }, table }) {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const [isHovered, setIsHovered] = useState(false);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const onBlur = () => {
        console.log('Saving value:', value);
        table.options.meta?.updateData(index, id, value);
    };


    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    if (id === 'Video') {
        return (
            <div className='w-full'>
                <CloudinaryVideoPlayer src={"http://res.cloudinary.com/delkyf33p/video/upload/so_41.26318/eo_73.06174/test1703932905600"} />
            </div>
        )
    }

    if (id === 'Title') {
        return (
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className='relative w-full'
            >
                <input
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    className='bg-transparent text-white p-0 border-0 hover:border hover:border-white outline-none h-12 resize-none '
                />
                {isHovered && (
                    <button
                        onClick={onBlur}
                        className='absolute right-0 top-0 p-1 bg-blue-500 text-white hover:bg-blue-700'
                    >
                        Save
                    </button>
                )}
            </div>
        );
    }

    if (id === 'discription') {
        return (
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className='relative w-full'
            >
                <textarea
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    className='bg-transparent text-white p-0 border-0 hover:border hover:border-white outline-none h-12 resize-none '
                />
                {isHovered && (
                    <button
                        onClick={onBlur}
                        className='absolute right-0 top-0 p-1 bg-blue-500 text-white hover:bg-blue-700'
                    >
                        Saved
                    </button>
                )}
            </div>
        );
    }

    return (
        <input
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            className='bg-transparent text-white p-0 border-0 hover:border hover:border-white'
        />
    );
}

const defaultColumn = {
    cell: CustomCell,
};

function useSkipper() {
    const shouldSkipRef = useRef(true);
    const shouldSkip = shouldSkipRef.current;

    const skip = useCallback(() => {
        shouldSkipRef.current = false;
    }, []);

    useEffect(() => {
        shouldSkipRef.current = true;
    });

    return [shouldSkip, skip];
}

function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
}) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate, rest.checked]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    );
}

function NewTable() {
    const [rowSelection, setRowSelection] = React.useState({})

    const columnHelper = createColumnHelper(); // Replace 'Person' with the actual type

    const columns = [
        columnHelper.accessor('Video', {
            header: 'First Name',
            footer: info => info.column.id,
            size: 500,
        }),
        columnHelper.accessor('Title', {
            header: 'Last Name',
            footer: info => info.column.id,
            size: 300,
        }),
        columnHelper.accessor('discription', {
            header: 'Discription ',
            footer: info => info.column.id,
        }),
        columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            footer: info => info.column.id,
        }),
        columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: info => info.column.id,
        }),
        {
            id: 'select-all',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
        },
    ];


    const [data, setData] = useState([
        { Video: 'John', Title: 'Doe', discription: 25, visits: 10, status: 'Active', progress: 50 },
        { Video: 'Jane', Title: 'Smith', discription: 30, visits: 15, status: 'Inactive', progress: 75 },
        { Video: 'Jack', Title: 'Jones', discription: 15, visits: 5, status: 'Active', progress: 90 },
        { Video: 'Jack', Title: 'Jones', discription: 15, visits: 5, status: 'Active', progress: 90 },
        { Video: 'Jack', Title: 'Jones', discription: 15, visits: 5, status: 'Active', progress: 90 },
        { Video: 'Jack', Title: 'Jones', discription: 15, visits: 5, status: 'Active', progress: 90 },
        { Video: 'Jack', Title: 'Jones', discription: 15, visits: 5, status: 'Active', progress: 90 },
        { Video: 'Jack', Title: 'Jones', discription: 15, visits: 5, status: 'Active', progress: 90 },
        { Video: 'Jack', Title: 'Jones', discription: 15, visits: 5, status: 'Active', progress: 90 },
        { Video: 'Jack', Title: 'Jones', discription: 15, visits: 5, status: 'Active', progress: 90 },
        { Video: 'John', Title: 'Doe', discription: 25, visits: 10, status: 'Active', progress: 50 },
        { Video: 'Jane', Title: 'Smith', discription: 30, visits: 15, status: 'Inactive', progress: 75 },
        { Video: 'John', Title: 'Doe', discription: 25, visits: 10, status: 'Active', progress: 50 },
        { Video: 'Jane', Title: 'Smith', discription: 30, visits: 15, status: 'Inactive', progress: 75 },
        { Video: 'John', Title: 'Doe', discription: 25, visits: 10, status: 'Active', progress: 50 },
        { Video: 'Jane', Title: 'Smith', discription: 30, visits: 15, status: 'Inactive', progress: 75 },
        { Video: 'John', Title: 'Doe', discription: 25, visits: 10, status: 'Active', progress: 50 },
        { Video: 'Jane', Title: 'Smith', discription: 30, visits: 15, status: 'Inactive', progress: 75 }, { Video: 'John', Title: 'Doe', discription: 25, visits: 10, status: 'Active', progress: 50 },
        { Video: 'Jane', Title: 'Smith', discription: 30, visits: 15, status: 'Inactive', progress: 75 },
        { Video: 'John', Title: 'Doe', discription: 25, visits: 10, status: 'Active', progress: 50 },
        { Video: 'Jane', Title: 'Smith', discription: 30, visits: 15, status: 'Inactive', progress: 75 },
    ]);

    const refreshData = () => setData([]);

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

    const columnResizeMode = 'onChange';

    const columnResizeDirection = 'ltr';

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        state: {
            rowSelection,
        },
        columnResizeMode,
        columnResizeDirection,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex,
        meta: {
            updateData: (rowIndex, columnId, value) => {
                skipAutoResetPageIndex();
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...row,
                                [columnId]: value,
                            };
                        }
                        return row;
                    })
                );
            },
        },
    });

    return (
        <div className="p-2 overflow-y-scroll h-screen">
            <div className="overflow-x-auto">
                <table
                    {...{
                        style: {
                            width: table.getCenterTotalSize(),
                        },
                    }}
                >
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        {...{
                                            key: header.id,
                                            colSpan: header.colSpan,
                                            style: {
                                                width: header.getSize(),
                                            },
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        <div
                                            {...{
                                                onDoubleClick: () => header.column.resetSize(),
                                                onMouseDown: header.getResizeHandler(),
                                                onTouchStart: header.getResizeHandler(),
                                                className: `resizer ${table.options.columnResizeDirection
                                                    } ${header.column.getIsResizing() ? 'isResizing' : ''
                                                    }`,
                                                style: {
                                                    transform:
                                                        columnResizeMode === 'onEnd' &&
                                                            header.column.getIsResizing()
                                                            ? `translateX(${(table.options.columnResizeDirection ===
                                                                'rtl'
                                                                ? -1
                                                                : 1) *
                                                            (table.getState().columnSizingInfo
                                                                .deltaOffset ?? 0)
                                                            }px)`
                                                            : '',
                                                },
                                            }}
                                        />
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        {...{
                                            key: cell.id,
                                            style: {
                                                width: cell.column.getSize(),
                                            },
                                        }}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>{table.getRowModel().rows.length} Rows</div>
            <div>
                <button onClick={() => refreshData()}>Refresh Data</button>
            </div>
            <div>
                <label>Row Selection State:</label>
                <pre>{JSON.stringify(table.getSelectedRowModel().rows, null, 2)}</pre>
            </div>
        </div>
    );
}

export default NewTable;