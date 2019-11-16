import React from 'react';
import MaterialTable from 'material-table';
import Link from '@material-ui/core/Link';
import './App.css';
import Button from '@material-ui/core/Button';
import {CopyToClipboard} from 'react-copy-to-clipboard';

function domainCell(rowData) {
    return <Link color="inherit" href={rowData.domain} target="_blank" >{rowData.domain}</Link>;
}

function userNameValueCell(props, rowData) {
    rowData.decryptedUserName = props.encryptionManager.decryptAES(rowData.userName);
    return (
        <div >
            <CopyToClipboard text={rowData.decryptedUserName} >
                <Button variant="contained" style={{textTransform: "none"}} >
                    {rowData.showdecryptedText? rowData.decryptedUserName : "Copy"}
                </Button>
            </CopyToClipboard>
        </div>
    );
}

function passwordValueCell(props, rowData) {
    rowData.decryptedPassword = props.encryptionManager.decryptAES(rowData.password);
    return (
        <div >
            <CopyToClipboard text={rowData.decryptedPassword} >
                <Button variant="contained" style={{textTransform: "none"}} >
                    {rowData.showdecryptedText? rowData.decryptedPassword : "Copy"}
                </Button>
            </CopyToClipboard>
        </div>
    );
}

function showData(props, rowData) {
    if (rowData) {
        rowData.showdecryptedText = !rowData.showdecryptedText;
        props.update({ key: "updateDashboard", value: !props.updateDashboard })
    }
}

function decryptCell(props, rowData) {
    if (rowData && rowData.showdecryptedText === true) {
        return (
            <div >
                <Button variant="contained" color="primary" onClick={(e) => showData(props, rowData)} >
                    Hide
                </Button>
            </div>
        );
    } else {
        return (
            <div >
                <Button variant="contained" color="secondary" onClick={(e) => showData(props, rowData)} >
                    Show
                </Button>
            </div>
        );
    }
}

function createStruct(props) {
    return({
        columns: [
            { title: 'Domain',  field: 'domain', render: rowData => domainCell(rowData)},
            { title: 'User Name', field: 'decryptedUserName', render: rowData => userNameValueCell(props, rowData) },
            { title: 'Password', field: 'decryptedPassword', render: rowData => passwordValueCell(props, rowData) },
            { title: 'Comments', field: 'comment', },
            { title: 'Show/Hide', render: rowData => decryptCell(props, rowData)},
        ],
        data: props.pmData,
    });
}

export default function PasswordDashboardController(props) {
    const [state, setState] = React.useState(() => createStruct(props));
    return (
        <div className="dashboard-grid">
            {props.updateDashboard && <div></div>}
            <MaterialTable
                options={{
                    maxBodyHeight: "60vh",
                    pageSize:10,
                    pageSizeOptions: [0],
                  }}
                title="All Passwords"
                columns={state.columns}
                data={state.data}
                editable={{
                    onRowAdd: newData =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                if (newData.domain && newData.decryptedUserName && newData.decryptedPassword) {
                                    if (!newData.comment) {
                                        newData.comment = "";
                                    }
                                    newData.userName = props.encryptionManager.encryptAES(newData.decryptedUserName);
                                    newData.password = props.encryptionManager.encryptAES(newData.decryptedPassword);
                                    newData.showdecryptedText = true;
                                    showData(props, newData)
                                    const data = [...state.data];
                                    data.push(newData);
                                    setState({ ...state, data });
                                    props.serverHandler.insert(newData);
                                }

                            }, 100);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                newData.userName = props.encryptionManager.encryptAES(newData.decryptedUserName);
                                newData.password = props.encryptionManager.encryptAES(newData.decryptedPassword);
                                newData.showdecryptedText = true;
                                showData(props, newData)
                                const data = [...state.data];
                                data[data.indexOf(oldData)] = newData;
                                setState({ ...state, data });
                                props.serverHandler.update(newData);
                            }, 100);
                        }),
                    onRowDelete: oldData =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                const data = [...state.data];
                                data.splice(data.indexOf(oldData), 1);
                                setState({ ...state, data });
                                props.serverHandler.delete(oldData);
                            }, 100);
                        }),
                }}
            />
        </div>
    );
}
