import React, { useEffect } from "react";
import DataGrid, {
  Column,
  Selection,
  Paging,
  Pager,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { VideoClips } from "../components/data.js";
import VideoPlayer from "../Pages/videoplayer.js";
import DropDownButton from "../components/GridDropdown.js";
const Videoclips = ({ setVideoCount }) => {

  useEffect(() => {
    setVideoCount(VideoClips.length);
  }, [setVideoCount]);

  return (
    <DataGrid
      dataSource={VideoClips}
      keyExpr="id"
      showBorders={true}
      columnAutoWidth={true}
      showRowLines={true}
      showColumnLines={true}
    >
      <Selection
        mode="multiple"
        selectAllMode="allPages"
        showCheckBoxesMode="always"
      />
      <Paging defaultPageSize={5} />
      <Pager
        showPageSizeSelector={true}
        showInfo={true}
        showNavigationButtons={true}
        visible={false}
      />
      <Column
        dataField="video"
        caption="Video"
        cellRender={(rowData) =>
          <div >
            <VideoPlayer src={rowData.data?.src ? rowData.data.src : ""} />
          </div>
        }
        width={460}
      />
      <Column
        dataField="title"
        className="whitespace-break-spaces"
        width={200}
      />
      <Column
        dataField="description"
        width={500}
        cellRender={(rowData) => (
          <div style={{ textAlign: "left", fontFamily: 'sans-serif' }}>
            {rowData.data.description}
          </div>
        )}
      />
      <Column
        dataField="time"
        columnAutoWidth={true}
        cellRender={(rowData) => (
          <div style={{ textAlign: "center" }}>
            {rowData.data.time}
          </div>
        )}
      />
      <Column
        dataField="Action"
        resizable={true}
        columnAutoWidth={true}
        cellRender={(rowData) => (
          <div style={{ textAlign: "center" }}>
            {/* Replace DropDownButton with your action button component */}
            <DropDownButton />
          </div>
        )}
        width={200}
      />
    </DataGrid>
  );
};

export default Videoclips;
