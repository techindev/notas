'use client';
import './globals.css'
import './layout'

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { FiDownload, FiFile, FiImage, FiSave, FiTrash2 } from 'react-icons/fi';

type Note = {
  id: number;
  text: string;
  file: File | null;
  image: File | null;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleSave = (): void => {
    if (!text.trim()) {
      setError('El texto es obligatorio');
      return;
    }
    
    setError('');
    const newNote: Note = {
      id: Date.now(),
      text,
      file,
      image
    };
    
    setNotes([...notes, newNote]);
    setText('');
    setFile(null);
    setImage(null);
  };

  const handleDelete = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDownload = (file: File | null) => {
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Formulario para nueva nota */}
      <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden mb-4 p-4 border border-white bg-gray-900">
        <h2 className="text-lg font-bold mb-3 text-white text-center">Nueva Nota</h2>
        
        <textarea
          className={`w-full p-2 text-sm border rounded mb-2 bg-gray-800 text-white ${error ? 'border-red-500' : 'border-white'}`}
          rows={3}
          placeholder="Escribe tu nota aquí..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        
        {error && (
          <p className="text-red-500 text-xs mb-3 text-center">
            {error}
          </p>
        )}
        
        <div className="flex gap-2 mb-3 justify-center">
          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded border border-white flex items-center gap-1 text-xs">
            <FiFile className="text-white text-sm" />
            <span className="text-white">Archivo</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
          
          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded border border-white flex items-center gap-1 text-xs">
            <FiImage className="text-white text-sm" />
            <span className="text-white">Imagen</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </label>
        </div>
        
        {file && (
          <div className="mb-2 flex justify-between items-center bg-gray-800 p-1 rounded border border-white text-xs">
            <p className="text-white truncate max-w-[180px]">{file.name}</p>
            <button 
              onClick={() => handleDownload(file)}
              className="text-white hover:text-gray-300"
            >
              <FiDownload size={14} />
            </button>
          </div>
        )}
        
        {image && (
          <div className="mb-3">
            <div className="relative w-full h-32 rounded overflow-hidden border border-white bg-gray-800">
              <Image
                src={URL.createObjectURL(image)}
                alt="Preview"
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
              <button 
                onClick={() => handleDownload(image)}
                className="absolute bottom-1 right-1 bg-black bg-opacity-50 p-1 rounded-full text-white hover:bg-opacity-70"
              >
                <FiDownload size={14} />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <button 
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-1 px-4 rounded border border-white flex items-center gap-1"
            onClick={handleSave}
          >
            <FiSave size={14} />
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* Lista de notas existentes */}
      <div className="grid gap-3">
        {notes.map((note) => (
          <div 
            key={note.id} 
            className="rounded-lg shadow-md overflow-hidden p-3 border border-white bg-gray-900 relative"
          >
            <button 
              onClick={() => handleDelete(note.id)}
              className="absolute top-1 right-1 text-white hover:text-red-300 p-1"
              title="Eliminar nota"
            >
              <FiTrash2 size={14} />
            </button>
            
            <p className="text-white text-sm pr-5">{note.text}</p>
            
            {note.file && (
              <div className="mt-2 flex justify-between items-center bg-gray-800 p-1 rounded border border-white text-xs">
                <div className="flex items-center gap-1">
                  <FiFile className="text-white text-xs" />
                  <p className="text-white truncate max-w-[160px]">{note.file.name}</p>
                </div>
                <button 
                  onClick={() => handleDownload(note.file)}
                  className="text-white hover:text-gray-300"
                >
                  <FiDownload size={14} />
                </button>
              </div>
            )}
            
            {note.image && (
              <div className="mt-2">
                <div className="relative w-full h-28 rounded overflow-hidden border border-white bg-gray-800">
                  <Image
                    src={URL.createObjectURL(note.image)}
                    alt="Imagen adjunta"
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  <button 
                    onClick={() => handleDownload(note.image)}
                    className="absolute bottom-1 right-1 bg-black bg-opacity-50 p-1 rounded-full text-white hover:bg-opacity-70"
                  >
                    <FiDownload size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}