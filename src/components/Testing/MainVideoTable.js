/* eslint-disable react-hooks/rules-of-hooks */
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
import { TextInput, Checkbox, Textarea, Button, CopyButton, ActionIcon, Tooltip, rem, Group, Pagination, LoadingOverlay, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import DropDownButton from "../Table/Action/GridDropdown.js";
import axios from 'axios';

function MainVideoTable({newmainClips, setVideoCount, userToken, useBaseUrl }) {
    useEffect(() => {
        setData(newmainClips)
    }, [newmainClips])
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

        if (id === 'src') {
            return (
                <div className='w-full'>
                    <CloudinaryVideoPlayer src={getValue()} title={getValue()} type={getValue()} publicId={getValue()} startTime={getValue()} endTime={getValue()} clipId={getValue()} />
                </div>
            )
        }

        if (id === 'title') {
            return (
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className='relative'
                >
                    {/* <input
                        value={value}
                        onChange={handleChange}
                        onBlur={onBlur}
                        className='bg-transparent  w-auto text-white p-0 border-0 hover:border hover:border-white outline-none h-12 resize-none '
                    /> */}
                    <Textarea
                        variant="unstyled"
                        value={value}
                        onChange={handleChange}
                        onBlur={onBlur}
                        placeholder=""
                        color='white'
                        classNames={{
                            input: 'bg-transparent w-auto text-[#fff!important] p-0 border-0 hover:border hover:border-white outline-none h-12 resize-none',
                            // root: 'bg-transparent  w-auto text-white p-0 border-0 hover:border hover:border-white outline-none h-12 resize-none'
                        }}
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

        if (id === 'description') {
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
                        className='bg-transparent text-white p-0 border-0 hover:border hover:border-white outline-none h-auto resize-none '
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

        const readOnly = true

        return (
            // <input
            //     value={value}
            //     onChange={handleChange}
            //     onBlur={onBlur}
            //     readOnly={readOnly}
            //     className={`bg-transparent text-white outline-none p-0 border-0 ${readOnly ? 'cursor-pointer' : 'hover:border hover:border-white outline-none h-12 resize-none'}`}
            // />
            <TextInput
                variant="unstyled"
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                disabled={readOnly}
                placeholder=""
                styles={{
                    input: {
                        color: '#fff',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        cursor: readOnly ? 'pointer' : 'text',
                        fontSize: '1rem',
                        lineHeight: '1.5rem',
                        fontWeight: 900,
                        textAlign: 'center',
                    },
                    root: {
                        color: '#FFFFFF',
                        justifyContent: 'center',
                    },
                }}
            />
        );
    }

    // const defaultColumn = {
    //     cell: CustomCell,
    // };

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
                ref.current.indeterminate = indeterminate;
            }
        }, [indeterminate]);

        return (
            <Checkbox
                ref={ref}
                className={className + ' cursor-pointer '}
                indeterminate={indeterminate}
                styles={{
                    body: {
                        textAlign: 'center',
                        justifyContent: 'center'
                    }
                }}
                {...rest}
            />
        );
    }


    const [rowSelection, setRowSelection] = React.useState({})

    const columnHelper = createColumnHelper(); // Replace 'Person' with the actual type

    const columns = [
        // {
        //     id: 'select',
        //     header: ({ table }) => (
        //         <IndeterminateCheckbox
        //             {...{
        //                 checked: table.getIsAllRowsSelected(),
        //                 indeterminate: table.getIsSomeRowsSelected(),
        //                 onChange: table.getToggleAllRowsSelectedHandler(),
        //             }}
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <div className="px-1 text-center  justify-center">
        //             <IndeterminateCheckbox
        //                 {...{
        //                     checked: row.getIsSelected(),
        //                     disabled: !row.getCanSelect(),
        //                     indeterminate: row.getIsSomeSelected(),
        //                     onChange: row.getToggleSelectedHandler(),
        //                 }}
        //             />
        //         </div>
        //     ),
        //     size: 50,
        // },
        columnHelper.accessor('src', {
            header: 'Video',
            cell: ({ row }) => {
                const value = row;
                console.log(value, 'valuuuuuurrrrrrrrrrruuuuuue');
                return (
                    <div className="w-full">
                        <CloudinaryVideoPlayer src={row.original.src} title={row.original.title} type={row.original.type} setMainVideo={true}/>
                    </div>
                )
            },
            footer: info => info.column.id,
            // size: 410,
        }),
        columnHelper.accessor('title', {
            header: 'Title',
            cell: ({ getValue }) => {
                const initialValue = getValue();
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [valuee, setValue] = useState(initialValue);
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

                useEffect(() => {
                    setValue(initialValue);
                }, [initialValue]);
                const [visible, setVisible] = useState(false);

                return (
                    <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className='relative'
                    >
                        <Box pos="relative">
                            <LoadingOverlay visible={visible}
                                overlayProps={{ radius: 'sm', blur: 0, opacity: 0.6 }}
                                loaderProps={{ color: 'violet', type: 'bars' }}
                            />
                            <Textarea
                                variant="unstyled"
                                value={valuee}
                                onChange={handleChange}
                                placeholder=""
                                autosize
                                minRows={9}
                                maxRows={9}
                                color='white'
                                classNames={{
                                    input: 'bg-transparent w-[auto!important]  p-[5px!important] text-[#fff!important] p-0 border-0 hover:border hover:border-white outline-none ',
                                    // root: 'bg-transparent  w-auto text-white p-0 border-0 hover:border hover:border-white outline-none h-12 resize-none'
                                }}
                                styles={{
                                    input: {
                                        fontSize: '14px',
                                    }
                                }}
                            />
                        </Box>
                        <div className='flex justify-end'>
                            {isHovered && (
                                <div className='flex justify-end items-center mt-2'>
                                    <CopyButton value={valuee} >
                                        {({ copied, copy }) => (
                                            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                                {copied ? 'Copied' : 'Copy'}
                                            </Button>
                                        )}
                                    </CopyButton>
                                    <Button
                                        variant="filled"
                                        color="green"
                                        styles={{
                                            root: {
                                                marginLeft: rem(10),
                                            },
                                        }}
                                        onClick={() => {
                                            setVisible(true)
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            },
            footer: info => info.column.id,
            // size: 200,
        }),
        columnHelper.accessor('description', {
            header: 'Discription ',
            footer: info => info.column.id,
            cell: ({ row }) => {
                const initialValue = row.original.description
                // eslint-disable-next-line react-hooks/rules-of-hooks
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

                useEffect(() => {
                    setValue(initialValue);
                }, [initialValue]);
                const [visible, setVisible] = useState(false);
                const [error, setError] = useState();
               
                return (
                    <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className=' '
                    >

                        <Box pos="relative">
                            <LoadingOverlay visible={visible}
                                overlayProps={{ radius: 'sm', blur: 0, opacity: 0.6 }}
                                loaderProps={{ color: 'violet', type: 'bars' }}
                            />
                            <Textarea
                                variant="unstyled"
                                value={value}
                                onChange={handleChange}
                                placeholder=""
                                autosize
                                error={error}
                                minRows={9}
                                maxRows={9}
                                color='white'
                                classNames={{
                                    input: 'bg-transparent  p-[5px!important] text-[#fff!important]  hover:border hover:border-white outline-none  resize-none',
                                    // root: 'bg-transparent  w-auto text-white p-0 border-0 hover:border hover:border-white outline-none h-12 resize-none'
                                }}
                                styles={{
                                    input: {
                                        fontSize: '14px'
                                    },
                                    error: {
                                        borderColor: '#ef4444',
                                        border: `${error ? '1px solid' : 'none'}`,
                                        boderRadius: `${error ? '10px' : 'none'}`,
                                        padding: `${error ? '5px' : 'none'}`,
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        backgroundColor: '#ef4444',
                                    }
                                }}
                            />
                        </Box>
                        <div className='flex justify-end'>
                            {isHovered && (
                                <div className='flex justify-end items-center mt-2'>
                                    <CopyButton value={value} >
                                        {({ copied, copy }) => (
                                            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                                {copied ? 'Copied' : 'Copy'}
                                            </Button>
                                        )}
                                    </CopyButton>
                                    <Button
                                        variant="filled"
                                        color="green"
                                        styles={{
                                            root: {
                                                marginLeft: rem(10),
                                            },
                                        }}
                                        onClick={() => {
                                            setVisible(true)
                                            // let data = JSON.stringify({
                                            //     "id": row.original.id,
                                            //     "description": value,
                                            // });
                                            // let config = {
                                            //     method: 'post',
                                            //     maxBodyLength: Infinity,
                                            //     url: `${useBaseUrl}/v1/clip/update`,
                                            //     headers: {
                                            //         'accept': 'application/json',
                                            //         'Content-Type': 'application/json',
                                            //         'Authorization': 'Bearer ' + userToken
                                            //     },
                                            //     data: data
                                            // };
                                            // axios.request(config)
                                            //     .then((response) => {
                                            //         console.log(JSON.stringify(response.data), 'ytjfghjgfhjghjgfhjhg');
                                            //         setVisible(false)
                                            //     })
                                            //     .catch((error) => {
                                            //         console.log(error);
                                            //         setError(error.response.data.detail)
                                            //         setVisible(false)
                                            //         setTimeout(() => {
                                            //             setError(null)
                                            //         }, 7000);
                                            //     });
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            },
            size: 'auto',
        }),
        columnHelper.accessor('time', {
            header: 'Duration',
            footer: info => info.column.id,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            footer: info => info.column.id,
            cell: ({ row }) => {
                return (
                    <DropDownButton status={row.original.status} clipId={row.original.id} />
                )
            }
        }),
    ];

    const [data, setData] = useState(newmainClips);

    console.log("New Table", newmainClips)
    // const refreshData = () => setData([]);

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

    const columnResizeMode = 'onChange';
    const columnResizeDirection = 'ltr';
    // console.log("defaultColumn", defaultColumn)
    const table = useReactTable({
        data,
        columns,
        // defaultColumn,
        state: {
            rowSelection,
        },
        columnResizeMode,
        columnResizeDirection,
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
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
        <div className="">
            <div className="block max-w-full rounded-lg overflow-x-scroll overflow-y-hidden custum_border">
                <table
                    {...{
                        style: {
                            width: table.getCenterTotalSize(),
                        },
                    }}
                    className=" border">
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
                                        {/* <div
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
                                        /> */}
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
            {/* <div className="h-2" />
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
                <label>Row Selection State:</label>
                <pre>{JSON.stringify(table.getSelectedRowModel().rows, null, 2)}</pre>
            </div> */}
        </div>
    );
}

export default MainVideoTable;