import React, { useState } from 'react';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import { MainVideo } from '../components/data.js';
// import VideoPlayer from '../Pages/videoplayer.js';
import CloudinaryVideoPlayer from "../components/cloudinaryVideoPlayer.js";

const Mainvideo = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [mainVideo, setMainVideo] = useState(true);
  // const [selectedVideoSrc, setSelectedVideoSrc] = useState('');

  // const onSelectionChanged = (e) => {
  //   const selectedRowData = e.selectedRowsData[0];
  //   if (selectedRowData) {
  //     setSelectedVideoSrc(selectedRowData.src);
  //   }
  // };

  return (
    <div>
      <DataGrid
        dataSource={MainVideo}
        keyExpr="id"
        showBorders={true}
        columnAutoWidth={true}
        showRowLines={true}
        showColumnLines={true}
        sorting={{ mode: 'none' }}
      // onSelectionChanged={onSelectionChanged}
      >
        <Editing
          allowUpdating={false}
          allowAdding={false}
          allowDeleting={false}
          mode="popup" />
        {/* <Selection mode="multiple" selectAllMode="allPages" showCheckBoxesMode="always" visible={false} /> */}
        <Column
          dataField="video"
          caption="Video"
          alignment='center'
          cssClass='Video'
          cellRender={(rowData) =>
            <CloudinaryVideoPlayer src={rowData.data.src} title={rowData.data.title} type={rowData.data.type} setMainVideo={mainVideo} />
            //  <CloudinaryVideoPlayer src={rowData.data.src} title={rowData.data.title} type={rowData.data.type} setMainVideo={mainVideo}} />
          }
          width={450}
        />
        <Column
          dataField="title"
          alignment='center'
          cssClass='Title'
          className="whitespace-break-spaces"
          width='auto'
          cellRender={(rowData) => (
            <div style={{ textAlign: "left" }}>
              {rowData.data.title}
            </div>
          )}
        />
        <Column
          dataField="description"
          className="whitespace-break-spaces"
          alignment='center'
          cssClass='Description'
          cellRender={(rowData) => (
            <div style={{ textAlign: "left" }}>
              {rowData.data.description}
            </div>
          )}
        />
        <Column
          dataField="time"
          caption="Duration"
          alignment='center'
          cssClass='Duration'
          columnAutoWidth={true}
          cellRender={(rowData) => (
            <div style={{ textAlign: "center" }}>
              {rowData.data.time}
            </div>
          )}
          width='auto'
        />
      </DataGrid>
    </div>
  );
};

export default Mainvideo;
