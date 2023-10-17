import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import getAPIData from '../hooks/getAPIData';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Editor from '@monaco-editor/react';

const languages = ['C', 'CPP', 'Java', 'Python', 'Solidity'];
const extensions = {
  C: 'c',
  CPP: 'cpp',
  Java: 'java',
  Python: 'py',
  Solidity: 'sol',
};

const Question = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { user } = useSelector((store) => store.user);

  const textareaRef = useRef();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const { data, getLoading, getError } = getAPIData(
    `${import.meta.env.VITE_NODE_API}/question/${id}`,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  );

  useEffect(() => {
    if (!user) {
      navigate('/signup');
    }

    if (!getLoading && !getError) {
      setQuestion(data);
    }
  }, [data, getLoading, getError]);

  const handleSubmit = async () => {
    setLoading(true);
    const text = textareaRef.current.getValue();

    const blob = new Blob([text], { type: 'text/plain' });

    const formData = new FormData();
    formData.append(
      'codeFile',
      blob,
      `${user.email}-question${question.number}.${extensions[selectedLanguage]}`
    );
    formData.append('language', selectedLanguage);
    formData.append('question', id);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_NODE_API}/code/submit`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.ok) {
        console.log('File uploaded successfully.');
        navigate('/question');
      } else {
        console.error('File upload failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  function handleEditorDidMount(editor, monaco) {
    textareaRef.current = editor;
  }

  if (getError) {
    return (
      <p>
        {getError} <Link to="/question">Solve other question. Click here</Link>
      </p>
    );
  }

  return (
    <div className="p-3">
      {getLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex">
          <div className="w-[40vw] mr-5">
            <h2 className="text-2xl font-bold mb-4">
              {question?.number}. {question?.title}
            </h2>
            <p className="mb-5">{question?.description}</p>
            <Button
              value={'Submit'}
              onClick={handleSubmit}
              loading={loading}
              className={'w-fit'}
            />
          </div>
          <div className="flex-1 relative">
            <select
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="absolute top-1 right-1 z-50 bg-gray-100 outline-none rounded-md text-sm"
            >
              {languages.map((language) => (
                <option
                  value={language}
                  key={language}
                  defaultValue={languages[0]}
                  className="text-xs"
                >
                  {language}
                </option>
              ))}
            </select>
            <Editor
              height="87vh"
              theme="vs-dark"
              onMount={handleEditorDidMount}
              path={'program'}
              defaultLanguage={selectedLanguage.toLocaleLowerCase()}
              defaultValue={'// Write your code here'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
