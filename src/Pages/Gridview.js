import React from 'react';
import DataGrid, { Column, Selection, Paging, Pager } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import { customers } from './data.js';
import VideoPlayer from './videoplayer.js'; 
const App = () => {
    return (
        <DataGrid
            dataSource={customers}
            keyExpr="id"
            showBorders={true}
            focusedRowEnabled={true}
            defaultFocusedRowIndex={0}
            columnAutoWidth={true}
            columnHidingEnabled={true}
        >
            <Selection
                mode="multiple"
                selectAllMode="allPages"
                showCheckBoxesMode="always"
            />
            <Paging defaultPageSize={20} />
            <Pager
                showPageSizeSelector={true}
                showInfo={true}
                showNavigationButtons={true}
            />
            <Column
                dataField="video"
                caption="Video"
                cellRender={(rowData) => <VideoPlayer src={rowData.data.src} />} 
                resizable={true}
                width={470}
                />
            <Column
                dataField="description"
                resizable={true}
                wordWrapEnabled={true}
                width={500}
            />
            <Column
                dataField="time"
                resizable={true}
                columnAutoWidth={true}
            />
            <Column
                dataField="Action"
                resizable={true}
                columnAutoWidth={true}
            />
        </DataGrid>
    );
};

export default App;
