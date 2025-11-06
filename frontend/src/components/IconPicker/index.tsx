// Em: frontend/src/components/IconPicker/index.tsx

import { iconList } from '../../utils/iconList';
import { DynamicIcon } from '../DynamicIcon';
import styles from './IconPicker.module.css';

interface IconPickerProps {
  selectedValue: string;
  onSelect: (iconName: string) => void;
}

export const IconPicker = ({ selectedValue, onSelect }: IconPickerProps) => {
  return (
    <div className={styles.grid}>
      {iconList.map((iconName) => (
        <button
          type="button" // Impede que ele submeta o formulário
          key={iconName}
          className={`${styles.iconButton} ${selectedValue === iconName ? styles.selected : ''}`}
          onClick={() => onSelect(iconName)}
        >
          <DynamicIcon name={iconName} />
        </button>
      ))}
    </div>
  );
};