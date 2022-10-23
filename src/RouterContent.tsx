import * as React from 'react';
import {Routes, Route} from 'react-router-dom';
import {
  WishlistEditPage,
  GroupPage,
  ProfilePage,
  ProfileUpdatePage,
  GroupHomePage,
} from '#/pages';

function RouterContent(props) {
  return (
    <Routes>
      <Route path="/groups" element={<GroupPage />} />
      <Route path="/" element={<WishlistEditPage />} />
      <Route path="/groups/:groupname" element={<GroupHomePage />} />
      <Route path="/:username" element={<ProfilePage />} />
      <Route path="/profile/update" element={<ProfileUpdatePage />} />
    </Routes>
  );
}

export default RouterContent;
