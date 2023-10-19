import React, { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import getAPIData from '../../hooks/getAPIData';
import { setResults } from '../../redux/adminSlice';

const Result = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);
  const { results } = useSelector((store) => store.admin);

  const { data, getLoading, getError } = getAPIData(
    `${import.meta.env.VITE_NODE_API}/admin/results`,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  );

  useEffect(() => {
    if (!getLoading && !getError) {
      console.log(data);
      dispatch(setResults(data));
    }
  }, [data, getLoading, getError]);

  return (
    <div>
      <Sidebar>
        {getLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table className="table-fixed border-collapse border border-slate-300 ">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">No.</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Submitted</th>
                  <th className="border border-gray-300 p-2">Total Solved</th>
                  <th className="border border-gray-300 p-2">Tests Passed</th>
                  <th className="border border-gray-300 p-2">Run Count</th>
                  <th className="border border-gray-300 p-2">Execution Time</th>
                  <th className="border border-gray-300 p-2">
                    Time To Complete
                  </th>
                </tr>
              </thead>
              <tbody>
                {results?.map((result, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {result.email}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {result.submitted ? '✅' : '❌'}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {result.totalSolved}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {result.totalPassedTests}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {result.totalRunCount}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {result.totalExecutionTime}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {result.endedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default Result;
