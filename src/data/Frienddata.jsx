import {
  MdPeople, MdPersonAdd, MdCake, MdList,
} from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';

export const REQUESTS = [
  { id: 1,  name: "Ali Raza",       mutual: 11, avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 2,  name: "Sara Khan",      mutual: 2,  avatar: "https://i.pravatar.cc/150?img=47" },
  { id: 3,  name: "Usman Malik",    mutual: 10, avatar: "https://i.pravatar.cc/150?img=33" },
  { id: 4,  name: "Hina Butt",      mutual: 2,  avatar: "https://i.pravatar.cc/150?img=23" },
  { id: 5,  name: "Bilal Ahmed",    mutual: 7,  avatar: "https://i.pravatar.cc/150?img=15" },
  { id: 6,  name: "Ayesha Tariq",   mutual: 3,  avatar: "https://i.pravatar.cc/150?img=56" },
  { id: 7,  name: "Hamza Sheikh",   mutual: 5,  avatar: "https://i.pravatar.cc/150?img=68" },
  { id: 8,  name: "Zara Noor",      mutual: 8,  avatar: "https://i.pravatar.cc/150?img=41" },
  { id: 9,  name: "Faisal Qureshi", mutual: 1,  avatar: "https://i.pravatar.cc/150?img=52" },
  { id: 10, name: "Mariam Javed",   mutual: 4,  avatar: "https://i.pravatar.cc/150?img=37" },
];

export const NAV_ITEMS = [
  { icon: <MdPeople size={20}/>,      label: "Home",             active: true },
  { icon: <MdPersonAdd size={20}/>,   label: "Friend Requests",  badge: 9     },
  { icon: <FaUserFriends size={20}/>, label: "Suggestions",      arrow: true  },
  { icon: <MdPeople size={20}/>,      label: "All friends",      arrow: true  },
  { icon: <MdCake size={20}/>,        label: "Birthdays",                     },
  { icon: <MdList size={20}/>,        label: "Custom Lists",     arrow: true  },
];