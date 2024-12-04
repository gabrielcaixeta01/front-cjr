"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string(),
  password: Yup.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  department: Yup.string(),
  course: Yup.string(),
  profilePicture: Yup.mixed()
    .nullable()
    .test(
      "fileFormat",
      "Formato inválido. Apenas imagens são permitidas.",
      (value) =>
        !value || (value instanceof File && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    ),
});

const initialValues = {
  name: "",
  password: "",
  department: "",
  course: "",
  profilePicture: null,
};

const onSubmit = (values: typeof initialValues) => {
  const filteredValues = Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "")
  );
  console.log("Dados enviados:", filteredValues);
};

export default function EditarPerfil() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen bg-gray-100 items-center justify-center p-6">
      
      <div className="bg-customGreen p-6 rounded-lg w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-azulCjr">Atualize seu Perfil</h1>
          <p className="text-sm italic text-gray-600">Mantenha suas informações sempre atualizadas</p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4 text-black">
              {[
                { id: "name", label: "Nome", type: "text" },
                { id: "department", label: "Departamento", type: "text" },
                { id: "course", label: "Curso", type: "text" },
              ].map(({ id, label, type }) => (
                <div key={id} className="bg-white p-4 rounded-[30px] shadow-md">
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <Field
                    id={id}
                    name={id}
                    type={type}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-50 focus:outline-none focus:border-blue-400 focus:ring-0 transition duration-300"
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.blur()}
                  />
                  <ErrorMessage name={id} component="div" className="text-red-500 text-sm mt-1" />
                </div>
              ))}

              <div className="bg-white p-4 rounded-[30px] shadow-md relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="flex items-center">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-50 focus:outline-none focus:border-blue-400 focus:ring-0 transition duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-8 text-gray-500 hover:text-gray-800 transition"
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>


              <div className="bg-white p-8 rounded-[30px] justify-center shadow-md flex flex-col">
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                  Foto de Perfil
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) {
                        setFieldValue("profilePicture", file);
                        setSelectedFile(file.name);
                      } else {
                        setFieldValue("profilePicture", null);
                        setSelectedFile(null);
                      }
                    }}
                  />

                  <label
                    htmlFor="profilePicture"
                    className="bg-azulCjr text-white text-sm  px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-300"
                  >
                    Escolher arquivo
                  </label>

                  <span className="ml-4 text-sm text-gray-600">
                    {selectedFile || "Nenhum arquivo selecionado"}
                  </span>
                </div>

                <ErrorMessage
                  name="profilePicture"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex items-center justify-around p-5">
                <button
                  className="bg-azulCjr font-semibold text-white px-7 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                  onClick={() => history.back()}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-azulCjr font-semibold text-white px-7 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                >
                  {isSubmitting ? "Enviando..." : "Salvar"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}