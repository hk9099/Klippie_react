import React, { useState, useRef, useEffect } from "react";
import { useParams } from 'react-router-dom';
import DataGrid, {
  Column,
  Selection,
  Paging,
  Pager,
  LoadPanel,
  // Editing,
} from "devextreme-react/data-grid";
import { Button } from 'devextreme-react/button';
import "devextreme/dist/css/dx.light.css";
import 'devextreme-react/text-area';
import VideoPlayer from "../Pages/videoplayer.js";
import DropDownButton from "../components/GridDropdown.js";
import { Popup } from "devextreme-react/popup";
import Form, { Item, GroupItem, Label } from 'devextreme-react/form';
import TextArea from 'devextreme-react/text-area';
import { useFileSelected } from "../context/SelectionContext.js";
import CloudinaryVideoPlayer from "../components/cloudinaryVideoPlayer.js";
// import { LuDownload } from "react-icons/lu";
// import VideoDownload from "./VideoDownload.js";
import { TokenManager } from '../components/getToken.js';
import axios from 'axios';
import qs from 'qs';

const Videoclips = ({ videoClips, setVideoCount }) => {
  const { projectId: routeProjectId } = useParams();
  console.log(routeProjectId, "routeProjectId");
  const { setFileselected, setFileselecteddata } = useFileSelected();
  const userToken = TokenManager.getToken()[1];
  //eslint-disable-next-line
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [isPopupVisible, setPopupVisibility] = useState(true);
  const togglePopup = () => {
    setPopupVisibility(!isPopupVisible);
  };
  const isDataLoadedRef = useRef(false);




  useEffect(() => {
    setVideoCount(videoClips.length);

    if (!isDataLoadedRef.current && videoClips.length > 0) {
      isDataLoadedRef.current = true;
    }
  }, [videoClips, setVideoCount]);
  console.log(videoClips, "videoClips");
  return (<>
    <DataGrid
      dataSource={videoClips}
      showBorders={true}
      columnAutoWidth={true}
      width={"100%"}
      height={videoClips.length > 0 ? "100%" : "30vh"}
      showRowLines={true}
      onSelectionChanged={(e) => {
        if (e.selectedRowsData.length > 0) {
          setFileselected(true);
          setFileselecteddata(e.selectedRowsData);
        } else {
          setFileselected(false);
          setFileselecteddata([]);
        }
      }}
      onCellClick={(e) => {
        if (e.column.dataField === "description") {
          console.log(e.data, "e.data");
          setSelectedRowData(e.data);
          setPopupVisible(true);
        }
      }}
    >
      <LoadPanel enabled={false} />
      <Selection
        mode="multiple"
        selectAllMode="allPages"
        showCheckBoxesMode="always"
      />
      <Paging defaultPageSize={3}
      />
      <Pager
        showPageSizeSelector={true}
        showInfo={true}
        showNavigationButtons={true}
        visible={videoClips.length > 0 ? true : false}
        displayMode="compact"
      />
      <Column
        dataField="video"
        caption="Video"
        alignment='center'
        cssClass="Video"
        cellRender={(rowData) =>
          // <VideoPlayer src={rowData.data?.src ? rowData.data.src : ""} title={rowData.data?.title ? rowData.data.title : ""} type={rowData.data?.type ? rowData.data.type : ""} publicId={rowData.data?.publicId ? rowData.data.publicId : ""} startTime={rowData.data?.start_time ? rowData.data.start_time : ""} endTime={rowData.data?.end_time ? rowData.data.end_time : ""} clipId={rowData.data?.id ? rowData.data.id : ""} />
          <CloudinaryVideoPlayer src={rowData.data?.src ? rowData.data.src : ""} title={rowData.data?.title ? rowData.data.title : ""} type={rowData.data?.type ? rowData.data.type : ""} publicId={rowData.data?.publicId ? rowData.data.publicId : ""} startTime={rowData.data?.start_time ? rowData.data.start_time : ""} endTime={rowData.data?.end_time ? rowData.data.end_time : ""} clipId={rowData.data?.id ? rowData.data.id : ""} />
        }
        width={415}
        allowSorting={false}
      />
      <Column
        dataField="title"
        alignment='center'
        cssClass="Title"
        className="whitespace-break-spaces"
        width='auto'
        allowSorting={false}
        cellRender={(rowData) => (
          <div
            style={{
              textAlign: "left",
              fontFamily: "sans-serif",
              cursor: "pointer",
            }}
          >
            {rowData.data.title}
          </div>
        )}
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
        allowEditing={true}
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
          <div style={{ textAlign: "center", color: '#000!important' }}>
            <DropDownButton status={rowData.data.status} clipId={rowData.data.id} />
          </div>
        )}
        width='auto'
        allowSorting={false}
      />
    </DataGrid>
    <Popup
      visible={popupVisible}
      onHiding={() => setPopupVisible(false)}
      hideOnOutsideClick={true}
      showCloseButton={true}
      title="Description"
      resizeEnabled={true}
      width={500}
      height={'auto'}
      style={{
        padding: "20px",
      }}
    >
      <TextArea
        value={selectedRowData?.description}
        defaultValue={selectedRowData?.description}
        // inputAttr={{ maxLength: 500 }}
        autoResizeEnabled={true}
        height={'200'}
        valueChangeEvent="keyup"
        stylingMode="outlined"
        hoverStateEnabled={true}
        placeholder="Enter Description"
        style={{ padding: "0px" }}
        onChange={(e) => {
          console.log(e.event.target.value, "e.event.target.value");
          setSelectedRowData({
            ...selectedRowData,
            description: e.event.target.value,
          });
        }}
      />
      <Button
        text="Save"
        type="success"
        stylingMode="contained"
        onClick={() => {
          console.log(selectedRowData, "selectedRowData");
          let data = qs.stringify({
            'id': routeProjectId,
            'description': selectedRowData?.description,
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev-api.getklippie.com/v1/project/update',
            headers: { 
              'accept': 'application/json', 
              'Content-Type': 'application/x-www-form-urlencoded', 
              'Authorization': 'Bearer '+userToken
            },
            data : data
          };
          
          axios.request(config)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
          setPopupVisible(false);
        }}
        style={{ marginTop: "10px" }}
      />
    </Popup>
  </>
  );
};

export default Videoclips;
