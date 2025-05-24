
import React, { useState, useCallback } from 'react';
import { ExtractedContacts } from './types';
import { extractContactsFromText } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import ContactDisplay from './components/ContactDisplay';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [extractedContacts, setExtractedContacts] = useState<ExtractedContacts | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please paste some text to analyze.');
      setExtractedContacts(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setExtractedContacts(null);

    try {
      const contacts = await extractContactsFromText(inputText);
      setExtractedContacts(contacts);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setExtractedContacts(null);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100 flex flex-col items-center p-4 sm:p-8 selection:bg-sky-500 selection:text-white">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 tracking-tight">
          AI Contact Extractor
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Paste any text below, and our AI will attempt to find email addresses and phone numbers.
        </p>
      </header>

      <main className="w-full max-w-3xl bg-slate-800 shadow-2xl rounded-lg p-6 sm:p-8">
        <div className="mb-6">
          <label htmlFor="text-input" className="block text-sm font-medium text-slate-300 mb-2">
            Paste your text here:
          </label>
          <textarea
            id="text-input"
            rows={10}
            value={inputText}
            onChange={handleInputChange}
            placeholder="e.g., John Doe can be reached at john.doe@example.com or 555-123-4567. For support, email support@example.org or call +1 (555) 987-6543."
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-slate-200 placeholder-slate-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Extracting...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 transform transition-transform duration-300 group-hover:rotate-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
              Extract Contacts
            </>
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-700/50 border border-red-600 text-red-200 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {extractedContacts && !isLoading && (
          <ContactDisplay contacts={extractedContacts} />
        )}
      </main>
      
      <footer className="mt-12 text-center text-slate-500 text-sm">
        <p>Powered by Generative AI. For demonstration purposes only.</p>
        <p>Ensure you have the necessary rights to process any text you paste.</p>
      </footer>
    </div>
  );
};

export default App;
