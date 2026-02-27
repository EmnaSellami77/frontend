import React from 'react';

const Sidebar = ({ userRole }) => {
  console.log('Sidebar chargé');
  return (
    <div style={{width: '200px', background: 'gray', padding: '10px'}}>
      Sidebar - {userRole}
    </div>
  );
};

export default Sidebar;