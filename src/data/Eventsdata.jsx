import {
  MdPersonAdd, MdGroup, MdCake, MdList, MdHome,
} from 'react-icons/md';
export const EVENT_FILTERS = [
  { id: 1, label: 'Home', icon: <MdHome size={20} /> },
  { id: 2, label: 'Friend Requests', icon: <MdPersonAdd size={20} />, badge: 9 },
  { id: 3, label: 'Suggestions', icon: <MdGroup size={20} />, hasArrow: true },
  { id: 4, label: 'All friends', icon: <MdGroup size={20} />, hasArrow: true },
  { id: 5, label: 'Birthdays', icon: <MdCake size={20} /> },
  { id: 6, label: 'Custom Lists', icon: <MdList size={20} />, hasArrow: true },
];

export const EVENTS = [
  { id: 1, title: 'Tech Summit 2025', date: 'SAT, JUN 14 AT 10:00 AM', location: 'San Francisco, CA', interested: '2.4K', img: 'https://picsum.photos/seed/ev1/400/225' },
  { id: 2, title: 'Music Festival Night', date: 'FRI, JUL 4 AT 7:00 PM', location: 'Austin, TX', interested: '5.1K', img: 'https://picsum.photos/seed/ev2/400/225' },
  { id: 3, title: 'Art & Design Expo', date: 'MON, AUG 11 AT 9:00 AM', location: 'New York, NY', interested: '1.8K', img: 'https://picsum.photos/seed/ev3/400/225' },
  { id: 4, title: 'Food & Wine Fair', date: 'SUN, SEP 7 AT 12:00 PM', location: 'Chicago, IL', interested: '3.2K', img: 'https://picsum.photos/seed/ev4/400/225' },
  { id: 5, title: 'Startup Pitch Night', date: 'THU, OCT 2 AT 6:00 PM', location: 'Seattle, WA', interested: '980', img: 'https://picsum.photos/seed/ev5/400/225' },
  { id: 6, title: 'Marathon City Run', date: 'SAT, NOV 15 AT 7:30 AM', location: 'Boston, MA', interested: '7.6K', img: 'https://picsum.photos/seed/ev6/400/225' },
];