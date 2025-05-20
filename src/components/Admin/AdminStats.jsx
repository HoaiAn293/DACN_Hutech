import React from "react";

const AdminStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((s, i) => (
      <div key={i} className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">{s.title}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
          <div className="text-3xl">{s.icon}</div>
        </div>
      </div>
    ))}
  </div>
);

export default AdminStats;
