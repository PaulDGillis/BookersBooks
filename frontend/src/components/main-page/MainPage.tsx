import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "../navbar/navbar";
import UploadModal from "../upload-modal/UploadModal";
import { useState } from "react";

function MainPage() {
  const { logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar
        handleUpload={() => {
          setModalOpen(true);
        }}
        logout={logout}
      />
      <Outlet />
      <UploadModal
        open={modalOpen}
        handleClose={() => {
          setModalOpen(false);
        }}
      />
    </>
  );
}

export default MainPage;
