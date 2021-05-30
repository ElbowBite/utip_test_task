import NewCommentForm from '../../components/NewCommentForm';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

export interface CommentProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginBottom: '5px',
    },
  })
);

const Comment: React.FC<CommentProps> = () => {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h4" className={classes.header}>
        Comment
      </Typography>
      <NewCommentForm />
    </div>
  );
};

export default Comment;
