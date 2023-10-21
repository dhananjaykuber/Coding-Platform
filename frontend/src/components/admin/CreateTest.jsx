import React, { useState } from 'react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import postAPIData from '../../hooks/postAPIData';
import { useDispatch, useSelector } from 'react-redux';
import { success, error } from '../../utils/toasts';
import { addTest } from '../../redux/adminSlice';

const CreateTest = ({ createTest, setCreateTest }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const { loading, sendData } = postAPIData();

  const handleCreateTest = async () => {
    if (!title && !description && !minutes && !seconds) {
      return error('All fields are mandatory.');
    }

    const data = await sendData(
      `${import.meta.env.VITE_NODE_API}/admin/test`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
      {
        title,
        description,
        time: `${minutes}:${seconds}`,
      }
    );

    if (data) {
      success('Test created successfully.');
      dispatch(addTest(data));
      setTitle('');
      setDescription('');
      setMinutes('');
      setSeconds('');
      setCreateTest(false);
    }
  };

  return (
    <Modal openModal={createTest} setOpenModal={setCreateTest}>
      <div>
        <h4 className="font-semibold text-lg mb-2">Create Test</h4>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          type="text"
          className={'w-[400px]'}
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          type="text"
          className={'w-[400px]'}
        />
        <div className="flex w-[400px] gap-3">
          <Input
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="Minutes"
            type="number"
            className={'flex-1 w-full'}
          />
          <Input
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            placeholder="Seconds"
            type="number"
            className={'flex-1 w-full'}
          />
        </div>
        <Button value={'Create'} onClick={handleCreateTest} loading={loading} />
      </div>
    </Modal>
  );
};

export default CreateTest;
