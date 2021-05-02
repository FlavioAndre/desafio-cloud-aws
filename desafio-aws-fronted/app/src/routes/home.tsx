import React, { useContext, useEffect, useState } from 'react'
import clsx from 'clsx';
import { useHistory } from 'react-router-dom'

import {  createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Alert } from '@material-ui/lab'
import { Snackbar } from '@material-ui/core'
import { DropzoneDialog } from 'material-ui-dropzone'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DeleteIcon from '@material-ui/icons/Delete'
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloudUpload from '@material-ui/icons/CloudUpload';
import MailIcon from '@material-ui/icons/Mail';
import ExitToApp from '@material-ui/icons/ExitToApp';
import SwapVert from '@material-ui/icons/SwapVert';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import GitHubIcon from '@material-ui/icons/GitHub'
import Link from '@material-ui/core/Link'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import DesafioAwsService from '../services/desafioAwsService'
import { AuthContext } from '../contexts/authContext'
import { FileS3 } from './files/types'
import FileSaver from 'file-saver'
import { format } from 'date-fns-tz'


const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    title: {
      flexGrow: 1,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);


export default function Home() {
  const [filesS3, setFilesS3] = useState<FileS3[]>([])

  const [openDrawer, setOpenDrawer] = React.useState(false)

  const [processing, setProcessing] = React.useState(false)

  const classes = useStyles()

  const history = useHistory()

  const auth = useContext(AuthContext)

  const [showMessageShow, setShowMessageShow] = React.useState(false);
  
  const [messageShow, setMessageShow] = React.useState("");
  
  const [severityShow, setSeverityShow] = React.useState();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = Boolean(anchorEl);

  const [open, setOpen] = React.useState(false);

  const theme = useTheme();

  const [stack, setStack] = React.useState<string[]>([]);

  const [nextToken, setNextToken] = React.useState("");
  
  const [prevToken, setPrevToken] = React.useState("");

  const [isNextToken, setIsNextToken] = React.useState(false);

  const [isFirst, setIsFirst] =  React.useState(true);


  function signOutClicked() {
    auth.signOut()
    window.localStorage.clear()
    setFilesS3([])
    history.push('/')
  }

  function changePasswordClicked() {
    history.push('changepassword')
  }

  const init = () => {
    if (window.localStorage.getItem('accessToken')) {
      startProgress();
      setIsNextToken(false);
      setNextToken("");
      setFilesS3([]);
      loadFiles();
    }
  }

  useEffect(() => {
    setTimeout(init, 1000);
  }, [])

  const stopProgress = () => {
    setProcessing(false)
  }

  const startProgress = () => {
    setProcessing(!processing)
  }

  const formatDate = (dateToFormat: any) => {
    const dateIso = new Date(dateToFormat)
    return format(dateIso, 'dd/MM/yyyy HH:mm', {
      timeZone: 'America/Sao_Paulo',
    })
  }

  const formatNameFile = (file: any) => {
    const result = file.split('/')
    const nameFile = result[1]
    return nameFile
  }

  const downLoadFile = (file: any) => {
    startProgress()
    DesafioAwsService.download(file)
      .then((response) => {
        const bb = new Blob([response.data])
        FileSaver.saveAs(bb, file)
      })
      .catch((e) => {
        showMessage("Error na chamada da Api.", severityError);
         console.log(e)
      }).finally(() => stopProgress());
  }


  const deleteFile = (file: any) => {
    if (!window.confirm(`Confirma a exclusão do arquivo ${file}`)) return; 

    startProgress()
    DesafioAwsService.deleteFile(file)
      .then((response) => {
        showMessage("Arquivo excluído com sucesso!", severitySuccess);
        loadFiles();
        console.log(response);
      })
      .catch((e) => {
        showMessage("Error na chamada da Api.", severityError);
        console.log(e);
      }).finally(() => stopProgress());
  }

  const validateIsFirst = () => {
    if(sizeStack() === 0) return true;
    return false;
  }


  const loadFiles = (nextContinuationToken?: any, isBack?: boolean) => {
    startProgress();
    DesafioAwsService.getFiles(nextContinuationToken)
      .then((response) => {
        if(response.data) {
          setPrevToken(nextToken);
          setIsNextToken(response.data.isTruncated);
          if(response.data.isTruncated) {
            setIsFirst(validateIsFirst());
            if(!isBack) stack.push(nextContinuationToken);
            setNextToken(response.data.nextContinuationToken);
          }
          console.log('nextContinuationToken: ', response.data.nextContinuationToken);
          setFilesS3(response.data.files)
        }
        
      })
      .catch((e) => {
        showMessage("Error na chamada da Api.", severityError);
        console.log(e)
      })
      .finally(() => stopProgress())
  }

  const severitySuccess = "success";
  const severityError = "error";
  const requestInteration = () => {
    startProgress();
    const email = auth.attrInfo[4].Value;
    DesafioAwsService.requestInteration(email)
      .then((response) => {
        showMessage(response.data, severitySuccess);
        console.log(response.data)
      })
      .catch((e) => {
        showMessage("Error na chamada da Api.", severityError);
        console.log(e)
      })
      .finally(() => stopProgress())
  }
  
  const handleClose = () => {
    setShowMessageShow(false);
  };

  const showMessage = (message: any, severity: any) => {
    setMessageShow(message);
    setSeverityShow(severity);
    setShowMessageShow(true);
  };

  const isLogIn = () => {
    return auth.authStatus === 1;
  };

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const showUpload = () => {
    setOpen(true);
  }

  const proximo = () => {
    loadFiles(nextToken, false);
  }

  const anterior = () => {
    let currentToken = stack.pop();
    if(currentToken === prevToken) currentToken = stack.pop();
    loadFiles(currentToken, sizeStack() > 0);
  }
  
  const sizeStack = () => {
    return stack.length;
  }

  return (
    <div className={classes.root}>
    <CssBaseline />
    <AppBar  position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}>
    <Toolbar >
    <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: openDrawer,
            })}
          >
            <MenuIcon />
          </IconButton>
    
    <Typography variant="h6" className={classes.title} >
    Bootcamp Cloud AWS
    </Typography>
    {isLogIn() && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openMenu}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={changePasswordClicked}>Alterar Senha</MenuItem>
                <hr/>
                <MenuItem onClick={signOutClicked}>Logout</MenuItem>                
              </Menu>
            </div>
          )}
  </Toolbar>
