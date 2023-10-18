import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import getAPIData from '../hooks/getAPIData';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const languages = ['CPP', 'Java', 'Python', 'Solidity'];
const extensions = {
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
  const [output, setOutput] = useState('');
  const [outputError, setOutputError] = useState('');
  const [runLoading, setRunLoading] = useState(false);

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

  const handleRun = async () => {
    setRunLoading(true);
    setOutputError(null);
    setOutput(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_NODE_API}/code/run`,
        {
          code: textareaRef.current.getValue(),
          language: selectedLanguage.toLocaleLowerCase(),
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setOutput(res.data.message);
      console.log(res.data.message);
    } catch (error) {
      setOutputError(error.response.data.error);
      console.log(error.response.data.error);
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_NODE_API}/code/submit`,
        {
          code: textareaRef.current.getValue(),
          language: selectedLanguage.toLocaleLowerCase(),
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log(res.data.message);
      navigate('/question');
    } catch (error) {
      setOutputError(error.response.data.error);
      console.log(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  function handleEditorDidMount(editor, monaco) {
    textareaRef.current = editor;
  }

  if (getError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-red-600 font-semibold text-sm">
          {getError}{' '}
          <Link to="/question" className="text-blue-600 font-medium underline">
            Click here to solve other questions.
          </Link>
        </p>
      </div>
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
            <Button
              value={'Run'}
              onClick={handleRun}
              loading={runLoading}
              className={'w-fit bg-green-700 ml-5 px-5'}
            />

            <h6 className="mt-10 text-base font-bold mb-2">Output</h6>
            <div className="bg-neutral-900 min-h-[200px] p-4 rounded-md">
              {outputError && (
                <p className="text-sm text-red-500">{outputError}</p>
              )}
              {output && <p className="text-sm text-green-500">{output}</p>}
            </div>
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
              height="86vh"
              theme="vs-dark"
              onMount={handleEditorDidMount}
              path={'program'}
              defaultLanguage={selectedLanguage.toLocaleLowerCase()}
              value={question?.template[selectedLanguage.toLocaleLowerCase()]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
