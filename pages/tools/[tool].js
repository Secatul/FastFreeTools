import { useRouter } from 'next/router';

import CaseConverter from './uppercase';
import LinkGenerator from './linkgenerator';
import BinaryTextConverter from './binary-to-text';
import UUIDGenerator from './uuid-generator';
import WordCounter from './word-counter';
import HTMLGenerator from './html-generator';
import HTMLToMarkdownConverter from './html-md-converter';
import QRCodeGenerator from './qr-code-generator';
import MarkdownEditor from './markdown-editor';
import ColorPicker from './color-picker';
import MorseCodeTranslator from './morse-code-translator';
import UnixTimestampTool from './unix-timestamp';

const ToolPage = () => {
  const router = useRouter();
  const { tool } = router.query;

  const renderTool = () => {
    switch (tool) {
      case 'html-md-converter':
        return <HTMLToMarkdownConverter />;
      case 'uppercase':
        return <CaseConverter />;
      case 'base64encoder':
        return <Base64Encoder />;
      case 'jsonformatter':
        return <JSONFormatter />;
      case 'passwordgenerator':
        return <PasswordGenerator />;
      case 'linkgenerator':
        return <LinkGenerator />;
      case 'html-generator':
        return <HTMLGenerator />;
      case 'uuid-generator':
        return <UUIDGenerator />;
      case 'lorem-ipsum':
        return <LoremIpsumGenerator />;
      case 'qrcode-generator':
        return <QRCodeGenerator />;
      case 'word-counter':
        return <WordCounter />;
      case 'binary-to-text':
        return <BinaryTextConverter />;
      case 'unix-timestamp':
        return <UnixTimestampTool />;
      case 'morse-code-translator':
        return <MorseCodeTranslator />;
      case 'case-converter':
        return <CaseConverter />;
      case 'text-reverser':
        return <TextReverser />;
      case 'regex-tester':
        return <RegexTester />;
      case 'color-picker':
        return <ColorPicker />;
      case 'markdown-editor':
        return <MarkdownEditor />;
      default:
        return <p>Tool not found</p>;  
    }
  };

  return (
    <div>
      <h1>Tool: {tool}</h1>
      <div>
        {renderTool()}  {/* This will render the correct tool component */}
      </div>
    </div>
  );
};

export default ToolPage;
