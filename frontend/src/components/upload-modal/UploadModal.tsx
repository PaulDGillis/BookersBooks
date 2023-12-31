import React, { useState } from "react";
import { Modal } from "@mui/base/Modal";
import { prepareForSlot } from "@mui/base/utils";
import * as bookApi from "../../api/book";

const Backdrop = React.forwardRef<
  HTMLDivElement,
  { open?: boolean; className: string }
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { open, className, ...other } = props;
  return (
    <div className="fixed z-[-1] inset-0 bg-black/60" ref={ref} {...other} />
  );
});

const UploadModal = (props: { open: boolean; handleClose: () => void }) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const onSubmit = () => {
    if (file) {
      bookApi.upload(file).then((res) => console.log(res));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Modal
        className="fixed z-1300 inset-0 flex items-center justify-center"
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={props.open}
        onClose={props.handleClose}
        slots={{
          backdrop: prepareForSlot(Backdrop),
        }}
      >
        <div className="w-5/6 rounded-xl border-2 border-stone-400 py-5 pl-4 pr-6 bg-white">
          <label
            htmlFor="formFile"
            className="inline-block text-xl font-medium text-neutral-700 dark:text-neutral-200"
          >
            Add to library.
          </label>
          <input
            className="mt-4 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
            type="file"
            onChange={onFileChange}
            id="formFile"
          />

          <div className="flex flex-row gap-8 mt-6">
            <button
              type="submit"
              onClick={onSubmit}
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={props.handleClose}
              className="flex w-full justify-center rounded-lg border-indigo-600 border px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-600 hover:text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UploadModal;
