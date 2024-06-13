// fileUtils.ts
import { saveAs } from 'file-saver';

export const saveDataToFile = (data: string, filename: string = 'form-data.txt') => {
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
};

export const appendDataToFile = (existingData: string, newData: string, filename: string = 'form-data.txt') => {
    const updatedData = `${existingData}\n${newData}`;
    saveDataToFile(updatedData, filename);
};
