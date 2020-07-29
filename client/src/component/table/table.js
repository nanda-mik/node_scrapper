import React, { useEffect, useState } from 'react';
import './table.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router';
import TablePagination from "@material-ui/core/TablePagination";
import Popup from "reactjs-popup";
import Axios from 'axios';
import Spinner from '../Spinner/Spinner';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 600
  }
});

export default function App() {
  const classes = useStyles();
  const [rows, setState] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [redirect, setRedirect] = useState(false);
  const [editing, setEdit] = useState(false);
  const [key, setKey] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [toPage, setClick1] = useState(false);

  let { id } = useParams();
  id = id.slice(1);
  useEffect(() => {
    const cachedResult = sessionStorage.getItem(id);
    if (cachedResult) {
      setState(JSON.parse(cachedResult));
    } else {
      setLoading(true);
      fetch('http://localhost:8080/getData/' + id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId')
        })
      })
        .then(res => res.json())
        .then(data => {
          onSetResult(data, id)
          setLoading(false);
        })

    }
  }, [])


  const onSetResult = (result, key) => {
    sessionStorage.setItem(key, JSON.stringify(result));
    setState(result);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onSubmit = () => {
    setRedirect(true);
  }

  const onClick1 = () => {
    setClick1(true);
  }


  const onEdit = () => {
    setEdit(true);
  }

  const onSave = (e) => {
    setKey(e.target.value);
  }

  const onFinal = async (id) => {
    const url = "http://localhost:8080/editKey/" + id;
    const result = await Axios.post(url, { keyword: key });
    console.log(result);
    sessionStorage.clear();
  }

  let redir = null;
  if (redirect) {
    redir = <Redirect to="/" />
  }

  if (toPage) {
    redir = <Redirect to={"/page/:" + id} />
  }

  return (
    <div className="table">
      <div class="btn-list">
        <div className="btn-table"><Button variant="contained" color="primary" onClick={onSubmit}>Home</Button></div>
        <div className="btn-table"><Button variant="contained" color="primary" onClick={onClick1}>Page Wise tasks</Button></div>
      </div>
      <h2>Content Analysis</h2>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Page URL</StyledTableCell>
                <StyledTableCell align="right">Last modified</StyledTableCell>
                <StyledTableCell align="right">Total Words</StyledTableCell>
                <StyledTableCell align="right">Keywords</StyledTableCell>
                <StyledTableCell align="right">No of int. links</StyledTableCell>
                <StyledTableCell align="right">No of do-follow ext. link</StyledTableCell>
                <StyledTableCell align="right">No of no-follow ext. link</StyledTableCell>
                <StyledTableCell align="right">Keyword in 1st para</StyledTableCell>
                <StyledTableCell align="right">Keyword in meta</StyledTableCell>
                <StyledTableCell align="right">Keyword in title</StyledTableCell>
                <StyledTableCell align="right">Title length</StyledTableCell>
                <StyledTableCell align="right">Meta length</StyledTableCell>
                <StyledTableCell align="right">Keyword density</StyledTableCell>
                <StyledTableCell align="right">No of tags</StyledTableCell>
                <StyledTableCell align="right">404 External Links</StyledTableCell>
                <StyledTableCell align="right">Other article linking.</StyledTableCell>
                <StyledTableCell align="right">Keyword in image alt name</StyledTableCell>
                <StyledTableCell align="right">No of images</StyledTableCell>
                <StyledTableCell align="right">Fb share</StyledTableCell>
                <StyledTableCell align="right">Author anime</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row">
                      {row.url}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.lastmod}</StyledTableCell>
                    <StyledTableCell align="right">{row.total_words}</StyledTableCell>
                    <StyledTableCell align="right">{editing ? (<input type="text" defaultValue={row.keywordArr[row.keywordArr_length - 1]} onChange={onSave}></input>) : (<span>{row.keywordArr[row.keywordArr_length - 1]}</span>)}{editing ? <Button onClick={() => onFinal(row._id)}>Save</Button> : <Button onClick={() => onEdit()}>Edit</Button>}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Popup trigger={<button>{row.no_int_link}</button>} modal>
                        {close => (
                          <div className="modal">
                            <a className="close" onClick={close}>
                              &times;
                            </a>
                            <div className="content">
                              {row.int_link}
                            </div>
                          </div>
                        )}
                      </Popup>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Popup trigger={<button>{row.no_doF_link}</button>} modal>
                        {close => (
                          <div className="modal">
                            <a className="close" onClick={close}>
                              &times;
                            </a>
                            <div className="content">
                              {row.dF_ext_link}
                            </div>
                          </div>
                        )}
                      </Popup>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Popup trigger={<button>{row.no_noF_link}</button>} modal>
                        {close => (
                          <div className="modal">
                            <a className="close" onClick={close}>
                              &times;
                            </a>
                            <div className="content">
                              {row.nf_ext_link}
                            </div>
                          </div>
                        )}
                      </Popup>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.isKeyPresent_para}</StyledTableCell>
                    <StyledTableCell align="right">{row.isKeyPresent_meta}</StyledTableCell>
                    <StyledTableCell align="right">{row.isKeyPresent_title}</StyledTableCell>
                    <StyledTableCell align="right">{row.title_length}</StyledTableCell>
                    <StyledTableCell align="right">{row.meta_length}</StyledTableCell>
                    <StyledTableCell align="right">{row.keyword_density}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Popup trigger={<button>{row.no_of_tags}</button>} modal>
                        {close => (
                          <div className="modal">
                            <a className="close" onClick={close}>
                              &times;
                            </a>
                            <div className="content">
                              {row.tag_array}
                            </div>
                          </div>
                        )}
                      </Popup>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Popup trigger={<button>{row.no_of_brokelink}</button>} modal>
                        {close => (
                          <div className="modal">
                            <a className="close" onClick={close}>
                              &times;
                            </a>
                            <div className="content">
                              {row.broken_link}
                            </div>
                          </div>
                        )}
                      </Popup>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Popup trigger={<button>{row.no_other_link}</button>} modal>
                        {close => (
                          <div className="modal">
                            <a className="close" onClick={close}>
                              &times;
                            </a>
                            <div className="content">
                              {row.other_linkArticle}
                            </div>
                          </div>
                        )}
                      </Popup>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.isKeyPresent_img}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Popup trigger={<button>{row.no_of_img}</button>} modal>
                        {close => (
                          <div className="modal">
                            <a className="close" onClick={close}>
                              &times;
                            </a>
                            <div className="content">
                              {row.img_array}
                            </div>
                          </div>
                        )}
                      </Popup>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.fb_share}</StyledTableCell>
                    <StyledTableCell align="right">{row.author}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {loading ? <Spinner /> : null}
      {redir}
    </div>
  );
}
