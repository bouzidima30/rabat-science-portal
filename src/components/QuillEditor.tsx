
import { useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const QuillEditor = ({ value, onChange, placeholder = "Écrivez votre contenu...", className = "" }: QuillEditorProps) => {
  const quillRef = useRef<any>(null);
  const ReactQuill = useRef<any>(null);

  useEffect(() => {
    const loadQuill = async () => {
      if (typeof window !== 'undefined') {
        const { default: Quill } = await import('react-quill');
        ReactQuill.current = Quill;
      }
    };
    loadQuill();
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  if (!ReactQuill.current) {
    return (
      <div className={`border border-gray-300 rounded-lg h-64 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ReactQuill.current
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: '300px', marginBottom: '50px' }}
      />
    </div>
  );
};

export default QuillEditor;
