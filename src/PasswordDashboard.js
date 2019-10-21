import React from 'react';
import MaterialTable from 'material-table';
import Link from '@material-ui/core/Link';
import './App.css';
import Button from '@material-ui/core/Button';
import {CopyToClipboard} from 'react-copy-to-clipboard';

function domainCell(rowData) {
    return <Link color="inherit" href={rowData.domain} target="_blank" >{rowData.domain}</Link>;
}

function valueCell(value, showdecryptedText) {
    return (
        <div >
            <CopyToClipboard text={value} >
                <Button variant="contained" style={{textTransform: "none"}} >
                    {showdecryptedText? value : "Copy"}
                </Button>
            </CopyToClipboard>
        </div>
    );
}

function encryptData(props, rowData) {
    if (rowData.showdecryptedText) {
        rowData.userName = props.serverHandler.encryptAES(rowData.userName);
        rowData.password = props.serverHandler.encryptAES(rowData.password);
    } else {
        rowData.userName = props.serverHandler.decryptAES(rowData.userName);
        rowData.password = props.serverHandler.decryptAES(rowData.password);
    }
    rowData.showdecryptedText = !rowData.showdecryptedText;
    props.update({key:"updateDashboard", value:!props.updateDashboard}) 
}

function decryptCell(props, rowData) {
    if (rowData && rowData.showdecryptedText === true) {
        return (
            <div >
                <Button variant="contained" color="primary" onClick={(e) => encryptData(props, rowData)} >
                    Encrypt
                </Button>
            </div>
        );
    } else {
        return (
            <div >
                <Button variant="contained" color="secondary" onClick={(e) => encryptData(props, rowData)} >
                    Decrypt
                </Button>
            </div>
        );
    }
}

function createStruct(props) {
    return({
        columns: [
            { title: 'Domain',  field: 'domain', render: rowData => domainCell(rowData)},
            { title: 'User Name', field: 'userName', render: rowData => valueCell(rowData.userName, rowData.showdecryptedText) },
            { title: 'Password', field: 'password', render: rowData => valueCell(rowData.password, rowData.showdecryptedText) },
            { title: 'Comments', field: 'comment', },
            { title: 'Encrypt/Decrypt', render: rowData => decryptCell(props, rowData)},
        ],
        data: props.pmData,
    });
}

export default function PasswordDashboard(props) {
    const [state, setState] = React.useState(() => createStruct(props));
    return (
        <div className="dashboard-paper">
            {props.updateDashboard && <div></div>}
            <MaterialTable className="paper"
                title="All Passwords"
                columns={state.columns}
                data={state.data}
                editable={{
                    onRowAdd: newData =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                newData.showdecryptedText = true;
                                encryptData(props, newData)
                                const data = [...state.data];
                                data.push(newData);
                                setState({ ...state, data });
                                props.serverHandler.insert(newData);
                            }, 100);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                newData.showdecryptedText = true;
                                encryptData(props, newData)
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