</AppBar>
    <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openDrawer,
          [classes.drawerClose]: !openDrawer,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />

        <ListItem button key='Enviar Auditoria' onClick={requestInteration}>
          <Tooltip title="Enviar Lista de Atividades">
            <ListItemIcon><MailIcon /></ListItemIcon>
          </Tooltip>  
          <ListItemText primary='Lista de Atividades' />
        </ListItem>
        <ListItem button key='Upload' onClick={showUpload}>
          <Tooltip title="Upload Arquivo">
            <ListItemIcon><CloudUpload /></ListItemIcon>
          </Tooltip>  
          <ListItemText primary='Upload' />
        </ListItem>
        <Divider />
        <ListItem button key='Alterar Senha' onClick={changePasswordClicked}>
          <Tooltip title="Alterar Senha">
            <ListItemIcon><SwapVert /></ListItemIcon>
          </Tooltip>  
          <ListItemText primary='Alterar Senha' />
        </ListItem>
        
        <Divider />
        <ListItem button key='Logout' onClick={signOutClicked}>
          <Tooltip title="Logout">
            <ListItemIcon><ExitToApp /></ListItemIcon>
          </Tooltip>  
          <ListItemText primary='Logout' />
        </ListItem>
        
       
      </Drawer>
   
    <main className={classes.content}>
   
    <div className={classes.toolbar} />
      <Snackbar open={showMessageShow} autoHideDuration={6000}  onClose={handleClose} anchorOrigin={ { vertical: 'top', horizontal: 'center' } }>
      <Alert onClose={handleClose} severity={severityShow}  variant="filled" >
        {messageShow}
      </Alert>
    </Snackbar>

      <Backdrop open={processing}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid className={classes.root} container direction="column" justify="center" alignItems="center">
     
        <Box mr={2} boxShadow={3}>
          <DropzoneDialog
            dialogTitle={'Selecione arquivo para Upload'}
            cancelButtonText={'cancelar'}
            submitButtonText={'Enviar'}
            dropzoneText="Arraste e solte o arquivo ou clique."
            filesLimit={1}
            maxFileSize={10000000}
            open={open}
            onClose={() => setOpen(false)}
            onSave={(files) => {
              startProgress()
              setOpen(false)
              DesafioAwsService.upload(files[0]).finally(() => {
                stopProgress()
                loadFiles()
              })
            }}
            showPreviews={true}
            showFileNamesInPreview={true}
          />

        </Box>
      </Grid>
        
      <Grid className={classes.root} container direction="column" justify="center" alignItems="center" spacing={3}>
      <Box m={2}>
              <Link underline="none" color="inherit" href="https://github.com/FlavioAndre/desafio-cloud-aws">
                <Grid container direction="row" justify="center" alignItems="center">
                  <Box mr={3}>
                    <GitHubIcon fontSize="large" />
                  </Box>
                  <Typography className={classes.title} variant="h3">
                    Bootcamp Cloud AWS
                  </Typography>
                </Grid>
              </Link>
            </Box>
        <Box m={1} boxShadow={1} color="white" bgcolor="" p={0} width="95%">
       
          <Table>
         
            <TableHead>
              <TableRow>
                <TableCell>Arquivo</TableCell>
                <TableCell align="center">Atualização</TableCell>
                <TableCell align="right">Bytes</TableCell>
                <Fab aria-label="Upload" className="classes.fab" color="secondary" onClick={showUpload}>
                  <AddIcon />
                </Fab>
              </TableRow>
             
            </TableHead>

            <TableBody>
              {filesS3.map((row) => (
                <TableRow key={row.key}>
                  <TableCell component="th" scope="row">
                    {formatNameFile(row.key)}
                  </TableCell>
                  <TableCell align="center">{formatDate(row.lastModified)}</TableCell>
                  <TableCell align="right">{row.size}</TableCell>
                  <TableCell align="right" onClick={() => downLoadFile(row.key)}>
                    <CloudDownloadIcon />
                  </TableCell>
                  <TableCell align="right" onClick={() => deleteFile(row.key)}>
                    <DeleteIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Box mr={10} p={1} color="primary.main">
          <Button  variant="contained" color="primary" onClick={anterior} disabled={isFirst} >
                Anterior
          </Button>
          <Button  variant="contained" color="primary" onClick={proximo} disabled={!isNextToken}>
                Próximo
          </Button>
        </Box>
        </Box>
       
      </Grid>
    </main>
    </div>
  )
}

