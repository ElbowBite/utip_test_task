import React, { useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Comment } from '../../store';
import { useStore } from '../../store/storeContext';
import { observer } from 'mobx-react-lite';

export interface HomeProps {}

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
  commentCell: {
    flexGrow: 1,
  },
});

const Home: React.FC<HomeProps> = () => {
  const classes = useStyles();

  const store = useStore();
  if (!store) throw Error("Store shouldn't be null");

  useEffect(() => {
    store.fetchComments();
  }, [store]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell className={classes.commentCell}>Comment</TableCell>
              <TableCell>Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {store.comments.map((c: Comment) => (
              <TableRow key={c.id}>
                <TableCell>{c.email}</TableCell>
                <TableCell className={classes.commentCell}>{c.text}</TableCell>
                <TableCell>{c.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default observer(Home);
