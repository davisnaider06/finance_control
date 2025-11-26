import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as GiIcons from 'react-icons/gi';
import { IconType } from 'react-icons';
import { CSSProperties } from 'react';

export interface DynamicIconProps {
  name: string;
  style?: CSSProperties;  
  className?: string;
}     

const iconLibraries: { [key: string]: IconType } = {
  ...FaIcons,
  ...MdIcons,
  ...GiIcons,
};

export const DynamicIcon = ({ name, style, className }: DynamicIconProps) => {
  const IconComponent = iconLibraries[name];

  if (!IconComponent) {
    return <FaIcons.FaQuestionCircle style={style} className={className} />;
  }
  return <IconComponent style={style} className={className} />;
};