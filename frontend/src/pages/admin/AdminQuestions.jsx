import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import getAPIData from '../../hooks/getAPIData';
import Question from '../../components/admin/Question';

const AdminQuestions = () => {
  const { user } = useSelector((store) => store.user);

  const [questions, setQuestions] = useState(null);

  const { data, getLoading, getError } = getAPIData(
    `${import.meta.env.VITE_NODE_API}/admin/questions`,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  );

  useEffect(() => {
    if (!getLoading && !getError) {
      console.log(data);
      setQuestions(data);
    }
  }, [data, getLoading, getError]);

  return (
    <div>
      <Sidebar>
        {getLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="pb-5">
            {questions?.map((question) => (
              <Question question={question} key={question._id} />
            ))}
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default AdminQuestions;
