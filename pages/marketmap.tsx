import { Box, Container, Drawer, IconButton, Paper, Toolbar, Typography } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Treemap from "../components/Treemap";
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useDebugValue, useEffect, useState } from "react";
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { ChevronLeft, ChevronRight, Today } from "@material-ui/icons";
import zhTW from "date-fns/locale/zh-TW";
import { DateType } from "@date-io/type";

const drawerWidth = 320;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    }, 
    title: {
        flexGrow: 1,
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
      marginTop: "50px",
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    }
  }),
);

export default function MarketMap() {
    const width = 800;
    const height = 1920;

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [selectedDate, setDate] = useState(new Date());
    
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
      setOpen(false);
    };

    const handleDateChange = (date: MaterialUiPickersDate) => {
      setDate(new Date(date?.getTime()??new Date()))
    }
    
    return <div className={classes.root}>
        <AppBar position="fixed" className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}>
            <Toolbar>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
            >
                    <Today />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    台股板塊圖
                </Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeft />
                    </IconButton>
                </div>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhTW}>
                <DatePicker 
                    value={selectedDate}
                    onChange={handleDateChange}
                    maxDate={new Date()}
                    variant="static"></DatePicker>
                </MuiPickersUtilsProvider>
        </Drawer>
        <main className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}>  
            <Treemap width={width} height={height} date={selectedDate}/>
        </main>
        </div>
}