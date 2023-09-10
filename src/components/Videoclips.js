import React, { useState, useEffect, useRef } from "react";
import DataGrid, {
  Column,
  Selection,
  Paging,
  Pager,
  Item,
  LoadPanel,
  // Editing,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import VideoPlayer from "../Pages/videoplayer.js";
import DropDownButton from "../components/GridDropdown.js";
import { Popup } from "devextreme-react/popup";
import { Form } from "devextreme-react/form";
import { LuDownload } from "react-icons/lu";
import VideoDownload from "./VideoDownload.js";

const Videoclips = ({ videoClips, setVideoCount }) => {
  //eslint-disable-next-line
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const isDataLoadedRef = useRef(false); 
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDownloadClick = () => {
    setModalVisible(true); // Show the download modal
  };

  const handleDownloadComplete = () => {
    setModalVisible(false); // Hide the download modal when download is complete
  };

  // const handleDescriptionCellClick = (rowData) => {
  //   setSelectedRowData(rowData.data);
  //   setPopupVisible(true);
  // };

  //eslint-disable-next-line
  // const handleClosePopup = () => {
  //   setSelectedRowData(null);
  //   setPopupVisible(false);
  // };

  

  const dataSource = {
    store: videoClips,
    type: "array",
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

  return (<>
    {/* Download button */}
    {selectedRows.length > 0 && (
      <button
        className="fixed bottom-0 right-0 m-4 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 z-[9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999]"
        onClick={handleDownloadClick}
      ><LuDownload />
      </button>
    )}

    {/* Render the VideoDownload component when the modal is visible */}
    {modalVisible && (
      <VideoDownload
        selectedRows={selectedRows}
        onComplete={handleDownloadComplete}
      />
    )}

    <DataGrid
      dataSource={dataSource}
      showBorders={true}
      columnAutoWidth={true}
      showRowLines={true}
      onSelectionChanged={(e) => {
        setSelectedRows(e.selectedRowsData);
      }}
    >
      <LoadPanel enabled={false} />
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
        displayMode="compact"
      />
      <Column
        dataField="video"
        caption="Video"
        alignment='center'
        cssClass="Video"
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
        alignment='center'
        cssClass="Title"
        className="whitespace-break-spaces"
        width='auto'
        allowSorting={false}
      />
     <Column
        dataField="description"
        alignment='center'
        width="auto"
        cssClass="Description"
        cellRender={(rowData) => (
          <div
            style={{
              textAlign: "left",
              fontFamily: "sans-serif",
              cursor: "pointer",
            }}
          >
            {rowData.data.description}
          </div>
        )}
        allowSorting={false}
      />
      <Column
        dataField="time"
        alignment='center'
        caption="Duration"
        width={150}
        cssClass="Duration"
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
        alignment='center'
        cssClass="action"
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
  </>
  );
};

export default Videoclips;
