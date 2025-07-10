import React from 'react';

const MessageConfiguration = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="md:text-3xl text-2xl font-bold text-gray-800 mb-6">Message Configuration</h1>
      <p className="text-gray-600 text-base mb-10">
        Enable or disable communication between teachers and students.
      </p>

      <div className="space-y-6 max-w-2xl">
        {[
          {
            title: "Enable Teacher to Student",
            desc: "Allow teachers to send messages to students",
          },
          {
            title: "Enable Student to Teacher",
            desc: "Allow students to send messages to teachers",
          },
          {
            title: "Enable Teacher to Teacher",
            desc: "Allow teachers to message other teachers",
          },
          {
            title: "Enable Student to Student",
            desc: "Allow students to message other students",
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
            <input type="checkbox" className="toggle toggle-success scale-90" />
          </div>
        ))}

        {/* Save Button */}
        <div className="pt-6">
          <button className="bg-[#5c3cbb] text-white px-6 py-3 rounded-lg hover:bg-[#4a2fa1] transition">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageConfiguration;
