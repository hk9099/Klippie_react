import React from 'react';
import DataGrid, { Column, Selection, Paging, Pager } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import { customer } from '../components/data.js';
import VideoPlayer from '../Pages/videoplayer.js';

const Mainvideo = () => {
  // const [selectedVideoSrc, setSelectedVideoSrc] = useState('');

  // const onSelectionChanged = (e) => {
  //   const selectedRowData = e.selectedRowsData[0];
  //   if (selectedRowData) {
  //     setSelectedVideoSrc(selectedRowData.src);
  //   }
  // };

  // const handleDownload = () => {
  //   if (selectedVideoSrc) {
  //     fetch(selectedVideoSrc)
  //       .then((response) => response.blob())
  //       .then((blob) => {
  //         const downloadLink = document.createElement('a');
  //         downloadLink.href = URL.createObjectURL(blob);
  //         downloadLink.download = 'video.mp4';
  //         downloadLink.click();
  //       })
  //       .catch((error) => {
  //         console.error('Error downloading video:', error);
  //       });
  //   }
  // };

  return (
    <div>
      <DataGrid
        dataSource={customer}
        keyExpr="id"
        showBorders={true}
        columnAutoWidth={true}
        width={'100%'}
        showRowLines={true}
        showColumnLines={true}
        // onSelectionChanged={onSelectionChanged}
      >
        <Selection mode="multiple" selectAllMode="allPages" showCheckBoxesMode="always" />
        <Paging defaultPageSize={20} />
        <Pager showPageSizeSelector={true} showInfo={true} showNavigationButtons={true} />
        <Column
          dataField="video"
          caption="Video"
          cellRender={(rowData) => <VideoPlayer src={rowData.data.src} />}
          resizable={true}
        />
        <Column dataField="description" resizable={true} className="whitespace-break-spaces" />
        <Column dataField="time" resizable={true} columnAutoWidth={true} />
        {/* <Column dataField="Action" resizable={true} columnAutoWidth={true} /> */}
      </DataGrid>
      {/* {selectedVideoSrc && (
        <button style={{ marginTop: '10px' }}>
          Download Video
        </button>
      )} */}
    </div>
  );
};

export default Mainvideo;
