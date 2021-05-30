import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DescriptionIcon from '@material-ui/icons/Description';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Document } from '../../store';
import { useStore } from '../../store/storeContext';
import { Modal } from '@material-ui/core';

export interface DocumentsProps {}

const deleteSpinnerSize = 24;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
    },
    fileNameCell: {
      display: 'flex',
      alignItems: 'center',
    },
    fileNameText: {
      marginLeft: '5px',
    },
    table: {
      minWidth: 300,
    },
    deleteWrapper: {
      position: 'relative',
    },
    deleteSpinner: {
      position: 'absolute',
      left: `calc(50% - ${deleteSpinnerSize / 2}px)`,
      top: `calc(50% - ${deleteSpinnerSize / 2}px)`,
    },
    inputButton: {
      marginTop: '10px',
    },
    modal: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '500px',
      height: '250px',
      left: 'calc(50% - 250px)',
      top: 'calc(50% - 125px)',
    },
    modalInner: {
      display: 'flex',
      flexDirection: 'column',
    },
    modalInnerButtonContainer: {
      display: 'flex',
      marginTop: '10px',
      justifyContent: 'space-around',
    },
  })
);

const Documents: React.FC<DocumentsProps> = () => {
  const classes = useStyles();

  const store = useStore();
  if (!store) throw Error("Store shouldn't be null");

  useEffect(() => {
    store.fetchDocuments();
  }, [store]);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBody, setModalBody] = useState(<div />);

  const handleDeleteClick = (id: number) => {
    setModalBody(
      <div className={classes.modalInner}>
        <Typography variant="h6">Are you sure you want to delete this document?</Typography>
        <div className={classes.modalInnerButtonContainer}>
          <Button variant="outlined" color="primary" onClick={() => handleDeleteAccept(id)}>
            Accept
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleCloseModal()}>
            Decline
          </Button>
        </div>
      </div>
    );
    openModal();
  };

  const handleDeleteAccept = async (id: number) => {
    setLoading(true);
    handleCloseModal();
    await store.removeDocument(id);
    setLoading(false);
  };

  const handleDeleteAllClick = () => {
    setModalBody(
      <div className={classes.modalInner}>
        <Typography variant="h6">Are you sure you want to delete all documents?</Typography>
        <div className={classes.modalInnerButtonContainer}>
          <Button variant="outlined" color="primary" onClick={() => handleDeleteAllAccept()}>
            Accept
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleCloseModal()}>
            Decline
          </Button>
        </div>
      </div>
    );
    openModal();
  };

  const handleDeleteAllAccept = async () => {
    setLoading(true);
    handleCloseModal();
    await store.clearDocuments();
    setLoading(false);
  };

  const handleFileUpload = async (e: any) => {
    const uploadedFile = e.target.files[0].name;
    await store.addDocument(uploadedFile).then(() => {
      setModalOpen(true);
      // @ts-ignore
      document.getElementById('fileInput').value = '';
    });
    setModalBody(
      <div className={classes.modalInner}>
        <Typography variant="h6">Your file was succesfully uploaded!</Typography>
        <div className={classes.modalInnerButtonContainer}>
          <Button variant="outlined" color="primary" onClick={() => handleCloseModal()}>
            👍
          </Button>
        </div>
      </div>
    );
    openModal();
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Typography variant="h4" className={classes.header}>
        Documents
        <Button color="secondary" disabled={loading} onClick={() => handleDeleteAllClick()}>
          Delete all
          <DeleteForeverIcon />
          {loading && <CircularProgress size={deleteSpinnerSize} color="secondary" className={classes.deleteSpinner} />}
        </Button>
      </Typography>

      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Document</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {store.documents.map((d: Document) => (
              <TableRow key={d.id}>
                <TableCell>
                  <div className={classes.fileNameCell}>
                    <DescriptionIcon />
                    <div className={classes.fileNameText}>{d.fileName}</div>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <div className={classes.deleteWrapper}>
                    <Button color="secondary" disabled={loading} onClick={() => handleDeleteClick(d.id)}>
                      <DeleteForeverIcon />
                      {loading && <CircularProgress size={deleteSpinnerSize} color="secondary" className={classes.deleteSpinner} />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper elevation={3} className={classes.modal}>
          {modalBody}
        </Paper>
      </Modal>
      <Button variant="contained" component="label" className={classes.inputButton}>
        Upload File
        <input id="fileInput" type="file" hidden accept="image/jpg,.pdf" onChange={handleFileUpload} />
      </Button>
    </>
  );
};

export default observer(Documents);
