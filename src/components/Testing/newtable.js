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
import { usePagination } from '@mantine/hooks';
import { TextInput, Text, Checkbox, Textarea, Button, CopyButton, ActionIcon, Tooltip, rem, Loader, Pagination, LoadingOverlay, Box, Group, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCopy, IconCheck, IconX, IconReload, IconChevronDown } from '@tabler/icons-react';
import DropDownButton from "../Table/Action/GridDropdown.js";
import axios from 'axios';
import qs from 'qs';

function NewTable({ newmainClips, videoClips, setVideoCount, userToken, useBaseUrl }) {
    useEffect(() => {
        setData(videoClips)
    }, [videoClips])

    const [data, setData] = useState([]);
    console.log(data, 'dataaaaaaaaaaaaaaaaaaaaaaaaaa')

    const refreshData = () => setData([]);

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

    const columnHelper = createColumnHelper();

    const columns = [
        {
            id: 'select',
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
                <div className="px-1 text-center  justify-center">
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
            size: 50,
        },
        columnHelper.accessor('src', {
            header: 'Video',
            cell: ({ row }) => {
                const value = row;
                console.log(value, 'valuuuuuuuuuuuue');
                return (
                    <div className="w-full">
                        <CloudinaryVideoPlayer src={value.original?.src ? value.original.src : ""} title={value.original?.title ? value.original.title : ""} type={value.original?.type ? value.original.type : ""} publicId={value.original?.publicId ? value.original.publicId : ""} startTime={value.original?.start_time ? value.original.start_time : ""} endTime={value.original?.end_time ? value.original.end_time : ""} clipId={value.original?.id ? value.original.id : ""} />
                    </div>
                )
            },
            footer: info => info.column.id,
            // size: 410,
        }),
        columnHelper.accessor('title', {
            header: 'Title',
            cell: ({ row }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [value, setValue] = useState(row.original.title);
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
                const handleRegenerate = (id, columnId, newValue) => {
                    let data = qs.stringify({
                        'id': id,
                        [columnId]: 'true',
                    });

                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://dev-api.getklippie.com/v1/clip/re-clip-data',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + userToken
                        },
                        data: data
                    };

                    axios.request(config)
                        .then((response) => {
                            console.log(response.data.data.title, 'sdsdfsdfsdf');
                            setData((old) =>
                                old.map((rowData) => {
                                    if (rowData.id === id) {
                                        return {
                                            ...rowData,
                                            [columnId]: response.data.data.title
                                        };
                                    }
                                    return rowData;
                                })
                            );

                        })
                        .catch((error) => {
                            console.log(error);
                        });
                };
                useEffect(() => {
                    setValue(row.original.title);
                }, [row.original.title]);
                const [visible, setVisible] = useState(false);
                const [error, setError] = useState();

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
                                value={value}
                                onChange={handleChange}
                                placeholder=""
                                autosize
                                minRows={9}
                                error={error}
                                maxRows={9}
                                color='white'
                                classNames={{
                                    input: 'bg-transparent w-[auto!important]  p-[5px!important] text-[#fff!important] p-0 border-0 hover:border hover:border-white outline-none ',
                                    // root: 'bg-transparent  w-auto text-white p-0 border-0 hover:border hover:border-white outline-none h-12 resize-none'
                                }}
                                styles={{
                                    input: {
                                        fontSize: '14px'
                                    },
                                    error: {
                                        borderColor: '#ef4444',
                                        border: `${error ? '1px solid' : 'none'}`,
                                        borderRadius: `${error ? '10px' : 'none'}`,
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
                                    <CopyButton
                                        value={value}
                                        timeout={2000}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="bottom">
                                                <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                                    {copied ? (
                                                        <IconCheck style={{ width: rem(16) }} />
                                                    ) : (
                                                        <IconCopy style={{ width: rem(16) }} />
                                                    )}
                                                </ActionIcon>
                                            </Tooltip>
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
                                        onClick={() => handleRegenerate(row.original.id, 'title', value)}
                                    >
                                        Regenerate
                                    </Button>
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
                                            let data = qs.stringify({
                                                'id': row.original.id,
                                                'title': value
                                            });

                                            let config = {
                                                method: 'post',
                                                maxBodyLength: Infinity,
                                                url: 'https://dev-api.getklippie.com/v1/clip/update',
                                                headers: {
                                                    'accept': 'application/json',
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Authorization': 'Bearer ' + userToken
                                                },
                                                data: data
                                            };

                                            axios.request(config)
                                                .then((response) => {
                                                    console.log(JSON.stringify(response.data), 'ytjfghjgfhjghjgfhjhg');
                                                    setVisible(false)
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                    setError(error.response.data.detail)
                                                    setVisible(false)
                                                    setTimeout(() => {
                                                        setError(null)
                                                    }, 7000);
                                                });
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
                const [value, setValue] = useState(row.original.description);
                const [isHovered, setIsHovered] = useState(false);
                const [visible, setVisible] = useState(false);
                const [error, setError] = useState();

                const [regenerationStatus, setRegenerationStatus] = useState();

                const handleChange = (e) => {
                    setValue(e.target.value);
                };

                const handleMouseEnter = () => {
                    setIsHovered(true);
                };

                const handleMouseLeave = () => {
                    setIsHovered(false);
                };

                function getButtonLabel() {
                    return regenerationStatus === 'generating' ? 'Generating' : 'Regenerate';
                }

                function getButtonColor() {
                    return regenerationStatus === 'generated' ? 'teal' : 'gray';
                }


                const handleRegenerate = (id, columnId, newValue) => {
                    setRegenerationStatus('generating');

                    let data = qs.stringify({
                        'id': id,
                        [columnId]: 'true',
                    });

                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://dev-api.getklippie.com/v1/clip/re-clip-data',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + userToken
                        },
                        data: data
                    };

                    axios.request(config)
                        .then((response) => {
                            console.log(response.data.data.description, 'sdsdfsdfsdf');
                            setData((old) =>
                                old.map((rowData) => {
                                    if (rowData.id === id) {
                                        return {
                                            ...rowData,
                                            [columnId]: response.data.data.description
                                        };
                                    }
                                    return rowData;
                                })
                            );
                            setRegenerationStatus('generated');

                            // Reset to 'regenerate' after 2 seconds
                            setTimeout(() => {
                                setRegenerationStatus('regenerate');
                            }, 2000);
                        })
                        .catch((error) => {
                            console.log(error);
                            setRegenerationStatus('failed');

                            // Reset to 'regenerate' after 2 seconds
                            // setTimeout(() => {
                            //     setRegenerationStatus('regenerate');
                            // }, 2000);
                        });
                };

                function getIconForStatus(status) {
                    switch (status) {
                        case 'generating':
                            return <Loader color="gray" size="xs" />;
                        case 'generated':
                            return <IconCheck style={{ width: rem(16) }} />;
                        case 'failed':
                            return <IconX style={{ width: rem(16) }} />;
                        default:
                            return <IconReload style={{ width: rem(16) }} />;
                    }
                }

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
                                    input: 'bg-transparent p-[5px!important] text-[#fff!important] hover:border hover:border-white outline-none resize-none',
                                }}
                                styles={{
                                    input: {
                                        fontSize: '14px'
                                    },
                                    error: {
                                        borderColor: '#ef4444',
                                        border: `${error ? '1px solid' : 'none'}`,
                                        borderRadius: `${error ? '10px' : 'none'}`,
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
                                    <CopyButton
                                        value={value}
                                        timeout={2000}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="bottom">
                                                <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                                    {copied ? (
                                                        <IconCheck style={{ width: rem(16) }} />
                                                    ) : (
                                                        <IconCopy style={{ width: rem(16) }} />
                                                    )}
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                    <CopyButton timeout={2000}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={getButtonLabel()} withArrow position="right">
                                                <ActionIcon color={getButtonColor()} variant="subtle" onClick={() => handleRegenerate(row.original.id, 'description', value)}>
                                                    {getIconForStatus(regenerationStatus)}
                                                </ActionIcon>
                                            </Tooltip>
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
                                        onClick={() => handleRegenerate(row.original.id, 'description', value)}
                                    >
                                        Regenerate
                                    </Button>
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
                                            let data = qs.stringify({
                                                'id': row.original.id,
                                                'summary': value
                                            });

                                            let config = {
                                                method: 'post',
                                                maxBodyLength: Infinity,
                                                url: 'https://dev-api.getklippie.com/v1/clip/update',
                                                headers: {
                                                    'accept': 'application/json',
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Authorization': 'Bearer ' + userToken
                                                },
                                                data: data
                                            };

                                            axios.request(config)
                                                .then((response) => {
                                                    console.log(JSON.stringify(response.data), 'ytjfghjgfhjghjgfhjhg');
                                                    setVisible(false)
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                    setError(error.response.data.detail)
                                                    setVisible(false)
                                                    setTimeout(() => {
                                                        setError(null)
                                                    }, 7000);
                                                });
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                );
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

    const tablePagination = usePagination({ total: table.getPageCount(), initialPage: 1 });

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
            <div className="flex items-center justify-between gap-2 mb-4 mt-4">
                <Group >
                    <Text styles={{
                        root: {
                            color: '#fff'
                        }
                    }}>
                        Clips per page:
                    </Text>
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onChange={(e) => {
                            table.setPageSize(Number(e));
                        }}
                        rightSection={<IconChevronDown width={20} />}
                        data={[
                            { label: '5', value: "5" },
                            { label: '10', value: "10" },
                            { label: '20', value: "20" },
                            { label: '30', value: "30" },
                            { label: '40', value: "40" },
                            { label: '50', value: "50" },
                            { label: '60', value: "60" },
                            { label: '70', value: "70" },
                            { label: '80', value: "80" },
                            { label: '90', value: "90" },
                            { label: '100', value: "100" },
                        ]}
                        className="rounded w-20"
                    />
                </Group>
                <Group>
                    <Text styles={{
                        root: {
                            color: '#fff'
                        }
                    }}>Go to Page:</Text>
                    <TextInput
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            table.setPageIndex(page);
                        }}
                        className="rounded w-16"
                    />
                    <Text
                        styles={{
                            root: {
                                color: '#fff'
                            }
                        }}
                    >Page: {table.getState().pagination.pageIndex + 1} of{' '}{table.getPageCount()} </Text>
                    <Pagination
                        color="violet"
                        total={table.getPageCount()}
                        value={table.getState().pagination.pageIndex + 1}
                        onChange={(value) => table.setPageIndex(value - 1)}
                        onFirstPage={() => table.setPageIndex(0)}
                        onNextPage={() => table.nextPage()}
                        onPreviousPage={() => table.previousPage()}
                        onLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
                        siblings={1}
                        withEdges
                        withControls
                        defaultValue={10}
                    />
                </Group>
            </div>

        </div>
    );
}

export default NewTable;