import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getAPIData from '../hooks/getAPIData';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { setShowTimer, setTestId } from '../redux/countdownSlice';

const Question = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { id, testId } = useParams();

  const { user } = useSelector((store) => store.user);

  const textareaRef = useRef();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [output, setOutput] = useState('');
  const [outputError, setOutputError] = useState('');
  const [runLoading, setRunLoading] = useState(false);

  const { data, getLoading, getError } = getAPIData(
    `${import.meta.env.VITE_NODE_API}/question/test/${id}`,
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
      setLanguages(Object.keys(data.template));
      setSelectedLanguage(Object.keys(data.template)[0]);

      setQuestion(data);

      dispatch(setShowTimer(true));
      dispatch(setTestId(testId));
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
          testId: testId,
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
          testId: testId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log(res.data.message);
      navigate(`/test/${testId}/questions`);
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
          <Link
            to={`/test/${testId}/questions`}
            className="text-blue-600 font-medium underline"
          >
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

            <h6 className="mt-5 text-base font-bold mb-2">Test Cases</h6>
            <div className="bg-neutral-800 p-3 rounded-md text-white">
              <div className="flex gap-3 text-sm mb-1">
                <span>Input: </span>
                <div>{question?.testCases[selectedLanguage][0].input}</div>
              </div>
              <div className="flex gap-3 text-sm">
                <span>Output: </span>
                <div>{question?.testCases[selectedLanguage][0].output}</div>
              </div>
            </div>

            <h6 className="mt-5 text-base font-bold mb-2">Output</h6>
            <div className="bg-neutral-800 min-h-[200px] p-4 rounded-md overflow-hidden">
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
              height="85vh"
              theme="vs-dark"
              onMount={handleEditorDidMount}
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
