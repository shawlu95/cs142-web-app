import green from '@material-ui/core/colors/green';

const styles = {
  root: {
    width: '100%',
    maxWidth: 360,
  },
  margin: {
    marginLeft: 100, // not useful
  },
  fab: {
    position: 'relative',
    margin: "1rem",
    maxWidth:10,
    maxHeight:10,
  },
  commentBadge: {
    align: "right",
    backgroundColor: "secondary",
    marginRight: "5px"
  },
  photoBadge: {
    backgroundColor: green[700],
    color: "white",
    marginRight: "5px"
  },
  advanceFeature: {
    marginLeft: "7px"
  },
  link: {
    textDecoration: 'none',
  },
  linkText: {
    marginLeft: 10,
    minWidth: '100px',
  },
  linkBadge: {
    textDecoration: 'none',
  }
};

export {styles};
