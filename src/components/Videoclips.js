import React,{useEffect} from "react";
import DataGrid, {
  Column,
  Selection,
  Paging,
  Pager,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import VideoPlayer from "../Pages/videoplayer.js";
import DropDownButton from "../components/GridDropdown.js";
const Videoclips = ({ videoClips, setVideoCount }) => {
  const dataSource = {
    store: videoClips, 
    key: "id",
    loadOptions: {
      pageSize: 3,
    },
  };

  useEffect(() => {
    // Update the video count whenever the videoClips data changes
    setVideoCount(videoClips.length);
  }, [videoClips, setVideoCount]);

  return (
    <DataGrid
      dataSource={dataSource}
      showBorders={true}
      columnAutoWidth={true}
      showRowLines={true}
      showColumnLines={true}
      loadPanel={{ enabled: true }} 
    >
      <Selection
        mode="multiple"
        selectAllMode="allPages"
        showCheckBoxesMode="always"
      />
      <Paging defaultPageSize={3} />
      <Pager
        showPageSizeSelector={true}
        showInfo={true}
        showNavigationButtons={true}
        visible={true}
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
              <DropDownButton status={rowData.data.status} clipId={rowData.data.id} />
          </div>
        )}
        width={200}
      />
    </DataGrid>

  );
};

export default Videoclips;
