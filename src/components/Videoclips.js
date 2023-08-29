import React, { useState, useEffect, useRef } from "react";
import DataGrid, {
  Column,
  Selection,
  Paging,
  Pager,
  Item,
  Editing,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import VideoPlayer from "../Pages/videoplayer.js";
import DropDownButton from "../components/GridDropdown.js";
import { Popup } from "devextreme-react/popup";
import { Form } from "devextreme-react/form";

const Videoclips = ({ videoClips, setVideoCount }) => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const isDataLoadedRef = useRef(false); // Use a ref to track data loading

  const handleDescriptionCellClick = (rowData) => {
    setSelectedRowData(rowData.data);
    setPopupVisible(true);
  };

  //eslint-disable-next-line
  const handleClosePopup = () => {
    setSelectedRowData(null);
    setPopupVisible(false);
  };

  const dataSource = {
    store: videoClips,
    key: "id",
  };

  useEffect(() => {
    // Update the video count whenever the videoClips data changes
    setVideoCount(videoClips.length);

    // Load videoClips data only once when it's available
    if (!isDataLoadedRef.current && videoClips.length > 0) {
      isDataLoadedRef.current = true;
    }
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
      <Editing 
        mode="popup"
        useIcons={false}
        allowUpdating={false}
        allowDeleting={false}
        allowAdding={false}  
        popup={{
          title: "Video Clip", showTitle: true, width: 700, height: 525,
          form: {
            colCount: 2,
            items: [
              {
                dataField: "title",
                label: { text: "Title" },
                editorType: "dxTextBox",
                editorOptions: { width: 300 },
                validationRules: [{ type: "required" }],
              },
              {
                dataField: "description",
                label: { text: "Description" },
                editorType: "dxTextArea",
                editorOptions: { width: 300 },
                validationRules: [{ type: "required" }],
              },
            ],
          },
        }}
      />
      <Paging defaultPageSize={3} />
      <Pager
        showPageSizeSelector={true}
        showInfo={true}
        showNavigationButtons={true}
        visible={true}
        displayMode="compact"
      />
      <Column
        dataField="video"
        caption="Video"
        cellRender={(rowData) =>
          <div >
            <VideoPlayer src={rowData.data?.src ? rowData.data.src : ""}  title={rowData.data?.title ? rowData.data.title : ""} />
          </div>
        }
        width='auto'
        allowSorting={false}
      />
      <Column
        dataField="title"
        className="whitespace-break-spaces"
        width='auto'
        allowSorting={false}
      />
     <Column
        dataField="description"
        width="auto"
        cellRender={(rowData) => (
          <div
            style={{
              textAlign: "left",
              fontFamily: "sans-serif",
              cursor: "pointer",
            }}
            onClick={() => handleDescriptionCellClick(rowData)}
          >
            {rowData.data.description}
          </div>
        )}
        allowSorting={false}
      />
      <Column
        dataField="time"
        columnAutoWidth={true}
        cellRender={(rowData) => (
          <div style={{ textAlign: "center" }}>
            {rowData.data.time}
          </div>
        )}
        allowSorting={false}
      />
      <Column
        dataField="Action"
        caption="Status"
        resizable={true}
        columnAutoWidth={true}
        cellRender={(rowData) => (
          <div style={{ textAlign: "center" , color: '#000!important'}}>
              <DropDownButton status={rowData.data.status} clipId={rowData.data.id} />
          </div>
        )}
        width='auto'
        allowSorting={false}
      />
      <Popup
        visible={popupVisible}
        onHiding={() => setPopupVisible(false)}
        title="Row Details"
        width={400}
        height={300}
      >
        <Form formData={selectedRowData} readOnly={true}>
          <Item dataField="title" />
          <Item dataField="description" />
          <Item dataField="time" />
        </Form>
      </Popup>
    </DataGrid>

  );
};

export default Videoclips;
