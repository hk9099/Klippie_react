import React, {useEffect} from "react";
import DataGrid, {
  Column,
  Selection,
  Paging,
  Pager,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { customers } from "../components/data.js";
import VideoPlayer from "../Pages/videoplayer.js";
import DropDownButton from "../components/GridDropdown.js";
import { LoadingIndicator } from "devextreme-react/bar-gauge.js";
import { LoadPanel } from "devextreme-react";
const Videoclips = ({ setVideoCount }) => {

  useEffect(() => {
    setVideoCount(customers.length);
  }, [setVideoCount]); 

  return (
    <DataGrid
      dataSource={customers}
      keyExpr="id"
      showBorders={true}
      columnAutoWidth={true}
      width={"100%"}
      showRowLines={true}
      showColumnLines={true}
    >
      <LoadPanel enabled={true} />
      <LoadingIndicator enabled={true} />
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
        visible={true}
      />
      <Column
        dataField="video"
        caption="Video"
        cellRender={(rowData) => <VideoPlayer src={rowData.data?.src? rowData.data.src : ""} />}
        resizable={true}
      />
      <Column
        dataField="description"
        resizable={true}
        className="whitespace-break-spaces"
      />
      <Column dataField="time" resizable={true} columnAutoWidth={true} />
      <Column

        dataField="Action"
        resizable={true}
        columnAutoWidth={true}
        cellRender={(rowData) => <DropDownButton />}
      />
    </DataGrid>
  );
};

export default Videoclips;
