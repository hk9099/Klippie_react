/* eslint-disable jsx-a11y/alt-text */
// import React, { useState } from 'react';
// import ConfettiExplosion from 'react-confetti-explosion';

// function PPP() {
//     const [isExploding, setIsExploding] = useState(false);

//     return (
//         <div className='h-screen flex justify-center items-start'>
//             {isExploding &&
//                 <ConfettiExplosion
//                 width={window.outerWidth}
//                 height={window.outerHeight}
//                 force={0.2}
//                 colors={['#ff0000', '#ffff00', '#0000ff', '#00ff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000']}
//                 />
//             }
//             <button onClick={() => setIsExploding(!isExploding)}>
//                 Toggle Confetti
//             </button>
//         </div>
//     );
// }

// export default PPP;

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Label,
  Clickable,
  EditableHeading,
  EditableText,
  Dropdown
} from "monday-ui-react-core";
import CloudinaryVideoPlayer from "./cloudinaryVideoPlayer.js";
// Placeholder data and functions, replace them with your actual implementations
const emailTableData = [
  {
    id: 1,
    sentOn: "2020-01-01",
    subject: "Subject 1",
    sentBy: "Sender 1",
    status: "Sent",
    emailsSent: 1,
  },
  {
    id: 2,
    sentOn: "2020-01-02",
    subject: "Subject 2",
    sentBy: "Sender 2",
    status: "Sent",
    emailsSent: 2,
  },
  {
    id: 3,
    sentOn: "2020-01-03",
    subject: "Subject 3",
    sentBy: "Sender 3",
    status: "Sent",
    emailsSent: 3,
  },
  {
    id: 4,
    sentOn: "2020-01-04",
    subject: "Subject 4",
    sentBy: "Sender 4",
    status: "Sent",
    emailsSent: 4,
  },
  {
    id: 5,
    sentOn: "2020-01-05",
    subject: "Subject 5",
    sentBy: "Sender 5",
    status: "Sent",
    emailsSent: 5,
  },
  {
    id: 6,
    sentOn: "2020-01-06",
    subject: "Subject 6",
    sentBy: "Sender 6",
    status: "Sent",
    emailsSent: 6,
  },
  {
    id: 7,
    sentOn: "2020-01-07",
    subject: "Subject 7",
    sentBy: "Sender 7",
    status: "Sent",
    emailsSent: 7,
  },
  {
    id: 8,
    sentOn: "2020-01-08",
    subject: "Subject 8",
    sentBy: "Sender 8",
    status: "Sent",
    emailsSent: 8,
  },
  {
    id: 9,
    sentOn: "2020-01-09",
    subject: "Subject 9",
    sentBy: "Sender 9",
    status: "Sent",
    emailsSent: 9,
  },
  {
    id: 10,
    sentOn: "2020-01-10",
    subject: "Subject 10",
    sentBy: "Sender 10",
    status: "Sent",
    emailsSent: 10,
  },
  {
    id: 11,
    sentOn: "2020-01-11",
    subject: "Subject 11",
    sentBy: "Sender 11",
    status: "Sent",
    emailsSent: 11,
  },
];
const sort = (columnId, sortState, tableData) => {
  const sortedData = [...tableData];
  const isAscending = sortState === "asc";

  sortedData.sort((a, b) => {
    const valueA = a[columnId];
    const valueB = b[columnId];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return isAscending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else if (typeof valueA === "number" && typeof valueB === "number") {
      return isAscending ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  return sortedData;
};
const TableErrorState = () => <div>Error State</div>; // Replace with your actual error state component
const TableEmptyState = () => <div>Empty State</div>; // Replace with your actual empty state component
const emailColumns = [
  {
    id: "sentOn",
    title: "Sent On",
    icon: "calendar",
    infoContent: "This is the date the email was sent",
  },
  {
    id: "subject",
    title: "Subject",
    icon: "email",
    infoContent: "This is the subject of the email",
  },
  {
    id: "sentBy",
    title: "Sent By",
    icon: "user",
    infoContent: "This is the sender of the email",
  },
  {
    id: "status",
    title: "Status",
    icon: "status",
    infoContent: "This is the status of the email",
  },
  {
    id: "emailsSent",
    title: "Emails Sent",
    icon: "email",
    infoContent: "This is the number of emails sent",
  },
];

function Confetti() {
  const [tableData, setTableData] = useState(emailTableData);
  const [sorting, setSorting] = useState({});

  const onSort = (columnId, sortState) => {
    setSorting({
      [columnId]: sortState,
    });
    setTableData(sort(columnId, sortState, tableData));
  };
  const handleRowClick = (rowItem) => {
    console.log("Clicked row data:", rowItem);
    // Add your logic to handle the clicked row data
  };
  return (
    <div style={{
      height: 500,
      width: "100%"
    }}>
      <Table
        errorState={<TableErrorState />}
        emptyState={<TableEmptyState />}
        columns={emailColumns}
        data-testid="email-table"
        dataState={tableData}
        id={"email-table"}
        size="medium"
        style={{ width: "100%", marginTop: "40px" }}
      >
        <TableHeader>
          {emailColumns.map((headerCell, index) => (
            <TableHeaderCell
              key={index}
              title={headerCell.title}
              icon={headerCell.icon}
              infoContent={headerCell.infoContent}
              // onSortClicked={(sortState) =>
              //   onSort(headerCell.id, sortState)
              // }
              // sortState={sorting[headerCell.id]}
              id={headerCell.id}
            />
          ))}
        </TableHeader>
        <TableBody>
          {tableData.map((rowItem) => (
            <TableRow
              key={rowItem.id}
              style={{
                height: "auto",
              }}
            >
              <TableCell
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  height: "auto",
                }}
              >
                <EditableText
                  type="textarea"
                  value={rowItem.sentOn}
                  ellipsis={true}
                  tooltip={true}
                />
              </TableCell>
              <TableCell>{rowItem.subject}</TableCell>
              {/* <Clickable
                key={rowItem.id}

                onClick={() => handleRowClick(rowItem)}
              > */}
              <TableCell>
                <Avatar
                  text={rowItem.sentBy.charAt(0)}
                  size="small"
                  type="text"
                  backgroundColor="red"
                  ariaLabel="User Avatar"
                />
              </TableCell>
              {/* </Clickable> */}
              <TableCell>
                <Dropdown
                  className=" w-full"
                  // onBlur={function noRefCheck() { }}
                  // onChange={function noRefCheck() { }}
                  // onClear={function noRefCheck() { }}
                  // onFocus={function noRefCheck() { }}
                  // onInputChange={function noRefCheck() { }}
                  // onKeyDown={function noRefCheck() { }}
                  // onMenuClose={function noRefCheck() { }}
                  // onMenuOpen={function noRefCheck() { }}
                  // onOptionRemove={function noRefCheck() { }}
                  // onOptionSelect={function noRefCheck() { }}
                  // openMenuOnFocus={function noRefCheck() { }}
                  insideOverflowWithTransformContainer={true}
                  searchable={false}
                  size="medium"
                  options={[
                    {
                      label: 'Option 1',
                      value: 1
                    },
                    {
                      label: 'Option 2',
                      value: 2
                    },
                    {
                      label: 'Option 3',
                      value: 3
                    }
                  ]}
                  placeholder="Placeholder text here"
                />
              </TableCell>
              <TableCell
                style={{
                }}
              >
                <div style={{ 
                  display: "flex", alignItems: "center" ,
                  flexDirection: "column" 
                  }}>
                <CloudinaryVideoPlayer src={"http://res.cloudinary.com/delkyf33p/video/upload/so_793.6543/eo_851.84503/test1703570210215"} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  );
}

export default Confetti;



// SchoolPride.js
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import ReactCanvasConfetti from "react-canvas-confetti";

// function randomInRange(min, max) {
//   return Math.random() * (max - min) + min;
// }

// const canvasStyles = {
//   position: "fixed",
//   pointerEvents: "none",
//   width: "100%",
//   height: "100%",
//   top: 0,
//   left: 0
// };

// function getAnimationSettings(originXA, originXB) {
//   return {
//     startVelocity: 30,
//     spread: 360,
//     ticks: 60,
//     zIndex: 0,
//     particleCount: 150,
//     origin: {
//       x: randomInRange(originXA, originXB),
//       y: Math.random() - 0.2
//     }
//   };
// }

// export default function Fireworks() {
//   const refAnimationInstance = useRef(null);
//   const [intervalId, setIntervalId] = useState();

//   const getInstance = useCallback((instance) => {
//     refAnimationInstance.current = instance;
//   }, []);

//   const nextTickAnimation = useCallback(() => {
//     if (refAnimationInstance.current) {
//       refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
//       refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
//     }
//   }, []);

//   const startAnimation = useCallback(() => {
//     if (!intervalId) {
//       setIntervalId(setInterval(nextTickAnimation, 400));
//     }
//   }, [intervalId, nextTickAnimation]);

//   const stopAnimation = useCallback(() => {
//     clearInterval(intervalId);
//     setIntervalId(null);
//     refAnimationInstance.current && refAnimationInstance.current.reset();
//   }, [intervalId]);

//   useEffect(() => {
//     // Start the animation after 5 seconds
//     const timeoutId = setTimeout(() => {
//       startAnimation();
//     }, 5000);

//     // Stop the animation after another 5 seconds
//     const stopTimeoutId = setTimeout(() => {
//       stopAnimation();
//     }, 10000);

//     // Cleanup the timeouts to avoid memory leaks
//     return () => {
//       clearTimeout(timeoutId);
//       clearTimeout(stopTimeoutId);
//     };
//   }, [startAnimation, stopAnimation]);

//   useEffect(() => {
//     // Cleanup the interval when the component unmounts
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [intervalId]);

//   return (
//     <>
//       <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
//     </>
//   );
// }



