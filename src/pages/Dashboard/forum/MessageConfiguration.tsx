import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store';
import {
  createmessageSetting,
  getmessageSetting,
  updatemessageSetting,
} from '../../../store/slices/staffchats';

const MessageConfiguration = () => {
  const dispatch = useAppDispatch();

  const { messageSettingsId, loading } = useAppSelector(
    (state: RootState) => state.staffChats
  );

  const [userId, setUserId] = useState<number>(0);
  const [form, setForm] = useState({
    enable_teacher_student_chat: false,
    enable_student_teacher: false,
    enable_teacher_teacher: false,
    enable_student_student: false,
  });

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem('ai-teacha-user');
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserId(parsedDetails.id);
    }
  }, []);

  useEffect(() => {
    dispatch(getmessageSetting());
  }, [dispatch]);

  useEffect(() => {
    if (messageSettingsId && messageSettingsId.user_id === userId) {
      setForm({
        enable_teacher_student_chat: !!messageSettingsId.enable_teacher_student_chat,
        enable_student_teacher: !!messageSettingsId.enable_student_teacher,
        enable_teacher_teacher: !!messageSettingsId.enable_teacher_teacher,
        enable_student_student: !!messageSettingsId.enable_student_student,
      });
    }
  }, [messageSettingsId, userId]);

  const handleToggle = (key: keyof typeof form) => {
    setForm((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      user_id: userId,
    };

    try {
      if (messageSettingsId && messageSettingsId.user_id === userId) {
        await dispatch(updatemessageSetting({ ...payload, id: messageSettingsId.id })).unwrap();
        alert('Settings updated successfully!');
      } else {
        await dispatch(createmessageSetting(payload)).unwrap();
        alert('Settings saved successfully!');
      }

      dispatch(getmessageSetting()); 
    } catch (error) {
      alert('❌ Failed to save/update settings');
      console.error(error);
    }
  };

  const isUpdate = messageSettingsId && messageSettingsId.user_id === userId;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="md:text-3xl text-2xl font-bold text-gray-800 mb-6">Message Configuration</h1>
      <p className="text-gray-600 text-base mb-10">
        Enable or disable communication between teachers and students.
      </p>

      <div className="space-y-6 max-w-2xl">
        {[
          {
            title: 'Enable Teacher to Student',
            desc: 'Allow teachers to send messages to students',
            key: 'enable_teacher_student_chat',
          },
          {
            title: 'Enable Student to Teacher',
            desc: 'Allow students to send messages to teachers',
            key: 'enable_student_teacher',
          },
          {
            title: 'Enable Teacher to Teacher',
            desc: 'Allow teachers to message other teachers',
            key: 'enable_teacher_teacher',
          },
          {
            title: 'Enable Student to Student',
            desc: 'Allow students to message other students',
            key: 'enable_student_student',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white shadow-md p-5 rounded-lg"
          >
            <div className="flex-1 pr-4">
              <p className="text-lg font-medium text-gray-800">{item.title}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-success scale-90 accent-[#6610f2]"
              checked={form[item.key as keyof typeof form]}
              onChange={() => handleToggle(item.key as keyof typeof form)}
            />
          </div>
        ))}

        {/* Save/Update Button */}
        <div className="pt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5c3cbb] hover:bg-[#4a2fa1]'
            } text-white px-6 py-3 rounded-lg transition`}
          >
            {isUpdate ? 'Update Configuration' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageConfiguration;
