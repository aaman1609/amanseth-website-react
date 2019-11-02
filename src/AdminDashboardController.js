import React from 'react';
import MaterialTable from 'material-table';
import './App.css';
import ReactTimeAgo from 'react-time-ago'


function lastLoginCell(rowData) {
    return (
        <div>
            <ReactTimeAgo date={new Date(rowData.lastLogin)} />
        </div>
    );
}

function createStruct(props) {
    return({
        columns: [
            { title: 'Mobile Number', field: 'mobile', },
            { title: 'Last login', field: 'lastLogin', render: rowData => lastLoginCell(rowData)},
        ],
        data: props.adminData,
    });
}

export default function AdminDashboardController(props) {
    const [state, setState] = React.useState(() => createStruct(props));
    return (
        <div className="dashboard-grid">
            {props.updateDashboard && <div></div>}
            <MaterialTable
                options={{
                    maxBodyHeight: "70vh",
                    pageSize:10,
                    pageSizeOptions: [0],
                  }}
                title="All Passwords"
                columns={state.columns}
                data={state.data}
                editable={{
                    onRowDelete: oldData =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                const data = [...state.data];
                                data.splice(data.indexOf(oldData), 1);
                                setState({ ...state, data });
                                props.serverHandler.deleteUser(oldData);
                            }, 100);
                        }),
                }}
            />
        </div>
    );
}
