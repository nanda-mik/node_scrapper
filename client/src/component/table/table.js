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
import TablePagination from "@material-ui/core/TablePagination";

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

export default function App(){
    const classes = useStyles();
    const [rows, setState] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [redirect, setRedirect] = useState(false);

    useEffect(()=>{
      fetch('http://localhost:8080/getData',{
            method: 'GET'
        })
          .then(res => res.json())
          .then(data => setState(data))
    })

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

    let redir = null;
    if(redirect){
      redir = <Redirect to="/" />
    }

    return (
      <div className="table">
         <div className="btn-table"><Button variant="contained" color="primary" onClick={onSubmit}>Home</Button></div>
        <h2>Content Analysis- StartupTalky</h2>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Page URL</StyledTableCell>
                  <StyledTableCell align="right">Last modified</StyledTableCell>
                  <StyledTableCell align="right">Total WOrds</StyledTableCell>
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
                  <StyledTableCell align="right">Broken image</StyledTableCell>
                  <StyledTableCell align="right">404 external link</StyledTableCell>
                  <StyledTableCell align="right">Other article linking.</StyledTableCell>
                  <StyledTableCell align="right">Keyword in image alt name</StyledTableCell>
                  <StyledTableCell align="right">No of images</StyledTableCell>
                  <StyledTableCell align="right">Author anime</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <StyledTableRow key={row.url}>
                      <StyledTableCell component="th" scope="row">
                        {row.url}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.lastmod}</StyledTableCell>
                      <StyledTableCell align="right">{row.total_words}</StyledTableCell>
                      <StyledTableCell align="right">{row.keyword}</StyledTableCell>
                      <StyledTableCell align="right">{row.no_int_link}</StyledTableCell>
                      <StyledTableCell align="right">{row.no_doF_link}</StyledTableCell>
                      <StyledTableCell align="right">{row.no_noF_link}</StyledTableCell>
                      <StyledTableCell align="right">{row.isKeyPresent_para}</StyledTableCell>
                      <StyledTableCell align="right">{row.isKeyPresent_meta}</StyledTableCell>
                      <StyledTableCell align="right">{row.isKeyPresent_title}</StyledTableCell>
                      <StyledTableCell align="right">{row.title_length}</StyledTableCell>
                      <StyledTableCell align="right">{row.meta_length}</StyledTableCell>
                      <StyledTableCell align="right">{row.keyword_density}</StyledTableCell>
                      <StyledTableCell align="right">{row.no_of_tags}</StyledTableCell>
                      <StyledTableCell align="right">{row.no_of_brokeimg}</StyledTableCell>
                      <StyledTableCell align="right">{row.no_of_404}</StyledTableCell>
                      <StyledTableCell align="right">{row.no_other_link}</StyledTableCell>
                      <StyledTableCell align="right">{row.isKeyPresent_img}</StyledTableCell>
                      <StyledTableCell align="right">{row.no_of_img}</StyledTableCell>
                      <StyledTableCell align="right">{row.author}</StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 15, 20]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        {redir}
      </div>
      );
}