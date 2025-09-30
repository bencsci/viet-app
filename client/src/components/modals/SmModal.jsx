import React from "react";
import { MdClose } from "react-icons/md";

const SmModal = ({
  modalName,
  valName,
  value,
  handleSubmit,
  onClose,
  onChange,
  placeholder,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
}) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#47A1BE] text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-medium">{modalName}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label
                htmlFor="modalInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {valName}
              </label>
              <input
                type="text"
                id="modalInput"
                value={value}
                onChange={onChange}
                placeholder={placeholder || `Enter ${valName.toLowerCase()}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#47A1BE] focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                {cancelButtonText}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#47A1BE] text-white rounded-md hover:bg-[#3E89A3] focus:outline-none focus:ring-2 focus:ring-[#47A1BE] focus:ring-offset-2"
              >
                {submitButtonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SmModal;
