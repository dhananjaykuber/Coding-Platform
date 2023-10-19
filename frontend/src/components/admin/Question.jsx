import React from 'react';

const Question = ({ question }) => {
  return (
    <div className="mb-5 border-b pb-5 border-gray-300">
      <h4 className="font-medium">
        {question.number}. {question.title}
      </h4>
      <div className="ml-4 mt-1">
        <p className="text-gray-600 text-sm mb-2">{question.description}</p>
        <div>
          <p className="text-gray-900 text-sm font-semibold mb-1">
            Code Templates
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(question.template).map(([language, code]) => (
              <div
                key={language}
                className="mb-3 border border-gray-300 rounded-md p-3 min-w-[31%]"
              >
                <h2 className="text-xs mb-2 font-medium">{language}</h2>
                <pre className="max-h-[150px] overflow-hidden overflow-y-auto overflow-x-auto text-sm">
                  <code>{code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-900 text-sm font-semibold mb-1">Test Cases</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(question.testCases).map(([language, tests]) => (
              <div
                key={language}
                className="mb-3 border border-gray-300 rounded-md p-3 min-w-[31%]"
              >
                <h2 className="text-xs mb-2 font-medium">{language}</h2>
                <pre className="max-h-[150px] overflow-hidden overflow-y-auto text-sm">
                  <code>
                    {tests.map((test, index) => (
                      <div className="mb-2" key={index}>
                        <span className="block">Input: {test.input}</span>
                        <span className="block">Output: {test.output}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
