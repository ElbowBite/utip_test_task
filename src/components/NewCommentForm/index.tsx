import React, { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import countries from '../../helpers/countries.json';

import { useStore } from '../../store/storeContext';
import { useHistory } from 'react-router';

interface Country {
  name: string;
  code: string;
}

const buttonSpinnerSize = 24;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      marginBottom: '22px',
    },
    inputInvalid: {
      width: '100%',
    },
    buttonWrapper: {
      position: 'relative',
    },
    buttonProgress: {
      position: 'absolute',
      left: `calc(50% - ${buttonSpinnerSize / 2}px)`,
      top: `calc(50% - ${buttonSpinnerSize / 2}px)`,
    },
  })
);

const NewCommentForm = () => {
  const store = useStore();
  if (!store) throw Error("Store shouldn't be null");

  let history = useHistory();

  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [country, setCountry] = useState('');

  const classes = useStyles();

  const handleEmailChange = (email: string) => {
    setEmail(email);
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmailValid(regex.test(email));
  };

  const handleButtonClick = async () => {
    setLoading(true);
    await store.addComment(commentText, email, country);
    setLoading(false);
    history.push('/');
  };

  return (
    <form noValidate autoComplete="off" className={classes.form}>
      <TextField
        id="email"
        label="email"
        variant="outlined"
        className={emailValid ? classes.input : classes.inputInvalid}
        value={email}
        error={!emailValid}
        helperText={!emailValid && 'Invalid email.'}
        onChange={(e) => handleEmailChange(e.target.value)}
        autoFocus
      />
      <TextField id="commentText" label="Comment text" variant="outlined" className={classes.input} value={commentText} onChange={(e) => setCommentText(e.target.value)} />
      <Autocomplete
        id="countries"
        className={classes.input}
        options={countries as Country[]}
        getOptionLabel={(option: Country) => option.name}
        onChange={(e: any, newValue: Country | null) => setCountry(newValue ? newValue.name : '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a country"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
            }}
          />
        )}
        renderOption={(option: Country) => <>{option.name}</>}
      />
      <div className={classes.buttonWrapper}>
        <Button variant="outlined" disabled={loading} onClick={() => handleButtonClick()}>
          Add comment
        </Button>
        {loading && <CircularProgress size={buttonSpinnerSize} className={classes.buttonProgress} />}
      </div>
    </form>
  );
};

export default NewCommentForm;
