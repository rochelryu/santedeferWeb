import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const logger: Logger = new Logger('Utils');

export function imageFileFilter(req, file, callback) {
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
	  return callback(new Error('Que les images peuvent être chargées.'), false);
	}
	callback(null, true);
  };
  
export function editFileName(req, file, callback) {
	const randomName = Array(4)
	  .fill(null)
	  .map(() => Math.round(Math.random() * 16).toString(16))
	  .join('');
	callback(null, `${randomName}-${file.originalname}`);
  };

export function generateRecovery(): string {
	const initial = [ 1, 1, 1, 1 ];
	return initial.map((value) => value * Math.floor(Math.random() * 10)).join('');
}

export function getArrayDayOfMedecinRendezVous(dayNumber: number): string {
	if(dayNumber === 0) {
		return 'firstDay';
	}
	else if(dayNumber === 1) {
		return 'secondDay';
	}
	if(dayNumber === 2) {
		return 'thirdDay';
	}
	if(dayNumber === 3) {
		return 'fourDay';
	}
	if(dayNumber === 4) {
		return 'fiveDay';
	}
	if(dayNumber === 5) {
		return 'sixDay';
	}
	if(dayNumber === 6) {
		return 'sevenDay';
	}
	else {
		return 'sevenDay';
	}
}

export function generateEmploie(): Array<{isBusy: boolean, value: string}> {
	const initial = [ 1, 1, 1, 1,1, 1, 1, 1,1, 1, 1 ];
	return initial.map((value) => {
		return {
			isBusy: false,
			value: '',
		}
	});
}

export function assetFile(directory: string): string {
  return path.join(`${__dirname}/../../../public/assets/images/avatars/`, directory);
}

export function createFileWithBuffer(
  directory: string,
  base64: string,
) {
  const buff = Buffer.from(base64, 'base64');
  const inputFile = assetFile(directory);
  fs.writeFileSync(assetFile(directory), buff);
}
export function deleteFilesWithListName(directory: [string]) {
  const result = directory.map( pathName => {
	  if( pathName.indexOf('medical-mask.png') === -1 ) {
		  fs.unlink(assetFile(pathName), (error) => {
			if(error) {
				logger.error("file not found " + pathName);
			}
		});
	  }
    
  });
}

export async function createDirSync(directory) {
  await fs.mkdir(assetFile(directory), err => {
    if (err) {
      logger.log(err);
    }
  });
}

