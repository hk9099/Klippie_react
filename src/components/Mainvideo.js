import React from 'react';
import DataGrid, { Column, Selection} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import { MainVideo } from '../components/data.js';
import VideoPlayer from '../Pages/videoplayer.js';

const Mainvideo = () => {
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
        <Selection mode="multiple" selectAllMode="allPages" showCheckBoxesMode="always" />
        <Column
          dataField="video"
          caption="Video"
          cellRender={(rowData) => <VideoPlayer src={rowData.data.src} />}
          width={460}
        />
        <Column
          dataField="title"
          className="whitespace-break-spaces"
          width={150}
        />
        <Column
          dataField="description"
          className="whitespace-break-spaces"
          
        />
        <Column
          dataField="time"
          columnAutoWidth={true}
          cellRender={(rowData) => (
            <div style={{ textAlign: "center" }}>
              {rowData.data.time}
            </div>
          )}
          width={150}
        />
      </DataGrid>
    </div>
  );
};

export default Mainvideo;
