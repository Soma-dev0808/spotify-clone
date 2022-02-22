import React from 'react';
import { SidebarMebu } from '../utilities/sidebarMenus';

const SidebarMenuButton: React.FC<SidebarMebu> = ({
  menuName,
  Icon,
  onClickAction,
  iconStyle,
}) => {
  // If onClickAction has function, use it for onClick
  const hasClickAction = typeof onClickAction === 'function';
  const _iconStyle = iconStyle ?? '';

  return (
    <button
      className="flex items-center space-x-2 hover:text-white"
      {...(hasClickAction && { onClick: onClickAction })}
    >
      <Icon className={`h-5 w-5 ${_iconStyle}`} />
      <p>{menuName}</p>
    </button>
  );
};

export default SidebarMenuButton;
