import docExtImg from './file_extension_doc.png';
import pdfExtImg from './file_extension_pdf.png';
import txtExtImg from './file_extension_txt.png';
import zipExtImg from './file_extension_zip.png';

export default function getExtImg(fileName) {
	if (/\.docx{0,1}$/.test(fileName)) return docExtImg;
	if (/\.pdf$/.test(fileName)) return pdfExtImg;
	if (/\.txt$/.test(fileName)) return txtExtImg;
	if (/\.zip$/.test(fileName)) return zipExtImg;
}