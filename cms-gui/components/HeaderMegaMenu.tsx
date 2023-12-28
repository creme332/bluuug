import {
  Group,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "../styles/HeaderMegaMenu.module.css";

const links = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Post",
    url: "/post",
  },
  {
    name: "Settings",
    url: "/setting",
  },
];

export default function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const allLinks = links.map((e) => (
    <a href={e.url} key={`header-link-${e.name}`} className={classes.link}>
      {e.name}
    </a>
  ));
  return (
    <Box pb={60}>
      <header className={classes.header}>
        <Group justify="center" h="100%">
          <Group h="100%" gap={0} visibleFrom="sm">
            {allLinks}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          {allLinks}
          <Divider my="sm" />
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
