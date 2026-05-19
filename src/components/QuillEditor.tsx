import { useEffect, useMemo, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const QuillEditor = ({ value, onChange, placeholder = "Écrivez votre contenu...", className = "" }: QuillEditorProps) => {
  const quillRef = useRef<any>(null);
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const mod = await import('react-quill');
      if (mounted) setReactQuill(() => mod.default);
    })();
    return () => { mounted = false; };
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const path = `content/${fileName}`;
    const { error } = await supabase.storage.from('news-images').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('news-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Erreur', description: "L'image ne doit pas dépasser 5MB", variant: 'destructive' });
        return;
      }
      const editor = quillRef.current?.getEditor();
      const range = editor?.getSelection(true) || { index: editor?.getLength() || 0 };
      const placeholderText = "Chargement de l'image...";
      try {
        editor?.insertText(range.index, placeholderText, { italic: true }, 'user');
        const url = await uploadImage(file);
        editor?.deleteText(range.index, placeholderText.length, 'user');
        editor?.insertEmbed(range.index, 'image', url, 'user');
        editor?.setSelection(range.index + 1, 0);
        toast({ title: 'Succès', description: 'Image insérée.' });
      } catch (err: any) {
        console.error(err);
        try { editor?.deleteText(range.index, placeholderText.length, 'user'); } catch {}
        toast({ title: 'Erreur', description: "Échec du téléversement de l'image.", variant: 'destructive' });
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: { image: imageHandler },
    },
    clipboard: { matchVisual: false },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image',
    'width', 'height',
  ];

  if (!ReactQuill) {
    return (
      <div className={`border border-gray-300 rounded-lg h-64 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ReactQuill
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