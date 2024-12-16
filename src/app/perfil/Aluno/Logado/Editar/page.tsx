"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { api } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fixedUserId = 2;

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
        !value ||
        (value instanceof File &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    ),
});

const initialValues = {
  name: "",
  password: "",
  department: "",
  program: "",
  profilePicture: null,
};

const EditarPerfil = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [programs, setPrograms] = useState<{ id: number; name: string }[]>([]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data as { id: number; name: string }[]);
    } catch (error) {
      console.error("Erro ao carregar departamentos:", error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await api.get("/programs");
      setPrograms(response.data as { id: number; name: string }[]);
    } catch (error) {
      console.error("Erro ao carregar programas:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchPrograms();
  }, []);

  const onSubmit = async (
    values: typeof initialValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    const payload: {
      name?: string;
      password?: string;
      departmentId?: number;
      programId?: number;
      profilepic?: File | null;
    } = {};

    if (values.name) payload.name = values.name;
    if (values.password) payload.password = values.password;
    if (values.department) payload.departmentId = parseInt(values.department, 10);
    if (values.program) payload.programId = parseInt(values.program, 10);
    if (values.profilePicture) payload.profilepic = values.profilePicture;

    try {
      const response = await api.patch(`/user/${fixedUserId}`, payload);
      console.log("Dados enviados com sucesso:", response.data);
      toast.success("Perfil atualizado com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar o perfil. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await api.delete(`/user/${fixedUserId}`);
      toast.success("Perfil excluído com sucesso.");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Erro ao excluir o perfil:", error);
      toast.error("Erro ao excluir o perfil. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-row h-screen w-full bg-gray-100 pt-32 justify-center p-6">
      <ToastContainer />
      <div className="bg-customGreen p-6 rounded-lg w-[28%] max-h-fit shadow-lg">
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
              <div className="bg-white p-4 rounded-[30px] shadow-md">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="mt-1 block w-full border-0 border-b-2 border-gray-50 focus:outline-none focus:border-blue-400 focus:ring-0 transition duration-300"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="bg-white p-4 rounded-[30px] shadow-md">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="flex items-center relative">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-50 focus:outline-none focus:border-blue-400 focus:ring-0 transition duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800 transition"
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="bg-white p-4 rounded-[30px] shadow-md">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Departamento
                </label>
                <Field
                  as="select"
                  name="department"
                  className="mt-1 text-xs block w-full border-0 border-b-2 border-gray-50 focus:outline-none focus:border-blue-400 focus:ring-0 transition duration-300"
                >
                  <option value="" disabled>Selecione o Departamento</option>
                  {departments.map((department: { id: number; name: string }) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="department" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="bg-white p-4 rounded-[30px] shadow-md">
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                  Curso
                </label>
                <Field
                  as="select"
                  name="program"
                  className="mt-1 text-xs block w-full border-0 border-b-2 border-gray-50 focus:outline-none focus:border-blue-400 focus:ring-0 transition duration-300"
                >
                  <option value="" disabled>Selecione o Curso</option>
                  {programs.map((program: { id: number; name: string }) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="course" component="div" className="text-red-500 text-sm mt-1" />
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
                    className="bg-azulCjr text-white text-sm px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-300"
                  >
                    Escolher arquivo
                  </label>
                  <span className="ml-4 text-sm text-gray-600">
                    {selectedFile || "Nenhum arquivo selecionado"}
                  </span>
                </div>
                <ErrorMessage name="profilePicture" component="div" className="text-red-500 text-sm mt-1" />
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
      <div className="bg-red-500 ml-5 p-6 max-h-fit flex flex-col items-center rounded-lg w-full max-w-md shadow-lg">
        <div className="text-center mb-6 p-2">
          <h1 className="text-3xl font-bold text-white mb-4">Excluir Perfil</h1>
          <p className="text-xs italic text-white">
            Tem certeza de que deseja excluir seu perfil? Sentiremos sua falta, mas respeitamos sua decisão. Lembre-se:
            esta ação não pode ser desfeita.
          </p>
        </div>
        <button
          onClick={handleDeleteProfile}
          className="bg-white text-black font-semibold px-7 py-2 rounded-lg hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default EditarPerfil;