import { Injectable } from '@nestjs/common';
import {
  configure,
  ZipReader,
  BlobReader,
  TextWriter,
  BlobWriter,
  Entry,
} from '@zip.js/zip.js';

import { XMLParser } from 'fast-xml-parser';
import { EpubMetaData } from 'bookers-books';

@Injectable()
export class EpubService {
  parseEpub = async (file: Blob): Promise<EpubMetaData> => {
    // Configure js.zip top open
    configure({ useWebWorkers: false });
    const reader = new ZipReader(new BlobReader(file));

    // Map the unzipped folder's to be a map of [filename to Entry(Some js.zip folder item type)]
    const entries: Entry[] = await reader.getEntries();
    const map: Map<string, Entry> = new Map(
      entries.map((entry) => [entry.filename, entry]),
    );

    // Open container.xml file for getting the .opf path in the zip
    const uri = 'META-INF/container.xml';
    if (!map.has(uri)) throw Error('Failed to find container.xml');

    const containerXmlStr = await map.get(uri).getData(new TextWriter());
    if (!containerXmlStr) throw new Error('Failed to read container.xml');

    // Parse container.xml and find the rootfile, should be a .opf file for .epub
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      alwaysCreateTextNode: true,
    });
    const parsedContainer = parser.parse(containerXmlStr);
    const rootFile = parsedContainer.container.rootfiles.rootfile;
    const opfPath = rootFile['full-path'];
    if (rootFile['media-type'] !== 'application/oebps-package+xml')
      throw new Error('Malformed data');

    // Parse .opf and find the cover photo file name from bonus metadata.
    const opfXmlStr = await map.get(opfPath).getData(new TextWriter());
    const parsedOpf = parser.parse(opfXmlStr).package;
    const coverImgsArr = parsedOpf.metadata.meta.filter(
      (item: { content: string; name: string }) => item.name === 'cover',
    );
    if (coverImgsArr.length <= 0) throw Error('Malformed data');

    // Take cover photo file name and look up full path in manifest.
    const img = coverImgsArr[0].content;
    const imagePathArr = parsedOpf.manifest.item.filter(
      (item: { id: string }) => {
        return item.id === img;
      },
    );

    if (imagePathArr.length <= 0) throw Error('Malformed data');
    // The manifest only gives us the image relative to the .opf
    const imagePathItem = imagePathArr[0];

    // Get the top level folder name from the .opf path
    const opfParentSplit = opfPath.split('/');
    const opfParentPath =
      opfParentSplit.slice(0, opfParentSplit.length - 1).join('/') + '/';

    // Combine to get full cover file path in zip
    const imagePath = opfParentPath + imagePathItem.href.replace(/%20/g, ' ');
    // console.log(opfParentPath, imagePathItem, imagePath);

    // Pull img out of .epub
    const blob = await map
      .get(imagePath)
      .getData(new BlobWriter(imagePathItem['media-type']));

    // Remaining metadata
    const metadata = parsedOpf.metadata;
    const title: string = metadata['dc:title']['#text'];
    const author: string = metadata['dc:creator']['#text'];
    reader.close();

    return { title, author, img, blob };
  };
}
