import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { EventType } from "./Calender";

interface ModelType {
  onClose: () => void;
  onCloseActionModel: () => void;
  modelRef: React.RefObject<HTMLDivElement> | React.RefObject<null>;
  setEventes: React.Dispatch<React.SetStateAction<EventType[]>>;
  EditeModelOpen: () => void;
  updatedData: EventType | null;
  actionModel: boolean;
  startDate: string | null;
}
const EventModal: React.FC<ModelType> = ({
  onClose,
  setEventes,
  actionModel,
  onCloseActionModel,
  updatedData,
  EditeModelOpen,
  startDate,
  modelRef,
}) => {
  console.log(startDate);
  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .max(50, "Title must be less than 50 characters"),
    description: Yup.string()
      .max(100, "Description too long")
      .required("description is required"),
    start: Yup.string().required("Start time is required"),
    end: Yup.string()
      .required("End time is required")
      .test(
        "is-after-start",
        "End time must be after start time",
        function (value) {
          const { start } = this.parent;
          return new Date(value) > new Date(start);
        }
      ),
    color: Yup.string().required("Color tag is required"),
  });
  const { values, handleBlur, handleChange, handleSubmit, touched, errors } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        title: updatedData?.title || "",
        description: updatedData?.description || "",
        start: updatedData?.start || startDate || "",
        end: updatedData?.end || "",
        color: updatedData?.color || "#000000",
        reminder: false,
      },
      validationSchema,
      onSubmit: (values) => {
        if (updatedData) {
          setEventes((prev) =>
            prev.map((ev) =>
              ev.id === updatedData.id ? { ...values, id: updatedData.id } : ev
            )
          );
        } else {
          setEventes((prev) => [
            ...prev,
            { ...values, id: crypto.randomUUID() },
          ]);
        }
        onClose();
      },
    });
  const handleDelete = () => {
    if (updatedData) {
      setEventes((prev) => prev.filter((ev) => ev.id != updatedData.id));
      onCloseActionModel();
    }
  };
  return (
    <div className="fixed z-10 bg-black/60 inset-0 flex items-center justify-center">
      {actionModel ? (
        <div
          ref={modelRef}
          className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
            Event Options.
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-center mb-5">
            What would you like to do with this event?
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={EditeModelOpen}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
            >
              Delete
            </button>

            <button
              onClick={() => onCloseActionModel()}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div ref={modelRef}>
          <form
            className="bg-white  rounded-2xl p-6 w-full max-w-[500px] shadow-lg"
            onSubmit={handleSubmit}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Add / Edit Event
            </h2>

            <div>
              <div>
                {" "}
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter event title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-lg p-2 mb-1 focus:outline-none ${
                    touched.title && errors.title
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched.title && errors.title && (
                  <p className="text-red-500 text-sm mb-2">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Add details about your event"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-lg p-2 mb-1 h-20 resize-none focus:outline-none ${
                    touched.description && errors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched.description && errors.description && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.description}
                  </p>
                )}
              </div>
              {/* date div */}
              <div className="flex justify-between gap-5 items-center">
                {" "}
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="start"
                    value={values.start}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-lg p-2 mb-1 focus:outline-none ${
                      touched.start && errors.start
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {touched.start && errors.start && (
                    <p className="text-red-500 text-sm">{errors.start}</p>
                  )}
                </div>
                <div className="w-full">
                  {" "}
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end"
                    value={values.end}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-lg p-2 mb-1 focus:outline-none ${
                      touched.end && errors.end
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {touched.end && errors.end && (
                    <p className="text-red-500 text-sm">{errors.end}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Color Picker */}
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Color Tag
            </label>
            <input
              type="color"
              name="color"
              value={values.color}
              onChange={handleChange}
              className="w-12 h-8 mb-3 border rounded cursor-pointer"
            />
            {touched.color && errors.color && (
              <p className="text-red-500 text-sm mb-2">{errors.color}</p>
            )}

            {/* Reminder */}
            <label className="flex items-center gap-2 mb-5 text-gray-700">
              <input
                type="checkbox"
                name="reminder"
                checked={values.reminder}
                onChange={handleChange}
                className="w-4 h-4"
              />{" "}
              Reminder
            </label>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
                Save
              </button>
              <button
                onClick={onClose}
                className="bg-gray-400 cursor-pointer hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventModal;
