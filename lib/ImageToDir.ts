import { existsSync, readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { normalize } from 'path';
import moment, { Moment } from 'moment';

export function fromDirectoryTo(fromPath: string, toPath: string){
  if(!pathExists(fromPath))
    throw Error("From path doesn't exists");

  if(!pathExists(toPath))
    throw Error("To path doesn't exists");
  let filesPaths = getAbsolutePaths(fromPath, getOnlyImageFiles(getFilesPaths(fromPath)));
  filesPaths.forEach(filePath => {
    let momentFile = readFile(filePath);
    let year = momentFile.year();
    let month = momentFile.month() + 1;
    let day = momentFile.date();

    console.log(filePath);

    createDirIfNotExists(`${toPath}${year}`);
    createDirIfNotExists(`${toPath}${year}/${month}`);
    createDirIfNotExists(`${toPath}${year}/${month}/${day}`);

    copyFileToDir(filePath, `${toPath}${year}/${month}/${day}/`);
  });
}

function pathExists(path: string): boolean{
  return existsSync(path);
}

function getFilesPaths(path: string): string[]{
  return readdirSync(path);
}

function getOnlyImageFiles(files: string[]): string[]{
  return files.filter(file => {
    let fileName = file.toLowerCase();
    return fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.heif') || fileName.endsWith('.mov') || fileName.endsWith('.mp4')
  });
}

function getAbsolutePaths(root: string, files: string[]): string[] {
  return files.map(fileName => normalize(root.concat(fileName)));
}

function readFile(filePath: string): Moment {
  return moment(statSync(filePath).birthtime);
}

function createDirIfNotExists(dir: string){
  if(!existsSync(dir)){
    mkdirSync(dir);
  }
}

function copyFileToDir(filePath: string, destPath: string){
  let file = readFileSync(filePath);
  let splittedNames = filePath.split('.');
  let extension = splittedNames[splittedNames.length-1];
  let fileDestPath = `${destPath}${Date.now()}.${extension}`;
  writeFileSync(fileDestPath, file);
  console.log(`${filePath} has been copy successfully to ${destPath}`);
}