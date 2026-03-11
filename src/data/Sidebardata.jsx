import {
  MdGroup, MdStorefront, MdOndemandVideo, MdBookmark,
  MdEvent, MdSportsEsports, MdMemory, MdPeople,
  MdFlag, MdPlayCircle, MdHome, MdVolunteerActivism,
  MdGroups, MdWorkHistory, MdCalendarMonth, MdOutlineExplore,
} from "react-icons/md";
import { FaReact, FaLayerGroup, FaCode, FaNodeJs } from "react-icons/fa";

export const menuItemsMain = [
  { icon: <MdGroup />,         label: "Friends",     route: "/friends"     },
  { icon: <MdStorefront />,    label: "Marketplace", route: "/marketplace" },
  { icon: <MdOndemandVideo />, label: "Watch",       route: "/watch"       },
  { icon: <MdBookmark />,      label: "Saved",       route: "/saved"       },
  { icon: <MdEvent />,         label: "Events",      route: "/events"      },
];

export const menuItemsExtra = [
  { icon: <MdSportsEsports />,    label: "Gaming",      route: "/gaming"      },
  { icon: <MdMemory />,           label: "Memories",    route: "/memories"    },
  { icon: <MdPeople />,           label: "Groups",      route: "/groups"      },
  { icon: <MdFlag />,             label: "Pages",       route: "/pages"       },
  { icon: <MdPlayCircle />,       label: "Videos",      route: "/videos"      },
  { icon: <MdHome />,             label: "Feeds",       route: "/feeds"       },
  { icon: <MdVolunteerActivism />,label: "Fundraisers", route: "/fundraisers" },
  { icon: <MdGroups />,           label: "Community",   route: "/community"   },
  { icon: <MdWorkHistory />,      label: "Jobs",        route: "/jobs"        },
  { icon: <MdCalendarMonth />,    label: "Birthdays",   route: "/birthdays"   },
  { icon: <MdOutlineExplore />,   label: "Explore",     route: "/explore"     },
];

export const shortcuts = [
  { label: "React Developers PK",  icon: <FaReact />   },
  { label: "MERN Stack Community", icon: <FaLayerGroup /> },
  { label: "Lahore Coders",        icon: <FaCode />    },
  { label: "Next.js Pakistan",     icon: <FaNodeJs />  },
];