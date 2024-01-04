/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DataGrid, {
  Column,
  Selection,
  Paging,
  Pager,
  LoadPanel,
  Editing,
} from "devextreme-react/data-grid";
import { Button } from 'devextreme-react/button';
import "devextreme/dist/css/dx.light.css";
import 'devextreme-react/text-area';
import { Popup } from "devextreme-react/popup";
import Form, { Item, GroupItem, Label } from 'devextreme-react/form';
import TextArea from 'devextreme-react/text-area';
import { MainVideo } from './Data/data.js';
import { TokenManager } from '../../Config/Token/getToken.js';
import axios from 'axios';
import qs from 'qs';
// import VideoPlayer from '../Pages/videoplayer.js';
import CloudinaryVideoPlayer from "../../VideoPlayer/cloudinaryVideoPlayer.js";

const Mainvideo = ({newmainClips}) => {
  // eslint-disable-next-line no-unused-vars
  const userToken = TokenManager.getToken()[1];
  const [mainVideo, setMainVideo] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const { projectId: routeProjectId } = useParams();
  const [newData, setNewData] = useState(null);

  return (
    <div>
      <DataGrid
        dataSource={newmainClips || newData}
        keyExpr="id"
        width='auto'
        showBorders={true}
        columnAutoWidth={true}
        showRowLines={true}
        showColumnLines={true}
        sorting={{ mode: 'none' }}
        onCellDblClick={(e) => {
          if (e.column.dataField === "description") {
            console.log(e.data, "e.data");
            setSelectedRowData(e.data);
            setPopupVisible(true);
          }
        }}
      >
        <Editing
          mode="cell"
          allowUpdating={true}
          allowAdding={false}
          allowDeleting={false} />
        <Column
          dataField="video"
          caption="Video"
          alignment='center'
          cssClass='Video'
          cellRender={(rowData) => 
             <CloudinaryVideoPlayer src={rowData.data.src} title={rowData.data.title} type={rowData.data.type} setMainVideo={mainVideo} />
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
          width='min-content'
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
      {/* <Popup
      visible={popupVisible}
      onHiding={() => setPopupVisible(false)}
      hideOnOutsideClick={true}
      showCloseButton={true}
      title="Description"
      resizeEnabled={true}
      width={'auto'}
      height={'auto'}
      style={{
        padding: "20px",
      }}
      // container={".dx-viewport .dx-viewport"}
    >
      <TextArea
        value={selectedRowData?.description}
        defaultValue={selectedRowData?.description}
        // inputAttr={{ maxLength: 500 }}
        autoResizeEnabled={true}
        // height={'200'}
        valueChangeEvent="keyup"
        stylingMode="outlined"
        width={600}
        minHeight={150}
        maxHeight={200}
        hoverStateEnabled={true}
        placeholder="Enter Description"
        container="text-black"
        onChange={(e) => {
          console.log(e.event.target.value, "e.event.target.value");
          setSelectedRowData({
            ...selectedRowData,
            description: e.event.target.value,
          });
        }}
        cellRender = {(rowData) => (
          <div style={{ textAlign: "left"}}>
            {rowData.data.description}
          </div>
        )}
      />
      <div style={{ textAlign: "right", marginTop: "10px" }}>
      <Button
        text="Save"
        type="success"
        stylingMode="contained"
        position="right"
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
            console.log(response.data,'success');
            setNewData(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
          setPopupVisible(false);
        }}
        style={{ marginTop: "10px" }}
      />
      </div>
    </Popup> */}
    </div>
  );
};

export default Mainvideo;
