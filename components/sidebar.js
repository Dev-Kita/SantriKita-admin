import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const drawerWidth = 240;

const sideMenu = [
  { title: "Dashboard", slug: "/dashboard" },
  { title: "Daftar Siswa", slug: "/daftar-siswa" },
  { title: "Riwayat Pembelajaran", slug: "/riwayat-pembelajaran" },
  { title: "Riwayat Kesehatan", slug: "/riwayat-kesehatan" },
  { title: "Biaya", slug: "/biaya" },
  { title: "Prestasi", slug: "/prestasi" },
  { title: "Pelanggaran", slug: "/pelanggaran" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  active: {
    background: "#A7F3D0",
    color: "#047857",
  },
}));

export default function Sidebar({ children }) {
  const classes = useStyles();
  const router = useRouter();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Santri Kita
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {sideMenu.map((menu, index) => (
              <Link href={menu.slug} key={index}>
                <ListItem button selected={router.pathname === menu.slug}>
                  {/* <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon> */}
                  <ListItemText primary={menu.title} />
                </ListItem>
              </Link>
            ))}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
}
