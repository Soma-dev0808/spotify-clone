import {
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from '@heroIcons/react/outline';
import { HeartIcon } from '@heroIcons/react/solid';

export interface SidebarMebu {
  id: string;
  menuName: string;
  Icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  addHrBottom?: boolean;
  onClickAction?: (args: any) => any;
  iconStyle?: string;
}

const sidebarMenus: SidebarMebu[] = [
  {
    id: 'Home',
    menuName: 'Home',
    Icon: HomeIcon,
  },
  {
    id: 'Search',
    menuName: 'Search',
    Icon: SearchIcon,
  },
  {
    id: 'Your Library',
    menuName: 'Your Library',
    Icon: LibraryIcon,
    addHrBottom: true,
  },
  {
    id: 'Create Playlist',
    menuName: 'Create Playlist',
    Icon: PlusCircleIcon,
  },
  {
    id: 'Liked Songs',
    menuName: 'Liked Songs',
    Icon: HeartIcon,
    iconStyle: 'text-blue-500',
  },
  {
    id: 'Your episodes',
    menuName: 'Your episodes',
    Icon: RssIcon,
    iconStyle: 'text-green-500',
  },
];

export default sidebarMenus;
